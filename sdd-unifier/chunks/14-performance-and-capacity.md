<!--
CHUNK: 14
TITLE: Performance & Capacity Planning
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 09
PART OF: SDD - [Project Name]
-->

# 18. Performance & Capacity Planning

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

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 13a-service-detailed-template.md | NEXT: 15-environments.md -->
