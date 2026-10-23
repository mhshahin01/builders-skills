# Pre-SDD recommendation trace

## ARCH-01: Classification & hosting
- Trigger: change=greenfield; target=cloud
- Candidate: Route to GF-CL; migration is a separate overlay.
- Validation: Confirm target-hosting responsibility and hard platform restrictions.
- Requirements: REQ-PLAT-001, REQ-PLAT-002
## HA-02: Multi-zone availability candidate
- Trigger: fault=az, availability=99.9%
- Candidate: Use independent failure zones and avoid shared single points where feasible. This is HA, not proof of region DR.
- Validation: Check zone support, shared dependencies, measured failover and supported availability.
- Requirements: REQ-REL-001, REQ-DR-003
## CAP-04: Workload-based capacity planning
- Trigger: peak=57.87 TPS; 190.97 API RPS
- Candidate: Size and benchmark at sustained peak with headroom and failure-mode capacity.
- Validation: Obtain peak duration, load profile, per-instance P99 throughput, storage IOPS and growth.
- Requirements: REQ-CAP-001, REQ-CAP-002
## DR-06: Extremely short recovery objective
- Trigger: RTO=0 s for az
- Candidate: Explore automated detection/traffic switch and pre-provisioned recovery; do not promise objective.
- Validation: Measure recovery critical path and failback in destructive tests.
- Requirements: REQ-DR-001, REQ-DR-003
## DR-ZERO-01: Zero interruption target: continuous serving required
- Trigger: RTO=0 s; failure scope=az
- Candidate: Show active-serving application capacity in independent fault domains for study. A drawn active-active topology is not proof of no interruption; data writes and external dependencies need separate protection.
- Validation: Define end-user interruption measurement, run disruptive failover/partition tests, and verify DNS, capacity, identity and SLI results.
- Requirements: REQ-DR-001, REQ-DR-003
## DR-ZERO-02: Zero loss + no interruption: correctness/availability trade-off
- Trigger: RTO=0 s; RPO=0 s; consistency=strong
- Candidate: Explore quorum or synchronous commit where feasible, including potential write unavailability and latency under partition. Dual serving application tiers do NOT imply safe multi-writer databases.
- Validation: Verify acknowledged-write durability, partition behavior, commit latency, fencing, failback and end-to-end service recovery.
- Requirements: REQ-DR-001, REQ-DR-002, REQ-DAT-002
## DATA-07: Zero acknowledged-write loss objective
- Trigger: RPO=0 seconds
- Candidate: Asynchronous cross-region replicas alone do not prove zero-loss durability. Assess partitions, write acknowledgements and quorum/commit semantics.
- Validation: Design + exercise data correctness during abrupt writer loss and replica promotion.
- Requirements: REQ-DR-002, REQ-DAT-002
## DB-10: Per-workload data architecture
- Trigger: type=relational; consistency=strong
- Candidate: Recommend logical data-store pattern; compare provider products and failover semantics.
- Validation: Validate operations, constraints and benchmarks per workload.
- Requirements: REQ-DAT-001, REQ-DAT-002

## Architect override
Topology: auto
DR: auto
Rationale: not supplied