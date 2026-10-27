<!--
CHUNK: 02
TITLE: Classification and Path
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01
PART OF: Pre-SDD - [Project Name]
-->

# 2. Classification and Path

<!-- Rules: classification-and-paths.md. The classification follows the Standard: change type (HDR-07: greenfield, brownfield, or mixed) crossed with the intended target (HDR-08: on-prem, cloud, hybrid, or undecided), which gives the path code (GF-OP, GF-CL, BF-OP, BF-CL). Hybrid is one cloud and one on-prem sub-assessment plus a boundary analysis, never a fifth path. The migration overlay sits on top of any path. The recovery tier (Simple, Complex, or none) only points at the closest worked example. -->

## 2.1 Classification

<!-- The engine renders the classification from the project state (fragment `02-classification.md`): the change type, the target, the path code, hybrid, the migration overlay (applies or not, source platform, direction), the recovery tier, and the closest worked example. Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 02-classification.md -->
| Item | Value | Source |
|------|-------|--------|
| Change type (HDR-07) | [greenfield / brownfield / mixed] | [Source] |
| Intended target (HDR-08) | [onprem / cloud / hybrid / undecided] | [Source] |
| Path code | [GF-OP / GF-CL / BF-OP / BF-CL / hybrid: both codes] | Engine |
| Migration overlay | [applies / does not apply], source [unknown / onprem / samecloud / othercloud / mixed] | [Source] |
| Recovery tier | [Simple / Complex / none] | Engine |
| Closest worked example | [example file, or none] | Engine |
<!-- /ENGINE-FRAGMENT -->

## 2.2 Path Evidence

<!-- The Standard's § 7 extension for the selected path: the additional evidence it asks for, what this Pre-SDD holds for each, and where (a register entry, a BRD citation, or an unknown QD-NN). Undecided target: say which placements are compared and point to chunk 07. Each line cites its evidence; a line with none names its unknown. -->

| Evidence the path needs (Standard § 7) | What this Pre-SDD holds | Where |
|----------------------------------------|-------------------------|-------|
| [Evidence item for the path] | [Summary] | [Entry ID, BRD citation, or QD-NN] |

**Required outputs of the path:**

<!-- The Standard's § 7 "Required outputs" for the selected path, each with the chunk that holds it (for example "fault-domain and DR model: chunk 05 § 5.2"), or the unknown that keeps it open. -->

- [Required output]: [chunk and section, or QD-NN]

## 2.3 Hybrid Boundary

<!-- Only for a hybrid target: which components sit on each side, the boundary flows, and the latency and data rules across it (DT-06). Otherwise write exactly: "Not applicable: the target is not hybrid." -->

[Boundary analysis, or "Not applicable: the target is not hybrid."]

## 2.4 Migration Overlay

<!-- Whether the overlay applies (switched on in stage 2 with the set-overlay op, by a person or a fixture owner, or by the skill with its citation in `cite`), the source platform, and the workloads (WL-NN). When it applies, point to chunk 08; otherwise write "Not applicable: no workload crosses a hosting or platform boundary." -->

[Statement, with a link to [08 Migration Overlay](./08-migration-overlay.md), or "Not applicable: no workload crosses a hosting or platform boundary."]

## 2.5 Closest Worked Example

<!-- The engine's pointer to the closest of the eight worked examples, from the path code and the recovery tier. The example is an illustration, never a template or a source of values. A light run gives no pointer: write "Not given in a light run." -->

[Example, from the fragment, and one line on what it illustrates; or "Not given in a light run."]

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 01-business-brief.md | NEXT: 03a-register-business.md -->
