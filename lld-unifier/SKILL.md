---
name: lld-unifier
description: >-
  Generate, transform, or reformat a Low-Level Design (LLD) into the user's standard template. Use
  when asked to create, draft, write, build, or unify an LLD, low-level design, implementation
  design, detailed design, or service design. Three directions, always asked first: from-sdd
  (design before code exists), from-code (reverse-engineer an LLD from a codebase), and hybrid
  (compare an SDD with the code and mark drift). Traces every BRD use case from the SDD's §7.3 to
  its workflow, routes and screens, UAT/BAT test cases, e2e specs, and runtime use_case attribute,
  with keyed IDs (REFUNDS/UC-04). Also owns the Specs section (Mission, Tech Stack, Roadmap,
  Project Type) used as input for speckit /constitution. Arguments: [chunks|combined] [light],
  default chunks. Output is Markdown only.
---

# LLD Unifier

Author, transform, and unify Low-Level Design Documents (LLDs) into the user's standardised template. This skill encapsulates the full LLD section structure, the per-service implementation chunk convention, the chunking model, the bidirectional input handling (from-code reverse engineering, from-sdd forward design, hybrid drift detection), the design-pattern rationale model, and the inline-Mermaid-first diagram policy.

The embedded templates in this skill folder are the authoritative source: `TEMPLATE-COMBINED.md` for the single-file layout and `chunks/*.md` for the chunked layout.

This skill is the **fourth and final stage** of the user's documentation chain:

```
SoW → BRD (brd-unifier) → SDD (sdd-unifier) → LLD (lld-unifier) → implementation
```

It is the bridge from architectural intent to executable code: the LLD it produces is intended to be consumed directly by an AI implementer (or human developer) to write the source code.

---

## Running outside Claude Code

This skill follows the Agent Skills format and also runs in Codex, Kimi Code, and other compatible agents. Where the text names a Claude Code tool or file, use the equivalent below. In Claude Code, follow the text as written.

| Written as | Outside Claude Code |
|---|---|
| `CLAUDE.md` defaults | The project instruction file (`AGENTS.md`, or `CLAUDE.md` if present). If neither states a default, use the defaults this skill states and flag the gap. |
| `Agent` tool with a `subagent_type` | Start a sub-agent with a fresh context if the runtime supports it. Otherwise run the step yourself as a separate pass: re-read the files from disk, set aside your drafting reasoning, and follow the same brief. For a named agent (for example `general-purpose` or a `plugin:agent` name), take on the role its brief describes. |
| `AskUserQuestion` (and `ToolSearch` to load it) | Ask in chat: numbered questions, each with options, tradeoffs, and your recommendation first. Wait for the answer before continuing. |
| Miro MCP | Use only if a Miro tool is available; otherwise follow this skill's rule for when Miro is unavailable. |
| Invoking this skill | Claude Code: `/<skill-name> <args>`. Codex: `$<skill-name> <args>`. Kimi Code: `/skill:<skill-name> <args>`. |

Paths in this file are relative to the skill folder.

---

## Argument parsing: do this first

The skill is invoked with two optional arguments, in any order: `lld-unifier [chunks|combined] [light]`. `chunks` / `combined` set the **output mode**; `light` asks for a light run (§ Light run). Either one can be left out.

| Argument received | Meaning | Action |
|---|---|---|
| `chunks` (or empty / Enter / `y` / `yes` / `default`) | Produce multi-file chunked output | Proceed with CHUNKS mode (the default). |
| `combined` (or `c` / `single` / `one file` / `merged`) | Produce a single consolidated `.md` file | Proceed with COMBINED mode. |
| `light` (the words "light run" or "light-work" in the request count as it) | Run the light set | Proceed per § Light run. It does not set the output mode. |
| Anything else | Unrecognised | Re-prompt once with the same question; if still unclear, default to CHUNKS and note the fallback in the handoff summary. |

**Important:** the arguments control only the *output mode* (chunks vs combined) and the light run. The *direction* (from-code / from-sdd / hybrid) is asked separately (see step 2 of the workflow below).

### Interactive mode prompt (when no arg passed)

**CHUNKS is the default.** Ask one question, accept Enter / empty / "y" as confirmation:

> **Output format?** [chunks / combined] - default `chunks` (press Enter to accept).
>
> - **`chunks`** (default): multi-file layout; one `.md` per template section grouping. Matches the embedded `chunks/*.md` skeleton.
> - **`combined`**: single monolithic `.md` file matching `TEMPLATE-COMBINED.md`.

Interpretation rules:

- Empty / Enter / `""` / `y` / `yes` / `chunks` / `default` → **CHUNKS mode**.
- `combined` / `c` / `single` / `one file` / `merged` → **COMBINED mode**.
- Anything else → re-prompt once; if still unclear, default to CHUNKS and note the fallback.

Under an answer policy, the policy answers this prompt with `chunks` (step 7a, Answer policy).

If the user has already implied a mode ("give me the full LLD as one file" → `combined`; "split it into chunks" → `chunks`), do NOT ask: proceed with the implied mode and confirm in one short line. An existing LLD implies its own mode: a request on an existing `lld-[project-slug]/` folder or `LLD-*.md` file (an update, a refresh, or a re-run) keeps that mode without asking and says so in the same short line; only an explicit merge or split (step 9) changes it.

### Light run (`light`)

Without `light`, the run is a full run. A light run changes only this:

- **Operations and performance detail.** The implementation detail beyond the SDD in `10-operations.md` § 13.6 Dashboards and § 13.8 Runbook Procedures, and in `12-performance.md` § 15.2 Caching Strategy, § 15.4 Bulkhead & Concurrency, and § 15.5 Peak Scenarios (the same sub-sections in combined mode), is written as `> TODO: light-work run - detail before release`, indexed in chunk 15 (`confidence-rules.md` § Index-of-flags requirement). What the SDD states in these sub-sections is linked, not restated; in a light run this wins over the `sdd-to-lld.md` rules that carry SDD content into them (§ Field mapping table, § LLD-only sections).
- **Still written.** The derived views this skill mandates (principle 13): 10 § 13.1 Configuration, § 13.7 Alerts, and the 12 § 15.1 SLO rows.
- **Reviews.** Both review passes stay (step 7): the full or delta review, and the application check. The reviewer brief says the light-work flags are intentional, not coverage gaps.
- **Handoff.** The flag count (step 8) gives the light-work flags apart from the other `> TODO:` flags.

---

## Core principles

1. **Templates are authoritative.** `TEMPLATE-COMBINED.md` and the files under `chunks/` define the section order, naming, and structure. Section headings are never silently renamed.
2. **Markdown only.** No `.docx`, `.pdf`, `.html` unless the user explicitly asks.
3. **Direction is always asked.** The direction (from-code / from-sdd / hybrid) is never silently inferred. The prompt is in step 2; `transform-detection.md` has the acceptable answers and the resolution rules.
4. **Bidirectional by design.** The same template fits whether the LLD is reverse-engineered from code (`from-code`), forward-designed from an SDD/BRD (`from-sdd`), or unified across both (`hybrid`).
5. **Implementation-ready.** The load-bearing chunk is `04-implementation/<service>.md`. Every per-service file must contain enough detail (class signatures, method-level pseudocode, design patterns with rationale, workflow steps) for an AI implementer to scaffold code without further questions.
6. **Design patterns are first-class.** Every applied pattern carries: name, triggering CLAUDE.md rule, roles played by classes/methods, one-line rationale, Mermaid class diagram, pseudocode skeleton. See `pattern-rules.md`.
7. **Diagrams are inline Mermaid by default.** Sequence, state, ERD, class, and pattern diagrams render inline, each followed by a 1-2 sentence prose **Summary** so the chunk reads without a renderer. Miro links are an optional `> Miro: <url>` slot for whiteboard-richer visuals. See `mermaid-diagrams.md`.
8. **Confidence is tiered, not binary.** High-confidence inference: emit clean. Medium: emit + `> Confirm:` flag. Low: emit + `> TODO: <best-guess> - verify`. All flags indexed in `15-open-questions.md`. See `confidence-rules.md`.
9. **Drift is a feature, not a flaw.** In hybrid direction, divergences between SDD intent and code reality are explicitly marked with `⚠ drift` and a `> Drift note:` block. See `hybrid-drift.md`.
10. **Use platform defaults from CLAUDE.md when source is silent.** Java 21 / Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Kafka, Keycloak, microservices-first (the SDD's architecture style, recorded in its ADR-01, wins over this default: a modular monolith keeps its modules, in-process ports, and in-process events), Angular 17+ standalone, constructor injection, records for DTOs, idempotency on money writes, outbox for side effects that must follow a state change, sagas for cross-service flows, Resilience4j, RFC 9457 errors. These are the user's standing technical defaults.
11. **Chunks are semantic, not size-based.** Never split by line count.
12. **Flag gaps explicitly.** Where the input doesn't cover something the template requires, use `> Confirm:` (medium-confidence inference) or `> TODO: <best-guess> - verify` (low-confidence inference). Never paper over gaps with plausible-sounding invention.
13. **One fact, one home (no duplication).** The LLD references the SDD, never restates it: design-level content is cited by link (reference + delta, full rules in `sdd-to-lld.md` § One fact, one home). Contract *names* (topics, events, `API-NN` contracts and their URIs, roles, permission tokens) match the SDD character-for-character; contract *bodies* (payload schemas, API contract bodies, role catalogues, SLO targets) are referenced, with only the implementation delta added. Restated content is a review defect (OI Type: Duplication), except in a derived view that names its source on every row (§6.3 Runtime Stack, §8.2 Tables (and the §8.1 ERD of their keys and relationships), the §9.6 Idempotency and Transaction cells, §12.3 Resilience instances, §13.1 Configuration defaults, §13.7 Alerts, and §15 SLO rows).
14. **Every BRD use case is traced end to end** (from-sdd and hybrid, and from-code when an SDD is given, whenever the SDD derives from brd-unifier BRDs). Each active use case in scope gets one `### KEY/UC-NN: Title` workflow block in its owner's file, with a traceability line citing its BRD heading, SDD §7.3, owner and entry points, UAT/BAT test cases, and the screens and routes that start it. Routes map to the BRD's screens (the ID of their chunk 14 Mockup coverage row, or a screen ID with no row that the BRD text carries), e2e specs are tagged with use case and test case IDs, entry points carry a `use_case` span and log attribute, and `16-references.md` § 19.9 consolidates it all for production-bug triage. Every BRD ID carries the key from the SDD's Source BRDs register. IDs belong to their document: never created, renumbered, or re-titled. Rules: `sdd-to-lld.md` § Use-case traceability.

---

## Workflow

### 1. Resolve output mode

Per the Argument parsing section above. Default is CHUNKS.

### 2. Resolve direction (always ask)

Ask exactly this question:

> **Direction?** [from-code / from-sdd / hybrid]
>
> - **`from-code`**: reverse-engineer an LLD from existing source code (point me at a path). Uses `feature-dev:code-explorer` + `code-documentation:docs-architect`.
> - **`from-sdd`**: forward-design an LLD from an SDD (and BRD if linked). Greenfield, before any code exists.
> - **`hybrid`**: both inputs available and the code is complete. Two-pass: generate the from-sdd view, generate the from-code view, then unify into a single LLD with inline drift markers.

Acceptable shorthands:
- `code` / `from-code` / `reverse` / `1` → from-code.
- `sdd` / `from-sdd` / `design` / `forward` / `greenfield` / `2` → from-sdd.
- `hybrid` / `both` / `drift` / `compare` / `3` → hybrid.

If the user provides only a code path → still ask, but default the prompt to from-code.
If the user provides only an SDD path → still ask, but default the prompt to from-sdd.
If the user provides both → still ask, but default the prompt to hybrid.
If the LLD already exists (an update) → still ask, but default the prompt to the Direction its `00-metadata.md` records (`Mode` in an older LLD, step 9; for `partial`, the default the inputs give).

Under an answer policy, the policy answers this prompt with that default (step 7a, Answer policy).

See `transform-detection.md` for the full direction resolution rules, including partial-code handling.

### 3. Intake (short, not a clarification storm)

Ask at most **three** questions before starting:

- **Project / system name**: if neither the request nor the source states it.
- **Source material**: code path? SDD path? both? Pull from arguments if provided.
- **Direction confirmation**: from step 2.

If an answer is in the conversation, do not re-ask.

### 3a. Resolve Specs inputs (Project Type + Tech Stack)

The Specs chunk is **owned by this skill** and written after the body (Step 6b). But two of its inputs steer generation and must be resolved NOW:

- **Project Type**: recorded in the SDD §1 at SDD intake. Consulted by `transform-detection.md` to adjust the suggested direction (greenfield/brownfield steering). If the SDD doesn't record it, ask via AskUserQuestion.
- **Tech Stack**: resolved from SDD §6 Ecosystem Overview (the authoritative version pins). It steers pattern selection in `pattern-rules.md`. When CLAUDE.md defaults disagree with SDD §6, the SDD wins.

**Legacy chains:** older SDDs carried a Specs chunk (`../sdd-[sdd-slug]/15-specs.md` / `# 19. Specs`), and pre-restructure BRDs at `../brd-[brd-slug]/12-specs.md`. If one exists, consume it as read-only input (its Tech Stack pins win over CLAUDE.md defaults; if it disagrees with SDD §6, flag the drift). This skill still authors the canonical `17-specs.md`.

See `sdd-to-lld.md` § Specs ownership & synthesis for the complete rules.

If no SDD is reachable (pure from-code), Tech Stack comes from the actual dependency manifests and Project Type is Brownfield.

### 3b. Resolve the use-case trace inputs (from-sdd, hybrid; from-code with an SDD)

No new question unless something is missing. Per `sdd-to-lld.md` § Use-case traceability › Upstream documents:

- **SDD finished?** If its master shows a part `Pending` or `In progress`, or §7.3 still reads `Pending (part 2)`, stop and name the missing part. A `Locked` or `Stale` E2E gate does not stop the LLD: name its state in 16 § 19.1 and the handoff.
- **BRDs and keys.** Read the SDD's § Document Lineage: each source BRD, its key, and its location. No register (an older SDD): plain IDs, flagged, and an SDD upgrade suggested in the handoff. No BRD at all (§7.3 reads `Not applicable - no source BRD.`): the trace is not applicable.
- **BRD delivery state.** Chunk 16 `Up to date`, `Provisional`, `Stale`, or not written (`Pending (BRD 16 not written)`); chunk 14 Mockup coverage (its rows, keyed `MK-NN` or, in a BRD written before `MK-NN`, by a screen ID, are the screen references).
- **Scope.** The §13 services (and modules, Type `module`) this LLD covers; their §7.3 rows are this LLD's use cases.

### 3c. Check the SDD and BRD versions (an existing LLD, every run that reads an SDD)

Compare the SDD version recorded in 16 § 19.1 with the SDD's current version. If the SDD is newer, read its Changes Log rows newer than the recorded version and take the chunks each row lists after `Chunks:`. For a row without that list (an older SDD), or with sections after `Chunks:` (a combined SDD), map the sections to their chunks (the field mapping table names both). When two rows carry the recorded version (an older SDD), start from the first of them. Then, whether or not the SDD is newer, compare the BRD versions and the state of BRD chunk 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master (for a combined BRD, its cover and `14-todo.md` § Downstream outputs), and each BRD's chunk 14 Mockup coverage rows with the screens and use cases 14 § 17.3 cites. Chunk 14 changes bump no BRD version, so only this row-by-row reading finds them. A change to a row's Figma link alone needs no refresh: the LLD links the chunk 14 row, which always carries the current link. A BRD newer than the SDD's register is named in the offer with the suggestion to update the SDD first through sdd-unifier (`BRD <KEY> has a new version`); its trace refresh waits for the SDD. Make one offer for everything that changed: a targeted regeneration of the LLD chunks mapped from the changed SDD chunks, listing each changed SDD chunk with every LLD chunk the field mapping sends it to (`sdd-to-lld.md` § Field mapping table; § Use-case traceability › Refresh triggers, "A new SDD version"), plus the trace refresh each BRD change fires (the other rows of § Refresh triggers). Accepted, it is one update (step 9). Never refresh silently: the user accepts the refresh, or the LLD keeps its content and the handoff names the SDD and BRD versions it still reflects.

### 4. Plan internally

Enumerate which chunks (or sections, in combined mode) will exist, which workflows will be documented, which services (or modules) will get their own `04-implementation/<service>.md` chunk, which CLAUDE.md defaults apply, and which sections need confidence flags. The canonical chunk list is in `chunking.md`.

### 5. Dispatch agents (from-code and hybrid only)

For from-code or hybrid direction:

- **Phase 1: Discovery.** Dispatch `feature-dev:code-explorer` agent. Brief it with the target path and a request for: entry points, call graph, dependencies, data tables touched, Kafka topics produced/consumed, structural pattern detection (interface + multiple implementations + context class), cross-cutting hooks (interceptors/aspects/filters/guards), frontend routes with their route data, e2e specs with their tags, and existing use-case markers. Capture findings as structured notes with file:line citations.
- **Phase 2: Synthesis.** Dispatch `code-documentation:docs-architect` agent. Brief it with the Phase 1 findings + this skill's section schema (+ SDD §7.3 when an SDD is given). Request per-service narratives, sequence stories, design-pattern rationale (why this pattern, what it solves here), and workflow descriptions, headed `### KEY/UC-NN: Title` only for entry points matched to §7.3 and `### Workflow: [name]` otherwise.

See `agent-orchestration.md` for the dispatch templates and confidence-weighting rules.

For from-sdd direction: skip Phase 1 + 2. Read the SDD chunks and apply the field mapping in `sdd-to-lld.md` directly.

### 6. Generate / transform / derive output

**CHUNKS mode (default):**

- Use `chunks/*.md` as the section skeleton.
- Write output to `./lld-[project-slug]/`, with the master index at `./lld-[project-slug]/[project-slug]-lld-master.md` (from `chunks/lld-master.md`).
- Each chunk starts with the self-describing comment block (see `chunking.md`).
- For chunk 04, produce one file per service (or module, SDD §13 Type `module`): `04-implementation/[service-slug].md`. Cross-service sagas live with the orchestrator service's file.

**Body split across sub-agents.** The body (a build or a regeneration) may be written by several sub-agents, for example one per chunk or per service file. All of them get one naming sheet: the BRD keys and the use-case link form (§ Output conventions, Use case links), the target file names and heading anchors, and the service, topic, event, role, permission token, and `API-NN` names verbatim from SDD §13-§16. When they have all finished, one combined step 6a check runs over everything they wrote, never one check per sub-agent, and also checks every name against the naming sheet. When the trace is not applicable (step 3b), the combined check still runs, on links and names only.

**COMBINED mode:**

- Use `TEMPLATE-COMBINED.md` as the structure.
- Write output to `./LLD-[ProjectName]-v[X.X].md`.

**FROM-CODE direction:**

- Phase 1 + 2 outputs are template-fitted into the chunks per `code-extraction.md`.
- Structural claims (call graph, schema, topic names) default to high confidence.
- Semantic claims (business rule narrative, pattern rationale) default to medium confidence unless cross-validated.
- Every applied pattern annotated per `pattern-rules.md`.
- No use case ID is ever made up. With an SDD given, each entry point and route is matched to SDD §7.3 and the BRD screens (`code-extraction.md` § Tracing to BRD use cases); an unmatched one gets the `No BRD use case - realises` line when the BRD or SDD asks for what it does, and `> Confirm:` otherwise. Without an SDD, workflows are headed `### Workflow: [name]` and the trace reads `Not applicable - no source SDD`.

**FROM-SDD direction:**

- Read the SDD chunks, and through the SDD the BRD parts the trace cites, per `sdd-to-lld.md`.
- Trace every BRD use case per `sdd-to-lld.md` § Use-case traceability: the workflow blocks and their traceability lines, 14 § 17.3 routes, 13 § 16.8 specs, the `use_case` attribute, and the 16 § 19.9 index.
- Apply CLAUDE.md defaults aggressively (constructor injection, records DTOs, idempotency on money writes, outbox for side effects that must follow a state change, sagas for cross-service, Resilience4j, multi-tenant indexes, RFC 9457 errors, OpenAPI versioning, Flyway migrations, etc.).
- Modular monolith or hybrid core (SDD §13 rows of Type `module`, the style its ADR-01 records): one `04-implementation/<module>.md` per module; `Internal (in-process)` contracts go to 06 § 9.6 and the owner's 04 § 7.2 port and adapter, §14.10 events to 07 § 10.6. Broker, DLQ, and HTTP resilience rules apply to integration traffic only, never to port calls or in-process events (`sdd-to-lld.md` § Field mapping table). The outbox takes an in-process event only when the SDD §14.10 Delivery line is durable (`chunks/09-cross-cutting.md` § 12.4).
- Each pattern annotated with triggering CLAUDE.md rule + service-specific rationale + Mermaid class diagram + pseudocode skeleton.
- Sections that the SDD and CLAUDE.md cannot together fill (SLOs, threat notes, peak scenario multipliers) → `> TODO: <best-guess> - verify`.

**HYBRID direction:**

- Run from-sdd pass internally → "designed" view per section.
- Run from-code pass internally → "built" view per section.
- Section-by-section diff per `hybrid-drift.md`:
  - Match → no marker (✅ implicit).
  - Differ → emit reconciled content + `⚠ drift` marker + `> Drift note: SDD says X, code does Y.`
  - Code-only → `🆕 code-only` marker.
  - SDD-only → `⛔ sdd-only` marker.
- Emit single unified LLD (no separate `designed/` / `built/` folders).
- Use-case trace drift (a §7.3 entry point not built, code tagging a different use case, route data that disagrees with the BRD screen, spec tags naming unknown IDs) per `hybrid-drift.md` § Use-case trace drift.
- `15-open-questions.md` indexes every drift marker with location + severity.

**PARTIAL CODE + SDD:**

- Skill identifies which services have code (uses `code-explorer` to enumerate existing service modules).
- Run from-code pass on existing services.
- Missing services → the placeholder from `transform-detection.md` § Partial-code resolution (status, the use cases it owns as not built, the re-run TODO) in `04-implementation/<service>.md`.
- Note the partial-code choice in `15-open-questions.md`.

### 6a. Reconcile the use-case trace (from-sdd, hybrid; from-code with an SDD)

After the body, before the Specs chunk. Skip when the trace is not applicable (step 3b).

1. Run the checks in `sdd-to-lld.md` § Use-case traceability › Checks: one keyed workflow block per active in-scope use case, and on each `### Workflow:` block for behaviour the BRD or SDD asks for the line that names what it realises; each traceability line equal to SDD §7.3, BRD chunk 16, and 14 § 17.3; every route with a screen and use cases; the index equal to §7.3 row for row, both ways; spec tags naming real IDs; `@UseCase` on every traced entry point and on no `### Workflow:` entry point or LLD-proposed endpoint §7.3 does not list; every link resolving (file and anchor); every BRD ID keyed.
2. Fix what is mechanical (a wrong anchor, a missing key, a cell that disagrees with its home); flag the rest (`> Confirm:` / `> TODO:`). Never resolve an upstream disagreement in the LLD.
3. Record the upstream state in 16 § 19.1.
4. The reviewer writes chunk 18 after this step, so its key and link checks run again on chunk 18 after the request's last review pass (step 7, Key and link check after the last pass).

### 6b. Synthesise the Specs chunk (mandatory, AFTER the body is complete)

The body is now written. Synthesise the `Specs` chunk (`17-specs.md` / `# 20. Specs` in combined mode), **derived synthesis, not new authoring**:

1. **Mission**: distil from the SDD §1 Executive Summary. 2-3 sentences: what the product is, who it's for, the single outcome. From-code direction with no SDD: distil from the discovered purpose + `> Confirm:`.
2. **Tech Stack**: the resolved stack from Step 3a, verbatim with version pins, one bullet per tier (Backend, Frontend, Mobile, Data, Messaging); cross-check it equals this LLD's §6.3 Runtime Stack: a mismatch is drift to flag. A version pin missing from the resolved stack is never asked for here: §6.3 carries one `> TODO:` that names each missing pin and SDD §6 as its home, the Tech Stack bullet points to that flag, and the handoff suggests pinning it in SDD §6 through sdd-unifier (step 8).
3. **Roadmap**: group the SDD §13 services (and the BRD UCs each owns) into 3-6 delivery phases. No natural breaks → **AskUserQuestion**. When the source BRDs are phase-based (their Use Case Summary has a last column `Phase`, with values `Phase 1`, `Phase 2`, ...; a column that writes `PN` instead is read the same way), use those phases and do not ask for a grouping: one row per BRD phase that has services in scope, however many there are (the 3-6 guidance does not apply), labelled `PN - <label>` with the BRD's phase number (`Phase N` in the BRD is `PN` here). `<label>` is a short name for what the phase delivers, taken from the BRD's scope items for that phase (chunk 04). Each row lists only its own phase's use cases, so a service whose use cases span phases is listed in its earliest phase's row and named again in each later-phase row with only that phase's use cases. From-code direction with no SDD: "Not applicable - reverse-engineered LLD."
4. **Project Type**: from Step 3a, verbatim, with the justification line + the LLD direction taken.

Tone: short, precise, declarative (constitution voice). Speckit `/constitution` reads this chunk verbatim. The reviewer in Step 7 reads it too and flags any Specs-body mismatch.

### 6c. Register in the parent SDD (every run that reads an SDD)

When the SDD has a Child LLDs table, add or update this LLD's row with this run's direction as Direction and the SDD version its content reflects as SDD version (the version in 16 § 19.1: the current one after a build or an accepted refresh, the older one when the user declined step 3c's offer) (`sdd-to-lld.md` § SDD lineage). This runs whether or not the use-case trace applies: an SDD with no source BRD still lists its child LLDs. It is the only write outside the LLD folder.

### 7. Post-generation review (mandatory, cleared-context)

After the body of the LLD AND the Specs chunk are written but **before** presenting to the user, run an adversarial review pass that produces the `Open Items & Clarifications` chunk (`18-open-items-and-clarifications.md` / `# 21. Open Items & Clarifications` section in combined mode). The acceptance loop (step 7a) then walks the user through its items.

**On an update.** The full review runs once, on the first build. A later update that changes LLD content (a step 9 row, or a `transform-detection.md` § Edge cases path such as adding a service) runs a delta review before the handoff: a fresh dispatch of the same reviewer and brief, limited to the chunks the update's Changes Log row lists when the review starts (chunk 18 aside) and to the SDD or BRD change behind it. The reviewer reads chunk 18 first, never raises an existing item again, gives new items the next free OI IDs, and checks the items the refresh marked settled, superseded, or reopened (`sdd-to-lld.md` § Refresh triggers). In the Reviewer Notes coverage table it adds one dated row per changed chunk, with the surfaces it checked there; earlier rows stay, and item 4's re-dispatch applies to the new rows only. The row's Service cell reads `[YYYY-MM-DD] delta: chunk NN (vX.X)`, `[YYYY-MM-DD] delta: 04-implementation/<service>.md (vX.X)` for a per-service file (its name, with no `chunk` before it), or `[YYYY-MM-DD] delta: section N (vX.X)` in combined mode, where vX.X is the LLD version when the review runs; its Risk surface cell names the surfaces checked, and a `global` surface checked gets a `[YYYY-MM-DD] delta: global (vX.X)` row. The brackets are part of the label: `[2026-10-07] delta: chunk 13 (v1.4)`, `[2026-10-07] delta: 04-implementation/refund-service.md (v1.4)`. Earlier rows keep their labels.

**Answers in the same update.** When open items are accepted before the handoff (the acceptance loop, step 7a), apply the accepted options in the same update and Changes Log row, each with its Resolution Log row. Each is applied as plain implementation text that reads correctly in place, with no option letter, date stamp, or progress note (the Resolution Log row carries that), and a `> TODO:` or `> Confirm:` it answers is removed. That rule is for the body. The Changes Log and the chunk 18 Resolution Log and Reviewer Notes are records: an applied answer that corrects one of their earlier entries adds a new entry in this update and leaves the old one as it is. Other text that the applied option makes wrong, inside or outside the item's Where, is brought in line in the same step when one wording is clearly right (the same fact stated again, a count, a cross-reference; search the LLD for the words the option replaces); name the OI ID with that text in the Changes Log row. Text that needs a choice is left for the application check to raise. Then run one scoped application check: a fresh cleared-context reviewer with the same brief (How to run it, below), not the delta reviewer continued, limited to the passages the applied items changed and the passages that depend on them, with no new hunt. It adds one dated row per applied item: its Service cell reads `[YYYY-MM-DD] application check: OI-NN (vX.X)`, with the LLD version when the check runs, brackets included (`[2026-10-07] application check: OI-14 (v1.4)`), and its What was checked cell names each chunk and section the item changed. A gap it finds becomes a new `Open` item, which an answer policy answers only when its Recommended Answer fixes a defect in the applied text and makes no new design choice (step 7a), and waits for a later request: an answer accepted for it before the handoff waits as `Decided - pending application` (step 7a), the handoff names the check's items with the offer to apply them in a new request (step 8), and the next request that changes LLD content presents each one still `Open` again in its acceptance loop (step 7a). One request has at most two review passes: the full or delta review, and this check. Item 4's re-dispatch (of an unchecked row, or on a finding the author holds wrong) is not a new pass.

**Key and link check after the last pass.** Step 6a runs before the reviewer writes chunk 18, so it never sees the reviewer's IDs. After the request's last review pass (the full or delta review, or the application check when one runs) and before the handoff, run step 6a's key and link checks again on what this request wrote in chunk 18 (its items and Reviewer Notes rows; § 21 in combined mode) and on the passages its applied answers changed: every BRD ID keyed, every link resolving (file and anchor). Fix and flag as step 6a item 2 says. It is a check, not a review pass. Skip it when the trace is not applicable (step 3b).

**Why cleared context.** The author's `> Confirm:` and `> TODO:` flags (indexed in chunk 15) capture gaps the author *recognised*. The reviewer's job is to find gaps the author *did not recognise*: edge cases assumed away, error paths silently dropped, pattern applications that look wrong, concurrency hazards in the pseudocode, multi-tenancy leaks in the data access layer.

Chunk 15 (Open Questions) and chunk 18 (Open Items & Clarifications) coexist:

- **Chunk 15** = author-generated index of inline confidence flags. Lives alongside the body.
- **Chunk 18** = reviewer-generated external findings with options. Independent of the body.

**How to run it.**

1. Use the `Agent` tool with `subagent_type: general-purpose`. When the `comprehensive-review` plugin is installed, the brief may tell it to run the `/comprehensive-review:full-review` skill as part of the review. Subagent starts with no conversation memory.
2. Pass the subagent:
   - Absolute paths to all generated LLD chunks (or the combined file), **including chunk 15** (so the reviewer can see what the author already flagged and avoid duplicating) **and chunk 17 Specs**.
   - Path to the source SDD (including its §14 Centralized Event Hub and §15 Service Integration API Contracts, the contract registries the LLD's event and API contracts must match verbatim, its §16 Centralized User Roles, and its §7.3 Use Case Traceability) for cross-validation.
   - Paths to the source BRD(s), when the SDD has them: the use case chunks (05, 06x), chunk 11, chunk 14 (Mockup coverage), and chunk 16 (UAT/BAT test cases).
   - Path to this skill's templates.
   - Path to CLAUDE.md so the reviewer can spot pattern misapplication and rule violations.
   - The brief: identify implementation-level gaps, missing edge cases, pattern misapplications, untested error paths, concurrency hazards, transaction boundary issues, idempotency gaps, multi-tenancy leaks, test gaps, contract drift (LLD event contracts vs SDD §14, and 07 § 10.6 in-process events vs §14.10; LLD API contracts vs SDD §15 `API-NN` names and URIs, and 06 § 9.6 port contracts vs its `Internal (in-process)` contracts; LLD authZ vs SDD §16), Specs-body mismatches (Mission vs SDD §1, Tech Stack vs LLD §6.3, Roadmap services that don't exist), and use-case traceability gaps (an in-scope §7.3 use case with no workflow block or with two; a block whose ID or title differs from the BRD or lacks its key; a traceability line whose owner, entry points, or test cases disagree with SDD §7.3 or BRD chunk 16; a route with no screen or use case cell; a screen whose use cases differ from the BRD; a test case with no e2e spec and no reason; a traced entry point without `@UseCase`; a link whose file or anchor does not resolve; an ID its document does not have; behaviour that no BRD use case covers and no BRD or SDD section asks for, Type `Missing scenario`). For hybrid direction, also flag drift between the from-sdd and from-code views that wasn't already captured. For each finding, propose 2-3 concrete options with one-line tradeoffs, a **Recommended Answer** (always pick one, even for close calls: the concrete resolution text, written so it can be pasted into the LLD as-is, and implementable on the LLD's stated stack (§6.3 Runtime Stack) and the SDD's decisions; a resolution that is not is a finding, never a Recommended Answer), and a **Why** (REQUIRED: the reason that option wins: the CLAUDE.md rule, SDD contract, code fact, or risk avoided, plus the tradeoff accepted; never empty). Output goes into the chunk/section using the schema in `chunks/18-open-items-and-clarifications.md`.
   - Constraint: External findings only. Do not duplicate items already in chunk 15.
   - In a light run (§ Light run): the `> TODO: light-work run - detail before release` flags mark detail left out on purpose. They are not coverage gaps and not findings.
3. The subagent writes directly to `18-open-items-and-clarifications.md` (chunks mode) or the `# 21. Open Items & Clarifications` section (combined mode). When it cannot write files, it returns the text and the main agent inserts it unchanged.
4. Verify coverage: the reviewer records, per service, one line for each implementation risk surface (error envelope vs RFC 9457, transaction propagation, idempotency, multi-tenancy filtering, outbox correctness, saga compensation, retry and backoff (Resilience4j), observability instrumentation, contract/integration/e2e test coverage, OpenAPI and event-schema versioning, duplication), plus one `global` line each for contract drift (SDD §14 with §14.10 in-process events, §15 with `Internal (in-process)` ports, §16), Specs-body consistency, and use-case traceability, in the Reviewer Notes coverage table: `checked: N findings (OI IDs)` or `checked: no issue found`, with what was checked. Zero findings is a valid result for a checked surface. Re-dispatch only when a surface is unchecked, a finding lacks evidence, or the author holds a finding wrong. A re-dispatch never changes an item's status. When the author holds, with evidence, that a finding is wrong, it re-dispatches the reviewer on that finding. The reviewer keeps the item, or rewrites it as a full item (Where, Type, Concern, Options, a Recommended Answer that reads `No change: <evidence>`, and Why) with Status `Open`, and the acceptance loop decides it like any other item. Taking that Recommended Answer marks the item `Rejected`.

**Reviewer prompt skeleton (adapt per project):**

> You are an independent adversarial reviewer for a Low-Level Design Document. You have no memory of how this document was authored. Your job is to find what is missing, ambiguous, or risky in the implementation specification, not to confirm what is present.
>
> Read these files: [LLD paths, including chunk 15]. Cross-reference: [SDD paths, including §7.3 and the SDD Specs chunk if present] and [BRD paths: use case chunks, 11, 14, 16]. Honour the rules in [CLAUDE.md path].
>
> Skip anything already flagged in chunk 15 (`> Confirm:` / `> TODO:` items). Your job is to find what the author *did not* flag. [Light run only:] The `> TODO: light-work run - detail before release` flags mark detail left out on purpose: they are not coverage gaps.
>
> For each implementation gap, missing edge case, pattern misapplication, error path issue, concurrency hazard, transaction boundary problem, idempotency gap, multi-tenancy leak, test gap, contract drift vs the SDD's Centralized Event Hub (§14, including §14.10 in-process domain events), Service Integration API Contracts (§15, including `Internal (in-process)` port contracts), or User Roles catalogue (§16), Specs-body mismatch, traceability gap (a use case, route, test case, spec, or entry point the trace misses or gets wrong, against SDD §7.3 and the BRD; a link that does not resolve; a BRD ID without its key), or missing scenario (behaviour that no BRD use case covers and no BRD or SDD section asks for; never a new UC), write an OI entry following the schema in [chunks/18-open-items-and-clarifications.md path]. Each entry must include: Where (service / sub-section), Type, Concern (one paragraph), Options (at least 2 with tradeoffs), **Recommended Answer (always pick one: the concrete resolution text, ready to paste into the LLD and implementable on the LLD's stated stack (§6.3 Runtime Stack) and the SDD's decisions; a resolution that is not is a finding, never a Recommended Answer)**, **Why (the reason that option wins: evidence + tradeoff accepted; never empty)**, Status: Open.
>
> Cover at minimum (per service): error envelope completeness vs RFC 9457, transaction propagation correctness, idempotency on money/wallet/external-side-effect operations, multi-tenancy filtering on every query, outbox correctness for every side effect that must follow a state change (atomic aggregate-and-outbox write, separate publisher, rows marked processed only after the target acknowledges, duplicates deduped by receivers), saga compensation paths, retry/backoff correctness with Resilience4j, observability instrumentation completeness, contract/integration/e2e test coverage, OpenAPI/event-schema versioning, and duplication (SDD content restated outside principle 13's sourced derived views instead of referenced with an implementation delta). For hybrid direction also flag undocumented drift. Record coverage in the Reviewer Notes table: one row per service for each area above, plus `global` rows for contract drift, Specs-body consistency, and use-case traceability, each `checked: N findings` or `checked: no issue found`, with what you checked. Never invent a finding to fill a surface.
>
> Do not echo what the document says. Do not confirm. Find what is missing. Write directly to [output path].

### 7a. Open Items acceptance loop (mandatory, before the handoff)

The open items are not left for the user to discover. Walk the user through each item and get a decision. Each item means every item still `Open` in chunk 18 when the loop runs: the ones this request raised (on a first build, every item) or reopened (`sdd-to-lld.md` § Refresh triggers), and the ones an earlier request left `Open` (a "later", item 5; a question an answer policy left for the user; an application check's item). `Deferred`, `Decided - pending application`, and closed items are not asked again. A status outside the chunk 18 legend counts as `Open`: a refresh and the handoff treat the item as not closed, and the next acceptance loop presents it.

1. Present the items compactly: ID, title, one-line concern, the Recommended Answer and its Why.
2. Ask in batches with **AskUserQuestion**, up to 4 items per call; the recommended option's description carries its Why, so the user decides with the reason in view. Options per item: **Accept recommendation** (listed first) / **Choose option [B/C]** / **Defer** / **Other** (the user's own answer, or a rejection typed through Other).
3. When every item is decided, or the user has left the undecided ones for later (item 5), apply the accepted ones together and run the scoped application check (step 7, Answers in the same update). An item applied as its Recommended Answer becomes `Accepted - applied`, with the Resolution Log outcome `Accepted recommendation`; an item applied as another option, or as the user's own answer typed through Other, becomes `Adjusted - applied`, with `Adjusted: <short note>`. An Other that rejects the item without a replacement makes it `Rejected` (item 4), and so does taking a Recommended Answer that reads `No change: <evidence>` (item 4 of How to run it, step 7), which changes no text.
4. **Deferred** and **Rejected** items keep their entry, with the new status and its rationale, and get a Resolution Log row (`Deferred` / `Rejected`). They are not applied.
5. "later" or "I'll review offline" leaves every item that has no decision yet `Open`, and the handoff says the acceptance loop is pending; the next request that runs this loop presents those items again. A decision already given in the loop, the user's or an answer policy's, stands and is applied (item 3). Nothing is applied without an explicit decision.
6. **Decided - pending application.** The application check's items go through the loop too, but the request has no review pass left to check them (step 7: at most two). An answer accepted after the check has run, the user's or an answer policy's, for its items or any other item, is not applied in this request: the item's Status reads `Decided - pending application`, followed by the decision, its decider, and the date. The next request that changes LLD content (not a pure merge or split) applies it first, as step 7 (Answers in the same update) says, sets its applied status, and adds its Resolution Log row; that request's delta review covers it (step 7, On an update).

**Answer policy.** An answer policy the user set for the run (a standing instruction in the request or a run brief, for example "answer policy: accept the recommended option") answers three kinds of question for the user, each by taking its recommended option or stated default, and no others:

- **This loop.** It answers an item only by accepting its Recommended Answer. It never chooses Defer, another option, a rejection, or an own answer: that answer stays with the user, and the item stays `Open`. One exception: it takes a Recommended Answer that reads `No change: <evidence>` (a finding the reviewer kept after the author showed it wrong), which changes no document. The item becomes `Rejected` with the policy as decider, and the handoff lists it. The item's Resolution Log Outcome ends with `Decided by Policy: <policy> (set by <name>, <date>)` (the log has no decider column). An item it leaves `Open` goes to the user, and its own decisions are applied with the user's answers, or after a "later" (items 3 and 5).
- **The output-format prompt** (§ Interactive mode prompt). It takes `chunks`. An existing LLD still keeps its own mode, with no prompt.
- **The direction prompt** (step 2). It takes the default the prompt suggests: the one the inputs give, as the Project Type override in `transform-detection.md` § The mandatory prompt adjusts it, or on an existing LLD the recorded Direction. The prompt is still asked and answered, never silently inferred: the handoff names the direction and says the answer policy chose it, with `Policy: <policy> (set by <name>, <date>)`, and does the same for an output mode the policy chose (step 8).

It never answers:

- A fact only a person or a provider can give (an intake fact such as a source path, a figure, a provider document, a legal basis, a business number, a brand color), nor a Recommended Answer that supplies one: the question or item stays open, and its flags stay as the skill already handles them. A Recommended Answer that depends on such a fact but leaves it as a flagged `> TODO:` with its owner supplies none, and the policy may accept it. A target the business sets (a time limit, an NFR measure, a milestone) that a Recommended Answer proposes with its Why is a choice, not such a fact; a figure that already exists somewhere (a volume, a contract term, a provider's limit) is a fact. The test: when the documents' evidence can build the options, each with its tradeoff, the question is a choice; a value that no offered option sets, or one that a named source not attached to the run would settle, is a fact. For example, a daily reminder once a refund request passes its 2-day approval target, recommended over a weekly digest, is a choice; whether goods must be returned before a refund, when the store's returns policy decides it and that policy is not attached, is a fact.
- A Recommended Answer that makes a decision the user's standing instructions for the project reserve for the user (for example adopting a new dependency; proposing one, as a `Proposed` decision with its alternative, is not reserved), or that sets a business rule a source document rules out: the item stays `Open`.
- The Brownfield friction prompt (the Project Type override in `transform-detection.md` § The mandatory prompt), the direction question while that prompt is open, or a Project Type question with no default (step 3a): they stay with the user.
- An item an application check raised (an OI ID in the Findings cell of an `application check` row in Reviewer Notes), in that request or any later one, unless its Recommended Answer fixes a defect in the applied text and makes no new design choice (no choice between designs, no new dependency, contract, or scope). Such items verify answers already applied, the policy's own included; any other such item waits for the user. An answer the policy gives one after the check has run waits as `Decided - pending application` (item 6).

With no answer policy, every question waits for the user. A policy may also cover less than this, for example "accept the recommended option except on multi-tenancy items": a question or item its wording leaves out waits for the user, and the item stays `Open` (items 3 and 5).

### 8. Present

After writing the body, the Specs chunk, and the Open Items chunk, and running the acceptance loop (step 7a), surface to the user:

- Project name, version, output mode (chunks / combined), direction (from-code / from-sdd / hybrid / partial), file paths; when the answer policy chose the output mode or the direction, that it did (step 7a).
- Number of chunks (if chunks mode) or section count (if combined).
- Number of services covered + names.
- Count of inline Mermaid diagrams generated.
- Count of `⚠ drift` / `🆕 code-only` / `⛔ sdd-only` markers (hybrid only).
- Count of `⚠ policy` findings by severity (every direction that reads code), indexed in `15-open-questions.md` § 18.6.
- Count of `> Confirm:` and `> TODO:` flags, indexed in `15-open-questions.md` (author-flagged); in a light run, the light-work flags counted apart (§ Light run).
- Count of Open Items (OI-NN) in `18-open-items-and-clarifications.md` (reviewer-flagged), by status; when answers were applied, the items applied, the application check's result, and the items it raised, which wait for a new request (a `Decided - pending application` item is applied first by the next request that changes LLD content, and that request's loop presents each one still `Open` again, step 7a); each item an answer policy made `Rejected` by taking a `No change: <evidence>` Recommended Answer (step 7a); when the user said "later", that the acceptance loop is pending.
- Specs chunk status (`17-specs.md`): Mission ✓ / Tech Stack ✓ / Roadmap ✓ / Project Type ✓ (or flag any that fell back to placeholders, and name each version pin missing from the resolved stack with the suggestion to pin it in SDD §6 through sdd-unifier; note if a legacy SDD/BRD Specs was consumed as input).
- Use-case traceability (when the trace applies), one line per source BRD: active use cases in scope and how many have a workflow block, merged or removed ones, routes mapped to a screen vs platform pages, test cases cited (automated / not automated / `Pending (BRD 16 not written)`), and the flags (missing screens: no `MK-NN` row and no screen ID; BRD chunk 16 `Stale`); then the link count and whether all resolve. Example: `REFUNDS v1.0: 4 active (4 traced), 1 merged; 5 routes (4 screens, 1 platform); 9 TCs (8 automated, 1 not) | LOYALTY v1.0: 2 active (2 traced); TCs Pending (BRD 16 not written) | 71 links, all resolve`. An older SDD (no Source BRDs register or no §7.3) is named here, with the suggestion to upgrade it through sdd-unifier.
- Parent SDD lineage (every run that reads an SDD, step 6c): this LLD's Child LLDs row added or updated, with its Direction and SDD version; on an existing LLD, the step 3c result (SDD and BRDs unchanged, or the newer versions and which chunks were refreshed or left); for an SDD without that table, the suggestion to upgrade it through sdd-unifier.
- Chain handoff check: every `../sdd-[sdd-slug]/...` reference resolves; topic, event and role names and `API-NN` contract names and URIs match SDD §14/§15/§16 character-for-character; SDD content is referenced with an implementation delta, or restated in principle 13's derived views with a source per row; every BRD ID carries a key from the SDD's Source BRDs register.
- One-line offer: "Want me to switch the output mode?" / "Want me to merge?" / "Want me to fill in section X now that you have decisions?" / "Want me to re-run from-code now that the missing services are scaffolded?"

### 9. Cross-mode conversion (on explicit request)

One request is one update (§ Output conventions, Versions). When it fires several rows below, as when step 3c finds a new SDD version and a BRD change together, they run as one: one regeneration, one step 6a, one bump. A refresh that reaches most chunks runs as a regeneration under the same delta-review rules. A row that changes LLD content first applies any `Decided - pending application` item (step 7a), and ends with the delta review of step 7 (On an update), the acceptance loop (step 7a), and the application check when answers were applied.

| User says | Action |
|---|---|
| "merge", "consolidate", "single file", "full doc" (after chunks exist) | Concatenate per `chunking.md` § Merge handling. Write to `./lld-[project-slug]/LLD-[ProjectName]-v[X.X]-MERGED.md`, next to the chunks. Keep originals. |
| "split into chunks", "re-chunk this" (when a combined file exists) | Split per `chunking.md` § Re-chunk handling (the heading map applied backwards). Keep the original combined file. |
| "regenerate chunk N", "update section X", "fill in service Y" | Targeted regeneration, leaving the rest untouched. Bump the version (§ Output conventions, Versions). |
| "re-run from-code" (after partial → full) | Re-dispatch agents on the now-complete code; re-fit; bump version. |
| "refresh the trace", or an upstream change the user names or step 3c finds (BRD chunk 16 written, screens or mockups changed, SDD §7.3 changed, a new BRD or BRD version) | Targeted regeneration per `sdd-to-lld.md` § Use-case traceability › Refresh triggers, then step 6a; bump version. |
| "the SDD has a new version", or step 3c finds one | Targeted regeneration per `sdd-to-lld.md` § Use-case traceability › Refresh triggers ("A new SDD version"): the LLD chunks mapped from the changed SDD chunks, 16 § 19.1, this LLD's Child LLDs row (its SDD version), and the chunk 18 items and flags the change answers; then step 6a when the trace applies, and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13); bump version. |
| Any run on an LLD whose master is still `lld-master.md` (written before the `[project-slug]-lld-master.md` name) | Rename it to `[project-slug]-lld-master.md`, update the chunk footers and this LLD's Child LLDs row in the SDD, and name the rename in the handoff. |
| Any run on an LLD whose metadata or master still says `Mode` (the field in `00-metadata.md` or the combined cover, the `Mode Summary` heading, the Changes Log column, and the master's `Mode:` line and Document Metadata row) | Read `Mode` as `Direction` and rename it in place (`Mode Summary` becomes `Direction Summary`). The rename bumps no version and is named in the handoff. |
| Any request that changes LLD content, on an LLD whose chunk 18 (or §21) still has `Recommendation` fields or `Resolved` statuses | Migrate it first: rename each `Recommendation` to `Recommended Answer`; a `Resolved (link)` item becomes `Accepted - applied`, or `Adjusted - applied` when its Resolution Log Outcome names an option other than the one its Recommendation picked, and keeps its link; the How to read table takes the current field and status rows. The migration alone changes no content (it adds nothing after `Chunks:`) and is named in the handoff. |

---

## Reference files (read these when the situation calls for them)

- `TEMPLATE-COMBINED.md`: the single-file template. Read at the start of any COMBINED-mode generation.
- `chunks/*.md`: the per-chunk template skeletons. Read at the start of any CHUNKS-mode generation.
- `chunks/lld-master.md`: the master index template; written per project as `[project-slug]-lld-master.md`.
- `chunking.md`: canonical chunk map, naming convention, merge rules, per-service split.
- `modes.md`: chunks vs combined behavioural details.
- `transform-detection.md`: rules for asking the direction question and resolving partial-code cases.
- `sdd-to-lld.md`: explicit SDD→LLD field mapping, the use-case traceability rules (keys, links, anchors, homes, gaps, checks, Child LLDs row, refresh), and Specs ownership & synthesis rules (read in from-sdd and hybrid, and in from-code when an SDD is given).
- `code-extraction.md`: how to drive `code-explorer` + `docs-architect` to populate the LLD (read in from-code direction).
- `hybrid-drift.md`: two-pass orchestration + section-by-section diff rules (read in hybrid direction).
- `pattern-rules.md`: CLAUDE.md design rules → triggering conditions for from-sdd; pattern-detection heuristics for from-code.
- `confidence-rules.md`: high/medium/low tiering + structural-vs-semantic weighting.
- `lld-quality.md`: what makes a substantive section vs a thin one (analogous to `sdd-quality.md` in sdd-unifier).
- `mermaid-diagrams.md`: diagram conventions, which diagrams default to inline Mermaid vs Miro link.
- `agent-orchestration.md`: dispatch templates for `feature-dev:code-explorer` and `code-documentation:docs-architect`.

---

## Output conventions

- **Project slug**: kebab-case, lowercased, derived from project name.
- **Chunked output folder**: `./lld-[project-slug]/`.
- **Master index**: `./lld-[project-slug]/[project-slug]-lld-master.md`. Its Related SDD line links to the SDD master.
- **Per-service implementation files**: `./lld-[project-slug]/04-implementation/[service-slug].md`, one per service. The folder is created even if there is only one service.
- **Chunked filenames**: `NN-short-title.md` (two-digit prefix). See `chunking.md`.
- **Combined output filename**: `LLD-[ProjectName]-v[X.X].md` (PascalCase project name).
- **Merged-from-chunks filename**: `LLD-[ProjectName]-v[X.X]-MERGED.md`, written inside `./lld-[project-slug]/` next to the chunks (`chunking.md` § Merge handling).
- **Encoding**: UTF-8, LF line endings.
- **Tables**: pipe-table format, no hard line wrap.
- **Punctuation**: no em dash characters in generated documents; use a comma, a colon, or a short hyphen with spaces.
- **Use case links**: `[KEY/UC-NN](<relative path from this file to the BRD file holding the heading>#<anchor of that heading>)`, e.g. `[REFUNDS/UC-04](../../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)` from a `04-implementation/` file. Parts follow the link: `step 5`, `A1`, `E1`, and `BR-n` / `AC-n`, which are positions and always carry a short label, as brd-unifier writes them (`[REFUNDS/UC-04](...) AC-3: customer is notified`). Test cases, screens, and `MK-NN` follow the same keyed form. Rules: `sdd-to-lld.md` § Use-case traceability.
- **Versions**: one update, one version. An update is one request, from its first change to its handoff; the first build (the body, the Specs, the review, and any answers applied before the handoff with their check) is one update, at 1.0. The update's first content change bumps the version one minor step (1.2 to 1.3, 1.9 to 1.10; a major step only when the user asks for one) and opens one Changes Log row. Every later change in the update goes into that row, also after a pause. The row ends with `Chunks:` and every chunk whose content changed, by its number (a per-service file by its name, `04-implementation/<service>.md`; a combined LLD lists sections; the first build's row ends with `Chunks: none (initial build)`). The master and `00-metadata.md` carry the current version; every other chunk keeps the version in which its content last changed. These are not content changes and bump nothing: links (adding a missing BRD key to a citation, or setting an upstream version in a link label to the one 16 § 19.1 records, included), footers, the master's index rows, a chunk 15 location that only follows its flag, the legacy renames and the chunk 18 migration of step 9, and this LLD's own row in the SDD's Child LLDs table. A flag added, removed, or reworded changes its chunk 15 rows and counts, and an accepted refresh changes the upstream state in 16 § 19.1: both are content changes, so chunk 15 is listed when a flag changed, and chunk 16 when § 19.1 changed. No two rows share a version.

- **Version bookkeeping:** date an update's row by the request's first content change; date the first build's initial row when the first build completes. Exclude routine cover/version/footer synchronization and the master's index rows from the semantic Chunks list; include substantive metadata (16 § 19.1 included) or review-content changes (a new coverage row included).

---

## Things this skill never does

- Never emits `.docx`, `.pdf`, `.xlsx`, or any non-Markdown output unless the user explicitly asks.
- Never silently picks a direction (from-code / from-sdd / hybrid). Always asks per step 2.
- Never invents class names, method signatures, table columns, topic names, or version pins to fill a section. Missing detail → confidence flag.
- Never creates, renumbers, or re-titles a use case, test case, screen ID, or `MK-NN`: they belong to the BRD. Behaviour no BRD use case covers is never a new UC: it gets a `### Workflow:` block when the BRD or SDD asks for it, and is an open question otherwise (`sdd-to-lld.md` § Use-case traceability).
- Never writes into the SDD, except this LLD's own row in the SDD's Child LLDs table.
- Never produces a "here's a summary, let me know if you want the full version" preview. Generates the actual deliverable.
- Never silently drops template sections. Empty sections keep their heading and write `Not applicable for this service.` (with a flag if surprising).
- Never modifies the embedded templates (`TEMPLATE-COMBINED.md` or `chunks/*.md`) during a generation run: they are read-only references.
- Never writes the conditional `14-frontend.md` chunk when the target has no UI surface. The chunk is omitted, not stubbed.
- Never blocks low-confidence sections from emitting. Per `confidence-rules.md`, low confidence emits with a `> TODO:` flag plus best-guess content. The reviewer decides what to keep.
- Never ignores CLAUDE.md defaults in from-sdd direction. If a CLAUDE.md rule applies, it is applied with attribution.
