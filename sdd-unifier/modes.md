# Modes — Chunks vs Combined

The skill produces output in one of two shapes. The shape is determined either by the argument passed (`sdd-unifier chunks` / `sdd-unifier combined`) or, when no argument is passed, by the interactive mode prompt with CHUNKS as the default.

---

## CHUNKS mode (default)

**Output:** A folder of `.md` files, one per logical template-section grouping, written to `./sdd-[project-slug]/`.

**Skeleton source:** `chunks/*.md` (embedded in this skill folder).

**File list (canonical):**

```
sdd-[project-slug]/
├── 00-cover-and-changelog.md
├── 01-executive-summary-scope-risks.md
├── 02-ecosystem-overview.md
├── 03-users-and-use-cases.md
├── 04-architecture-style-and-diagrams.md
├── 05-workflows-and-sequences.md
├── 06-principles-and-decisions.md
├── 07-cross-cutting-concerns.md
├── 08-integrations.md
├── 09-services-summary.md
├── 10-events-hub.md                # centralized event hub: catalog + payload contracts
├── 11-api-contracts.md             # service integration API contracts (external ones TBD)
├── 13a-service-[svc-1-slug].md     # one chunk per service
├── 13b-service-[svc-2-slug].md
├── 13c-service-[svc-N-slug].md
├── 12-centralized-user-roles.md    # platform-wide roles & authorities
├── 14-performance-and-capacity.md
├── 15-environments.md
├── 16-operations-runbook.md
├── 17-appendix-and-wishlist.md
├── 18-open-items-and-clarifications.md   # reviewer output (post-generation)
├── 19-e2e-system-design.md         # end-to-end system map (gated: written only after 18 is cleared)
├── decision-log.md                 # decision register (companion file; created on first use; never merged)
└── [project-slug]-sdd-master.md                   # master index + Generation Progress (regenerated per project)
```

**Generation option:** CHUNKS mode is written in three reviewed parts by default (`parts`: 00-09, then `13x` + 10 + 12 + 11, then 14-18 with 19 behind the e2e gate), or in one run with `whole`. See `parts-mode.md`.

`[project-slug]-sdd-master.md` (skeleton: `chunks/sdd-master.md`) is the master index. Regenerate it per project so it links to that project's chunks specifically.

**Each chunk starts with** the self-describing HTML comment block:

```markdown
<!--
CHUNK: 04
TITLE: Architecture Style & Diagrams
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: SDD — [Project Name]
-->
```

See `chunking.md` for chunking strategy and merge handling.

**When to prefer:**

- Multi-service systems where each service deserves its own detailed-spec chunk.
- Teams editing different sections in parallel (architects own arch chunks; SRE owns runbook; service teams own per-service chunks).
- The SDD is large (>800 lines is typical for multi-service systems).
- Per-service chunks need to be regenerated as services evolve.

---

## COMBINED mode

**Output:** A single `.md` file written to `./SDD-[ProjectName]-v[X.X].md`.

**Skeleton source:** `TEMPLATE-COMBINED.md` (embedded in this skill folder).

**Structure follows the template top-to-bottom (sections 1–24; §24 is appended only once the e2e gate is open):**

1. Executive Summary
2. Scope (In / Out)
3. Assumptions
4. Risks
5. Glossary
6. Ecosystem Overview (incl. Architecture Doctrine: EDA + DDD + Hexagonal)
7. System Users & Use Cases (Actors + Use Case Diagram + Use Case Traceability)
8. System Design / High-Level Architecture (Style, Context, HL Arch, Workflow, Sequence diagrams)
9. Architecture Principles
10. Architectural Decisions (ADR summary table)
11. Cross-Cutting Concerns (DB, Multi-tenancy, Deployment, Observability, Config, Security defaults)
12. Integrations
13. Services Decomposition (Summary)
14. Centralized Event Hub (Platform Event Catalog & Payload Contracts)
15. Service Integration API Contracts (external contracts TBD until the user supplies them)
16. Centralized User Roles & Authorities (platform-wide)
17. Detailed Service Specs (one 17.X block per service)
18. Performance & Capacity Planning
19. Environments
20. Operations Runbook
21. Appendix
22. Wishlist
23. Open Items & Clarifications (reviewer output)
24. End-to-End System Design (gated: appended only after §23 is cleared)

**No chunk comment blocks** in combined mode — the file is a single artefact.

**Always `whole`.** A combined SDD is written in one run; `combined parts` is not available. The decision register still lives outside the file, at `./sdd-[project-slug]/decision-log.md`.

**When to prefer:**

- Single-service systems (1 bounded context).
- Sharing as one attachment to a stakeholder, vendor, or external reviewer.
- Submitting for a formal architecture review pipeline that expects one file.
- Archiving a finalised version.

---

## Cross-mode conversion

The two modes are reversible.

### Chunks → Combined (merge)

When the user says "merge", "consolidate", "single file", "full doc" after a chunks-mode generation:

1. Read all `sdd-[slug]/NN-*.md` files in file-sort order (00 … 09, 10, 11, 12, 13a, 13b, …, 14 … 18, then 19 if it exists).
2. Strip each chunk's `<!-- CHUNK: ... -->` HTML comment block.
3. Concatenate with a single blank line between chunks.
4. Deduplicate the repeated `# 17. Detailed Service Specs` parent heading (keep only the first) and renumber the §17.X service blocks if out of order.
5. Regenerate the Table of Contents in the cover section against the merged heading outline.
6. Regenerate the Figures and Tables indices.
7. Write to `./sdd-[slug]/SDD-[ProjectName]-v[X.X]-MERGED.md` (alongside the chunks). `[project-slug]-sdd-master.md` and `decision-log.md` are never merged.
8. Keep the original chunks.

### Combined → Chunks (re-chunk)

When the user says "split into chunks", "chunk this SDD", "re-chunk this":

1. Read the combined file fully.
2. Identify section boundaries by `# `, `## ` headings matching the template structure.
3. Group sections per the canonical chunk map (see `chunking.md`).
4. For section 17 (Detailed Service Specs), each `## 17.X` block becomes its own chunk file (`13a-service-*.md`).
5. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block.
6. Heading levels stay as-is (the template uses absolute numbering like `# 1.`, `## 1.1`, so no demotion is needed).
7. Write each chunk file (plus a regenerated `[project-slug]-sdd-master.md` index).
8. Keep the original combined file.

---

## Mode is independent of intent

Mode (CHUNKS / COMBINED) describes the **output shape**. Intent (GENERATE / TRANSFORM / DERIVE-FROM-BRD) describes the **input handling**. They are orthogonal:

|  | GENERATE | TRANSFORM | DERIVE-FROM-BRD |
|---|---|---|---|
| **CHUNKS** | Author fresh SDD as 19+ chunked files. | Re-shape source SDD into 19+ chunked files. | Generate skeleton SDD from BRD as 19+ chunked files; SDD-only sections are stubs with `[NEEDS CLARIFICATION: ...]`. |
| **COMBINED** | Author fresh SDD as a single file. | Re-shape source SDD into a single file. | Generate skeleton SDD from BRD as a single file; same flagging behaviour. |

See `transform-detection.md` for how to decide intent.
