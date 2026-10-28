# Modes: Output mode and Direction

This skill has **two orthogonal dimensions**:

1. **Output mode** (CHUNKS / COMBINED): the file layout of the deliverable.
2. **Direction** (FROM-CODE / FROM-SDD / HYBRID / PARTIAL): the source of truth for the content.

The skill always asks for the direction at the start of any invocation. The output mode is set by argument or interactive prompt, with CHUNKS as default. An existing LLD keeps its own mode without a prompt (SKILL.md § Interactive mode prompt). A third setting, the generation option (`parts` or `whole`), decides how much of a first build is written before the user reviews it (`parts-mode.md`).

---

## Output mode

### CHUNKS mode (default)

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
├── 03a-libraries-and-conventions.md # §6.5; an LLD written before it existed has none
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
├── 18-open-items-and-clarifications.md
├── 19-for-ppt.md                    # ON REQUEST: implementation deck brief, once chunk 18 is cleared; never merged; not part of a build
└── decision-log.md                  # decision log (companion file; created on first use; never merged)
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

**Generation option.** A first build in CHUNKS mode is written in three parts by default, with a stop after parts 1 and 2 (`parts-mode.md`). `whole` writes chunks 00-18 in one run. COMBINED mode is always written whole: `combined parts` is not available.

**When to prefer CHUNKS:**

- Multi-service systems where each service deserves its own file.
- Teams editing different sections in parallel.
- The LLD is large (>800 lines is typical for multi-service systems).
- Per-service chunks need to be regenerated as services evolve.
- AI implementer downstream: single-file-per-service makes context loading clean.

### COMBINED mode

**Output:** A single `.md` file written to `./LLD-[ProjectName]-v[X.X].md`.

**Skeleton source:** `TEMPLATE-COMBINED.md`.

**Structure follows the template top-to-bottom** (sections 1 to 21 per `TEMPLATE-COMBINED.md`).

**No chunk comment blocks** in combined mode: the file is a single artefact.

**The decision log stays outside the file**, at `./lld-[project-slug]/decision-log.md` (the folder is created for it): the combined file holds the design only.

**The deck brief stays outside the file too.** On request, once chunk 18 is cleared, it is written to `./lld-[project-slug]/19-for-ppt.md`, and its links point at the combined file (SKILL.md step 7c item 6).

**When to prefer COMBINED:**

- Single-service systems (1 bounded context).
- Sharing as one attachment to a stakeholder, vendor, or external reviewer.
- Submitting for a formal architecture review pipeline that expects one file.
- Archiving a finalised version.

### Cross-mode conversion

The two modes are reversible.

**Chunks → Combined (merge)**: see `chunking.md` § Merge handling. The merge skips `19-for-ppt.md` (and `decision-log.md`).

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

**Rules:** the stack as SKILL.md step 3a settled it, and every rule the project instruction file or the SDD states, are applied with attribution and rationale (per `pattern-rules.md`). A rule no source states is applied as a proposal, flagged (SKILL.md principle 10).

**Use-case trace:** every BRD use case in scope is traced from SDD §7.3, with its BRD key. The trace runs to its workflow block, routes and screens, test cases, e2e specs, and `use_case` attribute (`sdd-to-lld.md` § Use-case traceability).

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
3. Emits the placeholder from `transform-detection.md` § Partial-code resolution for un-built services, in `04-implementation/<service>.md` files. The placeholder holds the status, the use cases it owns as not built, and the re-run TODO.

**When to use:** mid-build state where some services are scaffolded and you want to capture current state without inflating the unbuilt parts from SDD intent alone.

---

## Mode is independent of intent

|  | FROM-CODE | FROM-SDD | HYBRID | PARTIAL |
|---|---|---|---|---|
| **CHUNKS** | Reverse-engineer 20-chunk LLD from code (chunk 19, the deck brief, is not counted). | Forward-design 20-chunk LLD from SDD. | Two-pass + unified 20-chunk LLD with drift markers. | From-code on existing services; the not-yet-built placeholder (the Status / Owns use cases / TODO re-run block, `transform-detection.md` § Partial-code resolution) for the rest. |
| **COMBINED** | Reverse-engineer single-file LLD. | Forward-design single-file LLD. | Two-pass + unified single-file LLD with inline drift markers. | Same as chunks but in one file. |

See `transform-detection.md` for how the skill prompts for direction and resolves ambiguity.
