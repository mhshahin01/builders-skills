<!--
CHUNK: 17
TITLE: Specs
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: the source SDD (§1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition) and this LLD's 00-metadata.md / 03-architecture.md
PART OF: LLD - [Project Name]
PURPOSE: Constitution-grade summary, owned by lld-unifier and authored AFTER the LLD body. Synthesised from the source SDD (Mission from SDD §1, Tech Stack from SDD §6 with version pins, Roadmap from SDD §13 + BRD UC ownership) plus the Project Type recorded at SDD intake. Source of truth for speckit `/constitution`. Tone: short, precise, clear, simple. No narrative. No marketing.
SPECKIT_NOTE: Sub-sections 1 (Mission), 2 (Tech Stack), and 3 (Roadmap) are intended as direct inputs for speckit's `/constitution`. Sub-section 4 (Project Type) documents the direction decision that shaped this LLD.
LEGACY_NOTE: Older chains carried the Specs at the SDD (`../sdd-[sdd-slug]/15-specs.md` / `# 19. Specs`) or the BRD (`../brd-[brd-slug]/12-specs.md`). If a legacy Specs exists, it was consumed as input; this chunk is the canonical copy going forward.
-->

# Specs

> **Purpose.** Constitution-grade summary of this system, written after the LLD body is complete. Speckit's `/constitution` reads this verbatim. Sub-section 2 (Tech Stack) mirrors the resolved runtime stack that steered this LLD's pattern selection; sub-section 4 (Project Type) records the direction decision. Each sub-section is short by design.

---

## 1. Mission

<!--
2-3 sentences. Distilled from the SDD's §1 Executive Summary. Core idea only.
Answer: what is this product, who is it for, what is the single core outcome.
No metrics, no features list, no fluff. If it cannot fit in 3 sentences, distil further.
From-code direction (no SDD): distil from the discovered system purpose and flag `> Confirm:`.
Used directly by speckit /constitution.
-->

[2-3 sentences. Core idea only.]

---

## 2. Tech Stack

<!--
Consolidated from the SDD's §6 Ecosystem Overview - verbatim, with version pins - and cross-checked against this LLD's §6.3 Runtime Stack (they must agree; a mismatch is drift to flag, not to hide).
One bullet per tier, language + framework + key version.
If a tier is not applicable to this product, write "Not applicable." - do not delete the row.
A version pin missing from the resolved stack is never asked for: write the tier without it and point to the §6.3 `> TODO:` that routes it to SDD §6 (SKILL.md step 6b).
From-code direction (no SDD): read from the actual dependency manifests (high confidence).
Used by speckit /constitution AND by pattern-rules.md for stack-appropriate pattern selection.
-->

- **Backend:** [Language + framework + version, e.g., Java 21, Spring Boot 3.5+]
- **Frontend:** [Language + framework + version, e.g., Angular 17+ standalone, Tailwind, PrimeNG] | Not applicable.
- **Mobile:** [Platform + framework, e.g., Flutter 3.x, or iOS Swift 6 / Android Kotlin] | Not applicable.
- **Data:** [Primary store + version, e.g., PostgreSQL 17+]
- **Messaging:** [If event-driven, e.g., Kafka on prem / SQS+SNS on AWS] | Not applicable.

---

## 3. Roadmap

<!--
Phases derived from the SDD's §13 Services Decomposition and the BRD use cases each service owns. Each phase is a coherent, deployable slice of capability the team can ship and stakeholders can review.
3-6 phases is typical. More than 8 means the slicing is too fine; fewer than 2 means it is too coarse.
Each phase: short label + one-line scope + the services / BRD UC IDs it covers. UC IDs are written as SDD §7.3 writes them, with their BRD key (plain text, no links).
From-code direction (no SDD): write "Not applicable - reverse-engineered LLD."
Used by speckit /constitution to set ordering expectations and by execution agents to plan delivery sequences.
-->

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - [Foundation label] | [What this phase delivers] | [service-a; [KEY]/UC-01, [KEY]/UC-02] |
| P2 - [Phase 2 label] | [What this phase delivers] | [service-b; [KEY]/UC-03, [KEY]/UC-04] |
| P3 - [Phase 3 label] | [What this phase delivers] | [service-c; [KEY]/UC-05, [KEY]/UC-06] |

---

## 4. Project Type

<!--
Pick exactly one. Recorded at SDD intake (SDD §1) or asked at LLD intake if absent. The choice gated the LLD direction decision (greenfield -> from-sdd; brownfield -> from-code / hybrid) - see transform-detection.md.
-->

- [ ] **Greenfield** - new product, no pre-existing codebase to honour.
- [ ] **Brownfield** - extending or re-architecting an existing codebase. Cite the codebase reference: [path or repo URL].

**Selected:** [Greenfield | Brownfield]

**Justification (one line):** [Why this classification.]

**LLD direction taken:** [from-sdd | from-code | hybrid | partial]

<!-- MASTER: [project-slug]-lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->
