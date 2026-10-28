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
## DB-10: Per-workload data architecture
- Trigger: type=relational; consistency=strong
- Candidate: Recommend logical data-store pattern; compare provider products and failover semantics.
- Validation: Validate operations, constraints and benchmarks per workload.
- Requirements: REQ-DAT-001, REQ-DAT-002
## SLO-15: One outage can consume SLO budget
- Trigger: RTO=4 h; 30-day budget=43.2 min
- Candidate: One full-length, user-visible outage in the measurement window may exceed the availability allowance; not inherently contradictory.
- Validation: Clarify measurement exclusions and design impact on customer journeys.
- Requirements: REQ-REL-001, REQ-DR-001

## Architect override
Topology: auto
DR: auto
Rationale: not supplied