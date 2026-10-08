# Modes: Output shape and Direction

This skill has **two orthogonal mode dimensions**:

1. **Output shape** (CHUNKS / COMBINED): the file layout of the deliverable.
2. **Direction** (FROM-CODE / FROM-SDD / HYBRID / PARTIAL): the source of truth for the content.

The skill always asks for the direction at the start of any invocation. The shape is determined by argument or interactive prompt with CHUNKS as default; an existing LLD keeps its own shape without a prompt (SKILL.md § Interactive shape prompt).

---

## Output shape

### CHUNKS shape (default)

**Output:** A folder of `.md` files written to `./lld-[project-slug]/`.

**Skeleton source:** `chunks/*.md` (embedded in this skill folder).

**File list (canonical):**

```
lld-[project-slug]/
├── [project-slug]-lld-master.md     # Master index (regenerated per project)
├── 00-metadata.md
├── 01-purpose-and-scope.md
├── 02-context.md
├── 03-architecture.md
├── 04-implementation/               # one file per service
│   ├── [service-1-slug].md
│   ├── [service-2-slug].md
│   └── ...
├── 05-data-model.md
├── 06-api-contracts.md
├── 07-event-contracts.md
├── 08-state-and-rules.md
├── 09-cross-cutting.md
├── 10-operations.md
├── 11-security.md
├── 12-performance.md
├── 13-testing.md
├── 14-frontend.md                   # CONDITIONAL: only if UI exists
├── 15-open-questions.md
├── 16-references.md
├── 17-specs.md
└── 18-open-items-and-clarifications.md
```

`[project-slug]-lld-master.md` (skeleton: `chunks/lld-master.md`) is the master index pointing at the chunks. Regenerate it per project so it links to that project's chunks specifically.

**Each chunk starts with** the self-describing HTML comment block:

```markdown
<!--
CHUNK: 04
TITLE: Per-Service Implementation - [Service Name]
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->
```

See `chunking.md` for the canonical chunk map and per-service split rules.

**When to prefer CHUNKS:**

- Multi-service systems where each service deserves its own file.
- Teams editing different sections in parallel.
- The LLD is large (>800 lines is typical for multi-service systems).
- Per-service chunks need to be regenerated as services evolve.
- AI implementer downstream: single-file-per-service makes context loading clean.

### COMBINED shape

**Output:** A single `.md` file written to `./LLD-[ProjectName]-v[X.X].md`.

**Skeleton source:** `TEMPLATE-COMBINED.md`.

**Structure follows the template top-to-bottom** (sections 1–21 per `TEMPLATE-COMBINED.md`).

**No chunk comment blocks** in combined shape: the file is a single artefact.

**When to prefer COMBINED:**

- Single-service systems (1 bounded context).
- Sharing as one attachment to a stakeholder, vendor, or external reviewer.
- Submitting for a formal architecture review pipeline that expects one file.
- Archiving a finalised version.

### Cross-shape conversion

The two shapes are reversible.

**Chunks → Combined (merge)**: see `chunking.md` § Merge handling.

**Combined → Chunks (re-chunk)**: see `chunking.md` § Re-chunk handling.

---

## Direction

### FROM-CODE (reverse-engineering)

The user points the skill at an existing source-code path. The skill orchestrates two specialist agents:

1. **`feature-dev:code-explorer`**: discovers entry points, call graph, dependencies, data tables touched, Kafka topics produced/consumed, structural pattern detection.
2. **`code-documentation:docs-architect`**: synthesises per-service narratives, sequence stories, design-pattern rationale.

See `code-extraction.md` for the agent dispatch templates and `agent-orchestration.md` for the briefing patterns.

**Confidence weighting:** structural claims default to high confidence; semantic claims default to medium unless cross-validated. See `confidence-rules.md`.

**Use-case trace:** only when an SDD is given for cross-reference. Entry points and routes are matched to its §7.3 and the BRD screens (`code-extraction.md` § Tracing to BRD use cases). Without an SDD, workflows are headed `### Workflow: [name]` and no use case ID is made up.

**When to use:** an existing codebase needs an LLD for documentation, audit, onboarding, or as input to a refactor.

### FROM-SDD (forward design, greenfield)

The user points the skill at an SDD (chunked folder or combined file), optionally also a BRD. The skill applies the field mapping in `sdd-to-lld.md` and the CLAUDE.md design rules in `pattern-rules.md`.

**Pattern aggressiveness:** every CLAUDE.md rule that applies is applied with explicit attribution and rationale (per `pattern-rules.md`).

**Use-case trace:** every BRD use case in scope is traced from SDD §7.3, with its BRD key, to its workflow block, routes and screens, test cases, e2e specs, and `use_case` attribute (`sdd-to-lld.md` § Use-case traceability).

**When to use:** greenfield project before any code exists; the LLD is the build target.

### HYBRID (two-pass + drift)

Both inputs available *and* the code is complete. The skill:

1. Runs FROM-SDD pass internally → "designed" view per section.
2. Runs FROM-CODE pass internally → "built" view per section.
3. Section-by-section diff → unified LLD with inline drift markers (`⚠ drift`, `🆕 code-only`, `⛔ sdd-only`).

The use-case trace follows SDD §7.3 and the BRD; code that contradicts them is marked as drift (`hybrid-drift.md` § Use-case trace drift).

See `hybrid-drift.md` for the diff rules.

**When to use:** existing service with both an SDD and live code; you want a single doc that surfaces design-vs-reality drift.

### PARTIAL (some code + SDD)

The user points the skill at an SDD covering full scope, but only some services are coded. The skill:

1. Identifies which services have code (via `code-explorer`).
2. Runs FROM-CODE on the existing services.
3. Emits the placeholder from `transform-detection.md` § Partial-code resolution (status, the use cases it owns as not built, the re-run TODO) for un-built services in `04-implementation/<service>.md` files.

**When to use:** mid-build state where some services are scaffolded and you want to capture current state without inflating the unbuilt parts from SDD intent alone.

---

## Mode is independent of intent

|  | FROM-CODE | FROM-SDD | HYBRID | PARTIAL |
|---|---|---|---|---|
| **CHUNKS** | Reverse-engineer 19-chunk LLD from code. | Forward-design 19-chunk LLD from SDD. | Two-pass + unified 19-chunk LLD with drift markers. | From-code on existing services; the not-yet-built placeholder (the Status / Owns use cases / TODO re-run block, `transform-detection.md` § Partial-code resolution) for the rest. |
| **COMBINED** | Reverse-engineer single-file LLD. | Forward-design single-file LLD. | Two-pass + unified single-file LLD with inline drift markers. | Same as chunks but in one file. |

See `transform-detection.md` for how the skill prompts for direction and resolves ambiguity.
