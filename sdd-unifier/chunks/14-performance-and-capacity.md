<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 09
PART OF: SDD - [Project Name]
-->

# 18. Performance & Capacity Planning

<!-- With a loaded Pre-SDD (SKILL.md step 2a), §18 cites its calculations as PSDD/CALC-NN, with the values of the calculations table in the Pre-SDD's chunk 12 § 12.2 and a link to their chunk 04 anchor, and never recomputes them: the load, throughput, latency budgets, growth, payload sizes, storage, and bandwidth are the Pre-SDD's, and this section adds what the Pre-SDD leaves to it: the per-service breakdown, sizing per deployable, caching, and the §18.4 stress testing strategy. It sizes within PSDD/INT-03 and PSDD/CAP-03, and measures its latency targets where PSDD/CAP-08 says (brd-to-sdd.md § Pre-SDD inputs (locked), the §18 and §18.5 row). Each §18.5 row cites the Pre-SDD entry that settles its NFR's target (brd-to-sdd.md § Pre-SDD inputs (locked)). A disagreement with one is a chunk 18 open item owned by the E2E Architect, never an edit (SKILL.md principle 20). -->

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| [Dimension] | [N] | [N] | [N] | [Assumptions] |
| [Dimension] | [N] | [N] | [N] | [Assumptions] |

## 18.2 Throughput Targets (per service)

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| [Service Name] | [N] | [N] | [Xms] | [Xms] | [Xms] |
| [Service Name] | [N] | [N] | [Xms] | [Xms] | [Xms] |

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| [Scenario] | [Trigger] | [Multiplier + duration] | [Mitigation] |
| [Scenario] | [Trigger] | [Multiplier + duration] | [Mitigation] |

## 18.4 Stress Testing Strategy

- **Tooling:** [Tool]
- **Environments:** [Where stress runs are executed]
- **Scenarios:** [Baseline / peak / spike / soak / failure injection]
- **Acceptance criteria:** [Criteria]
- **Cadence:** [Cadence]
- **Reporting:** [Where results live]

## 18.5 NFR Targets

<!-- Derive-from-BRD: one row per NFR of every source BRD, keyed (REFUNDS/NFR-02), with the technical target it is quantified into and where the design realises it (a §18 row, a §11 default, an ADR, or a §17.X section). A target the BRD does not imply is a [NEEDS CLARIFICATION: ...], never invented. The RPO and RTO of a recovery NFR live in §8.6.4 (chunk 05a): its row links there and holds neither a figure nor a marker of its own. -->

| BRD NFR | Technical target | Realised in |
|---------|------------------|-------------|
| [KEY/NFR-NN] | [e.g., 99.9% monthly availability] | [§18.2 / §11.3 / ADR-NN] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: [last 13x chunk, e.g. 13c-service-[slug].md] | NEXT: 15-environments.md -->
