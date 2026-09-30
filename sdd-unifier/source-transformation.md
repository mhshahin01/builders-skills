# Source Transformation — SoW, Existing SDD, or Loose Spec → Unified SDD

This file defines how to translate a non-BRD source document into the unified SDD template.

For BRD-as-source, see `brd-to-sdd.md` (it has its own dedicated mapping table).

For deciding **which** intent to use (transform vs derive vs generate), see `transform-detection.md`.

---

## Overall approach (matches brd-unifier's pattern, adapted for SDDs)

1. **Read the source in full before writing anything.** SDD sections are interdependent.
2. **Classify each source paragraph into a target template section.**
3. **Paraphrase, don't copy.** Source docs are often vendor-facing; the SDD is team-facing.
4. **Flag gaps immediately.** Every gap → `**[NEEDS CLARIFICATION: ...]**` marker.
5. **Preserve commitments verbatim.** Numbers, dates, version pins, named technologies, named systems. Replacing a named technology in §6 is a recorded design change (SKILL.md step 3c), never part of the transformation.

---

## Field-by-field mapping (SoW source — note: not the recommended path)

A SoW alone is **not** a strong source for an SDD. SDDs depend on architectural decisions; SoWs typically don't have those. This skill recommends running `brd-unifier` first (SoW → BRD), then `sdd-unifier` (BRD → SDD) per `brd-to-sdd.md`.

If the user insists on going directly from a SoW to an SDD, treat the SoW as raw context for GENERATE intent, not as a transformation target. Most SDD sections will be heavy with `[NEEDS CLARIFICATION: ...]` markers. Be explicit about this in the handoff: "This SDD was generated from a SoW directly, bypassing the BRD step. The marker count is high (N markers) because the SoW does not capture the technical decisions an SDD requires. Recommend either generating a BRD first (run brd-unifier) and re-deriving, or working through the markers with an architect."

---

## Field-by-field mapping (existing-SDD source — different format / template)

This is the main TRANSFORM path. The source is already an SDD but in a different format (vendor template, IEEE 1016, TOGAF, prior in-house "HLD" format).

### Approach

1. **Build a section crosswalk first.** Map each source section to a target template section. Note any source sections with no target.
2. **Carry content for matching sections**, restructuring to fit this template's expected sub-structure (especially per-service detailed specs — they must use the sub-sections of `chunks/13a-service-detailed-template.md`, in order: `What / Boundaries / Input / Business Logic / Output / Integrations / DB Modeling / Multi-Tenancy Specifications / API Standards / Event-Driven Architecture / Constraints / Error Handling / Observability & Monitoring / Developer Notes / Service-Level Diagrams / Compliance / Deployment Strategy / Future Enhancements`).
3. **Stub missing sections** with `[NEEDS CLARIFICATION: ...]`.
4. **Drop irrelevant sections** silently (vendor sign-off blocks, commercial appendices) and note in the handoff.

### Common source-format peculiarities

| Source format | Peculiarity | Handling |
|---|---|---|
| **IEEE 1016 SDD** | Heavy decomposition into `Identification → Function → Subordinates → Dependencies → Interface → Resources → Processing → Data` per element. | Map IEEE element decompositions to per-service blocks. IEEE's "Identification" and "Function" → `What` + `Boundaries`. IEEE's "Interface" → `Input` + `Output` + `Integrations` + `API Standards`. IEEE's "Processing" → `Business Logic`. IEEE's "Data" → `DB Modeling`. |
| **TOGAF deliverables** | Architecture Building Block / Solution Building Block / Architecture Decisions split across multiple documents. | Consolidate ABBs into §6 Ecosystem Overview, SBBs into §17.X per-service, ADs into §10 Architectural Decisions. |
| **Vendor / consultancy template** | Deck-style headings, marketing language, missing operational sections. | Strip marketing voice. Marketing-style "value propositions" → `[DROP]`. Re-structure into team-facing technical voice. Always flag missing Operations Runbook (§20). |
| **Prior in-house "HLD"** | Often missing per-service detailed specs, ADRs, runbook, capacity plan. | Carry what exists; flag the missing sections explicitly. Common gaps: §10 ADRs, §14 Centralized Event Hub, §16 Centralized User Roles, §18 Performance & Capacity, §20 Operations Runbook. |
| **Confluence / Notion exports** | Mixed concerns per page, inline TODOs, embedded diagrams as image refs. | Re-classify each page into target sections. Image refs re-authored as inline Mermaid (flag when the source image is unreadable). Inline TODOs become `[NEEDS CLARIFICATION: ...]` if unresolved. |

---

## Field-by-field mapping (loose product spec / informal source)

When the source has no clear structure (Notion brain-dump, design memo, scattered notes):

1. **Read everything first.** Identify dominant content types: architecture statements (→ §8), service descriptions (→ §13), tech choices (→ §6), risks (→ §4), decisions (→ §10).
2. **Classify paragraph by paragraph.** Heavier classification work — source isn't pre-sorted.
3. **Expect many gaps.** Loose specs typically have no per-service detailed specs, no ADR table, no NFR targets. Each missing piece is a `[NEEDS CLARIFICATION: ...]` marker.
4. **The Glossary will need active construction.** Identify terms used in the source and either define them or flag.

---

## Voice and audience

SDDs target the engineering team — architects, senior developers, SREs, on-call engineers.

| Source voice | Target voice |
|---|---|
| Vendor-obligation passive ("The Vendor shall implement...") | Active, system-as-subject ("The service exposes...") |
| Marketing aspirational ("World-class scalability") | Concrete and testable ("Sustained 500 RPS at p99 < 80ms") |
| Decision-without-rationale ("We use Kafka") | Decision-with-rationale ("Kafka chosen for: at-least-once semantics, partition-based ordering per key, mature ecosystem. See ADR-03 for full alternative comparison.") |
| Implementation-detail in design doc ("Use ConcurrentHashMap with size 1024") | Behaviour-and-constraint ("Cache must support concurrent access; sized for working-set ~13k entries") |

Drop vendor scaffolding; keep behavioural and architectural commitments.

---

## Gap inventory and thresholds

Per `brd-unifier`'s pattern, surface the count in the handoff. These bands apply to TRANSFORM and GENERATE. A DERIVE-FROM-BRD count is read differently: `brd-to-sdd.md` § Workflow when deriving from BRD, step 11.

- **0–5 markers:** healthy. Source was rich.
- **6–14 markers:** typical. Recommend review.
- **15–29 markers:** moderate gap. Recommend an architect-review session before circulating.
- **30+ markers:** the source was severely under-specified for SDD purposes. Recommend rebuilding the source first (e.g., generate a proper BRD via brd-unifier) and re-running.

Don't soften this recommendation. An SDD with 30+ open clarifications is a structured backlog, not a design document.

---

## Sanity checks before completion

- [ ] All template sections present (§1-§23, plus §24 once the e2e gate is open; chunks 00-18, plus 19), no silent drops.
- [ ] Per-service spec block (§17.X) uses the canonical sub-section names, and its Event Model matches chunk 10 (§14) verbatim.
- [ ] Cross-cutting concerns (§11) defaults are filled OR per-service overrides are explicitly stated.
- [ ] Every Mermaid figure has a prose Summary and a Figures-index entry in §0.
- [ ] No invented version pins, no fabricated technology choices.
- [ ] Every synchronous integration has an API contract in §15 (chunk 11); external contracts the source does not document are `TBD - external`.
- [ ] Operations Runbook (§20) has at minimum the standard procedure headings (Restart, Clear Cache, Replay DLQ, Rotate Secrets, DB Failover, Tenant Incident).
- [ ] Changes Log entry written.
