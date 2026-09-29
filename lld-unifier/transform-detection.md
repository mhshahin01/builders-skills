# Direction Detection — From-Code / From-SDD / Hybrid / Partial

The skill always asks for the direction at the start of any invocation. This file gives the prompt rules and the resolution logic.

---

## The mandatory prompt

After confirming output shape (chunks / combined), ask:

> **Direction?** [from-code / from-sdd / hybrid]
>
> - **`from-code`** — reverse-engineer an LLD from existing source code. Point me at a path. Uses code-explorer + docs-architect agents.
> - **`from-sdd`** — forward-design an LLD from an SDD (and BRD if linked). Greenfield, before any code exists.
> - **`hybrid`** — both inputs available, code is complete. Two-pass: generate the from-sdd view, generate the from-code view, then unify into a single LLD with inline drift markers.

**Acceptable shorthands:**

| User answer | Resolved direction |
|-------------|-------------------|
| `code`, `from-code`, `reverse`, `1` | from-code |
| `sdd`, `from-sdd`, `design`, `forward`, `greenfield`, `2` | from-sdd |
| `hybrid`, `both`, `drift`, `compare`, `3` | hybrid |
| Anything else | re-prompt once; if still unclear, ask the user explicitly |

**Smart defaults (the prompt is still asked, but with a different default suggested):**

| Inputs the skill received | Suggested default |
|---------------------------|-------------------|
| Only a code path | from-code |
| Only an SDD path | from-sdd |
| Both code path and SDD path | hybrid |
| Neither | from-sdd (the most common greenfield case); ask the user to provide an SDD |

**Project Type override.** Resolve the Project Type — recorded in the SDD §1 at SDD intake (legacy chains: SDD `15-specs.md` § 4 / combined `# 19. Specs`, or BRD `12-specs.md`) — and apply this override BEFORE the smart defaults above (it later lands in this LLD's own `17-specs.md` § 4):

| Project Type | Effect on direction default |
|---|---|
| **Greenfield** | If neither code path nor SDD path provided, default suggestion stays from-sdd. If only code path provided, the user is doing reverse-engineering of a greenfield-built service — keep from-code default but flag in handoff: "Greenfield project type per the recorded Project Type, but code is being reverse-engineered. Confirm intent." |
| **Brownfield** | If only an SDD is provided, surface a friction prompt: "Brownfield project type per the recorded Project Type — was the existing codebase intentionally excluded? Direction `from-sdd` will document the *target* design without reflecting the *current* code. Consider `hybrid` (provide both) or `from-code` (point at current code) for accurate documentation." Default suggestion becomes `hybrid` if both inputs available, else keep `from-sdd` and capture the friction in the handoff. |

This override never silently picks the direction — it adjusts the suggested default and surfaces friction. The user still confirms.

---

## Partial-code resolution

When the user picks `from-code` or `hybrid` and the skill detects that the code is *partial* (only some services exist), the skill:

1. **Detects partial-code state** by enumerating expected services (from SDD if available; from explicit user list otherwise) and comparing to what code-explorer can find.
2. **Runs from-code on existing services.**
3. **For un-built services:** emits a placeholder `04-implementation/<service>.md` with content:
   ```markdown
   > **Status:** Not yet built. SDD-described in [SDD path] §13.2.X.
   > **TODO:** when this service is scaffolded, re-run `/lld-unifier --from-code <service-path>` to populate this chunk.
   ```
4. **Notes the partial-code choice** in `15-open-questions.md` § Decisions Pending.

> **Important:** in partial mode, the SDD content for un-built services is *not* expanded into the LLD. The placeholder is the deliverable for those services. (Per agreement: if the user wants full SDD-driven content for un-built services, they should run from-sdd direction explicitly.)

---

## Hybrid mode — both inputs, complete code

When the user picks `hybrid`:

1. The skill runs an internal FROM-SDD pass producing a "designed" view of each section.
2. The skill runs an internal FROM-CODE pass producing a "built" view of each section.
3. The skill diffs section by section per `hybrid-drift.md`.
4. The output is a single unified LLD with inline drift markers — not separate `designed/` and `built/` folders.

If the code is detected as *partial* in hybrid mode, the skill falls back to the partial-code rules (above) and notes the fallback in the handoff summary.

---

## Recognising input types

### Source code (any language, any framework)

Signs:

- Path is a directory with one of: `pom.xml`, `build.gradle`, `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`, etc.
- OR a multi-module project root with multiple subdirectories matching the above.

The skill primarily targets the user's CLAUDE.md stack (Java 21 / Spring Boot 3.5+, Angular 17+), but the same chunk structure applies to any service-oriented codebase. Pattern detection heuristics are stack-aware (see `pattern-rules.md`).

### SDD (chunked folder OR combined file)

**Chunked folder signs:**

- Path is a folder ending in `sdd-*`.
- Contains files named `00-cover-and-changelog.md`, `01-executive-summary-scope-risks.md`, `02-ecosystem-overview.md`, etc.
- Each file starts with `<!-- CHUNK: NN ... PART OF: SDD — ... -->`.

If 4+ of these match, it's an sdd-unifier chunked output.

**Combined file signs:**

- Filename starts with `SDD-` (e.g., `SDD-WalletManagement-v1.0.md`).
- Has the SDD section structure: §1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition, §14 Centralized Event Hub, §15 Service Integration API Contracts, §16 Centralized User Roles, §17.X per-service blocks, §18 Performance & Capacity, §20 Operations Runbook (earlier-map SDDs: §15.X services, §17 performance, §19 runbook; legacy SDDs: §13.1/§13.2.X services, §14 performance).

If 5+ match, it's an SDD.

In either case, the SDD is read in full; field mapping per `sdd-to-lld.md`.

### BRD (chunked folder OR combined file)

Same recognition rules as in `sdd-unifier:transform-detection.md` (BRDs follow the brd-unifier convention).

A BRD is a secondary input, reached through the SDD: its Source BRDs register (chunk 00 § Document Lineage) names each BRD, its key, and its location; an older SDD names it on its cover's Related BRD line. The SDD stays the primary source for from-sdd direction. The LLD reads the BRD for two things: the IDs its use-case trace cites (use case headings in 05 and 06x, screen IDs in 11 and the use cases' UI/UX sections, `MK-NN` and Figma links in 14 Mockup coverage, test cases in 16; `sdd-to-lld.md` § Use-case traceability), and supplementary purpose, scope, and glossary content that the SDD might paraphrase.

### SoW / Statement of Work

Same as in sdd-unifier — SoW is **not** a direct input to lld-unifier. If the user provides only a SoW:

> An LLD usually derives from an SDD, not directly from a SoW. The SDD captures the design (architecture, services, contracts) and is the input the LLD operationalises. Want me to first generate a BRD via `brd-unifier`, then an SDD via `sdd-unifier`, then an LLD here? Or do you have an SDD already?

---

## What "from-code" actually means

1. Dispatch `feature-dev:code-explorer` agent. Brief it with the target path and explicit asks (entry points, call graph, dependencies, schemas, topics, structural pattern detection). See `agent-orchestration.md`.
2. Dispatch `code-documentation:docs-architect` agent with Phase 1 findings + this skill's section schema. Request per-service narratives, sequence stories, design-pattern rationale.
3. Template-fit the synthesised output into the chunks.
4. Apply confidence weighting per `confidence-rules.md` — structural high, semantic medium, etc.
5. With an SDD given for cross-reference: match entry points and routes to SDD §7.3 and the BRD screens (`code-extraction.md` § Tracing to BRD use cases). Without one, there is no use-case trace, and no workflow is numbered as a use case.
6. Index every flag in `15-open-questions.md`.

See `code-extraction.md` for the full from-code workflow.

---

## What "from-sdd" actually means

1. Read the SDD chunks (or combined file) per `sdd-to-lld.md`.
2. Read the BRD(s) the SDD names: the use case, screen, mockup, and test case IDs the trace cites, plus supplementary purpose / scope / glossary content.
3. Apply CLAUDE.md pattern rules per `pattern-rules.md` aggressively.
4. Trace every BRD use case per `sdd-to-lld.md` § Use-case traceability.
5. For sections the SDD + CLAUDE.md cannot together fill (SLOs, threat notes, peak scenario multipliers): emit `> TODO: <best-guess> — verify`.
6. Index every flag in `15-open-questions.md`.

See `sdd-to-lld.md` for the full mapping table.

---

## What "hybrid" actually means

1. Run the from-sdd workflow internally → "designed" content per section (in memory, not written).
2. Run the from-code workflow internally → "built" content per section (in memory, not written).
3. Section by section, compare per `hybrid-drift.md`:
   - Match → emit clean (no drift marker).
   - Differ → emit reconciled content + `⚠ drift` marker + `> Drift note: SDD says X, code does Y.`
   - Code-only → emit code content + `🆕 code-only` marker.
   - SDD-only → emit SDD content + `⛔ sdd-only` marker.
   - The use-case trace follows SDD §7.3 and the BRD; code that disagrees is marked per `hybrid-drift.md` § Use-case trace drift.
4. Write the unified LLD to disk.
5. Index every drift marker in `15-open-questions.md`.

See `hybrid-drift.md` for the full diff rules.

---

## Edge cases

### "Update this LLD" (existing LLD with light changes)

Treat as targeted regeneration:

- Identify which chunks the user wants changed.
- Regenerate only those.
- Bump version in Changes Log.

### "Add a service to this LLD"

Treat as targeted add:

- In CHUNKS shape: add a new `04-implementation/<service-slug>.md`; update the `[project-slug]-lld-master.md` index; cross-check `05-data-model.md`, `06-api-contracts.md`, `07-event-contracts.md` for new tables/endpoints/topics.
- Trace the use cases the new service owns (SDD §7.3): their 04 workflow blocks, 14 §17.3 routes, 13 §16.8 specs, and 16 §19.9 index rows. Update the Scope of this LLD's row in the SDD's Child LLDs table.
- Bump version.

### Source is in a non-English language

Translate facts; preserve names. Flag in handoff summary.

### Mixed SDD+code with intentional drift (the architect tolerates the drift)

Run hybrid; let the user resolve drift markers in `15-open-questions.md` per row (resolution = "tolerated by design — see ADR-NN" rather than "fix code" or "fix SDD").
