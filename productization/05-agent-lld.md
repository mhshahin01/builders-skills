# Implementation Designer (lld-unifier)

The Implementation Designer is the platform agent built on the `lld-unifier` skill. It is the fourth and final stage of the documentation chain: "SoW → BRD (brd-unifier) → SDD (sdd-unifier) → LLD (lld-unifier) → implementation" (lld-unifier/SKILL.md:24). It is the bridge to the future Developer and Tester agents: "the LLD it produces is intended to be consumed directly by an AI implementer (or human developer) to write the source code" (lld-unifier/SKILL.md:27).

## 1. Role card

**Product agent name:** Implementation Designer

**Mission (one line):** turn an SDD, a codebase, or both into an implementation-ready per-service LLD that an AI implementer can build from without further questions, and own the constitution-grade Specs chunk that speckit consumes.

**Job description (paste-ready for the agent-creation UI):**

> You are the Implementation Designer. You produce implementation-ready Low-Level Designs: one file per service under `04-implementation/`, with class and interface maps, method-level pseudocode, design patterns carrying their triggering rule and rationale, transaction boundaries, error handling, and use-case workflows, each detailed enough for an AI implementer to scaffold code without further questions. You work bidirectionally: you forward-design from an SDD (from-sdd), reverse-engineer from a codebase (from-code), or diff design intent against code reality with inline drift markers (hybrid), and you always ask the direction instead of inferring it. You tier every inference by confidence and flag medium and low confidence inline, indexed in the Open Questions chunk; you never block a low-confidence section from emitting. You own the Specs chunk (Mission, Tech Stack, Roadmap, Project Type) that speckit `/constitution` reads verbatim. You trace every BRD use case end to end, from the SDD's §7.3 to workflow blocks, routes and screens, UAT/BAT test cases, e2e specs, and a runtime `use_case` attribute, so a production bug reaches its design in a few clicks. You register every run that reads an SDD in the parent SDD's Child LLDs table (your own row only), the only write you ever make into another document.

**Never does (standing instructions, lld-unifier/SKILL.md:365-377):**

- No output other than Markdown unless the user explicitly asks.
- Never picks a direction silently; it always asks (step 2).
- Never invents class names, method signatures, table columns, topic names, or version pins to fill a section; missing detail gets a confidence flag.
- Never creates, renumbers, or re-titles a use case, test case, screen ID, or `MK-NN`; behaviour no BRD use case covers gets a `### Workflow:` block or an open question, never a new UC.
- Never writes into the SDD, except this LLD's own row in the SDD's Child LLDs table.
- Never offers a "here's a summary, let me know if you want the full version" preview; it generates the deliverable.
- Never drops a template section silently: an empty one keeps its heading and writes `Not applicable for this service.`
- Never modifies the embedded templates (`TEMPLATE-COMBINED.md`, `chunks/*.md`) during a run.
- Never writes `14-frontend.md` when the target has no UI: the chunk is omitted, not stubbed.
- Never blocks a low-confidence section from emitting.
- Never ignores CLAUDE.md defaults in from-sdd: an applicable rule is applied with attribution.

**Capability and model requirements:**

| Requirement | Why |
|---|---|
| Sub-agent dispatch with fresh context | Phase 1 `feature-dev:code-explorer`, Phase 2 `code-documentation:docs-architect`, step 7 cleared-context reviewer, delta review, application check; "Subagent starts with no conversation memory" (lld-unifier/SKILL.md:267) |
| Human question UI | Direction prompt, Project Type ask, step 3c refresh offer, Roadmap grouping ask, open-item answers (AskUserQuestion equivalents, lld-unifier/SKILL.md:39) |
| Codebase read access | from-code, hybrid, and partial directions read the user's repository through code-explorer |
| Mermaid validation | "Diagrams are inline Mermaid by default" (lld-unifier/SKILL.md:86); every diagram carries a 1-2 sentence prose Summary |
| Instruction-file access | CLAUDE.md / AGENTS.md standing defaults drive pattern application and are quoted verbatim in pattern attribution (lld-unifier/SKILL.md:37, 89; lld-unifier/agent-orchestration.md:142, 202) |
| Large-context reasoning model | The 13x Business Logic → class/pattern derivation is "the heaviest derivation step" (lld-unifier/sdd-to-lld.md:325); the agent reads the full SDD, the cited BRD parts, and multi-thousand-line code reports |

**Tools and integrations:** workspace read/write under `lld-[project-slug]/` plus the combined and merged files at the project root; one controlled cross-document write into the SDD's chunk 00 (the Child LLDs row, §10); speckit `/constitution` as the downstream consumer of chunk 17.

**Position in a team:** the last agent in the document chain: part of the Full preset (Discovery, Requirements, Architect, Implementation Designer, optional Review Panel), and usable alone for an existing codebase (from-code needs no SDD, lld-unifier/SKILL.md:146) or an existing SDD (from-sdd). Its handoff targets are the future Developer and Tester agents, which consume the per-service files and the §16.8 e2e spec tags directly.

## 2. When to include this agent

| Preset | Include? | Rationale |
|---|---|---|
| Solo (Discovery only) | No | Discovery yields no SDD and no implementation is planned; add the agent only to document an existing codebase (from-code) |
| Standard (Requirements + Architect) | No | The chain stops at architecture; the LLD adds value only when build or audit follows |
| Full | Yes | The chain runs to implementation |

Include this agent when any of these holds: the SDD is finished and implementation is next (from-sdd); an existing codebase needs an implementation-grade document for audit, onboarding, or refactor (from-code); design-vs-reality drift must be surfaced (hybrid); a speckit `/constitution` input is needed; the team wants production-bug traceability from a page, route, log line, or failing test case to the design.

What is lost without it:

- No implementation-ready spec. Developer agents receive SDD-level intent with no class maps, pseudocode, or pattern rationale, and re-derive them inconsistently per service.
- No Specs constitution. Speckit `/constitution` has no canonical Mission, Tech Stack, Roadmap, and Project Type to read; "The constitution-grade `Specs` ... is **owned by `lld-unifier`** and lives with the LLD as chunk `17-specs.md`" (lld-unifier/sdd-to-lld.md:229).
- No production-bug traceability index. The §19.9 Use-Case Traceability Index, "the production-bug entry point" (lld-unifier/chunks/16-references.md:75), exists only in the LLD.

## 3. Artifacts consumed

| Artifact | Path pattern | Owner | How used |
|---|---|---|---|
| SDD §1 (Mission, Project Type) | `sdd-[sdd-slug]/` or `SDD-*.md` | Architect (sdd-unifier) | Mission distilled into Specs §1; Project Type steers the direction default and lands in Specs §4 |
| SDD §6 Tech Stack | same | Architect | "The authoritative version pins" (lld-unifier/SKILL.md:140); "When CLAUDE.md defaults disagree with SDD §6, the SDD wins" (lld-unifier/SKILL.md:140) |
| SDD §7.3 Use Case Traceability | same | Architect | "The trace spine" (lld-unifier/sdd-to-lld.md:306): owners and entry points cited exactly, never restated further |
| SDD §11 Cross-Cutting Concerns, with §11.4 | same | Architect | Each default expands into `09-cross-cutting.md`; §11.4 Metrics and Dashboards are referenced from 10 §13.3 and §13.6, which add only the implementation delta (lld-unifier/sdd-to-lld.md:314); every alert the SDD raises (§11.4 Alerting, a §12 integration row, a §15 error row, a `13x` section) is restated in 10 §13.7 Alerts, a derived view with a Source column whose Action links the §20 procedure it triggers, or a `> TODO:` when §20 has none (lld-unifier/sdd-to-lld.md:345) |
| SDD §13 Services Decomposition | same | Architect | "This is **the** structural mapping: one SDD service = one LLD per-service file" (lld-unifier/sdd-to-lld.md:316); Type `module` rows read as services |
| SDD §14 with §14.10, §15 with §15.1, §16 with §16.12 | same | Architect | Contract registries: topic, event, `API-NN`, role and permission names matched character-for-character; §15.1 internal-call conventions; the §16.12 implementation seed becomes the role/permission migration and fixture plan (lld-unifier/sdd-to-lld.md:321) |
| SDD 13x per-service specs | same | Architect | Business Logic seeds the class map, pseudocode, and patterns; DB Modeling seeds §8 derived views |
| SDD §18-§20, §24 | same | Architect | SLO targets, environments, runbook procedures, the e2e fan-out map; §24 "may be absent until the SDD open items are cleared" (lld-unifier/sdd-to-lld.md:322) |
| SDD chunk 00: Source BRDs register, Child LLDs | same | Architect | The register gives each BRD's key and location; the Child LLDs table receives this LLD's row |
| SDD ADR-01 | same | Architect | Architecture style wins over the microservices-first default: "a modular monolith keeps its modules, in-process ports, and in-process events" (lld-unifier/SKILL.md:89) |
| BRD 05 Use Case Summary + 06x headings | `brd-[brd-slug]/` | Requirements (brd-unifier) | Use case IDs and titles cited exactly, keyed; merged/removed rows link the Use Case Summary |
| BRD 11 UI/UX | same | Requirements | Screen IDs with no chunk 14 row, exactly as the BRD text carries them; "brd-unifier never defines one" (lld-unifier/sdd-to-lld.md:43) |
| BRD 14 Mockup coverage | same | Requirements | The `MK-NN` screen references; "A working artifact, never read as requirements" (lld-unifier/sdd-to-lld.md:357) |
| BRD 16 UAT/BAT | same | Requirements | Test case IDs and their `Related UC`; "While the chunk is locked: `Pending (BRD 16 not written)`" (lld-unifier/sdd-to-lld.md:359) |
| BRD 00-04, 12 | same | Requirements | Supplementary purpose, scope, glossary; referenced, never restated |
| Codebase path | user-provided | user | from-code / hybrid / partial: code-explorer's 16-ask structural discovery with file:line citations |
| CLAUDE.md / AGENTS.md defaults | project root | user | Standing technical defaults, applied aggressively in from-sdd and quoted verbatim in pattern attribution |
| Legacy Specs chunks | `../sdd-[sdd-slug]/15-specs.md`, `../brd-[brd-slug]/12-specs.md` | older chain runs | Read-only input: "its Tech Stack pins win over CLAUDE.md defaults; if it disagrees with SDD §6, flag the drift" (lld-unifier/SKILL.md:142) |

ID rule the agent enforces on every citation: "IDs belong to their document. ... The LLD cites them exactly as written. It never creates, renumbers, or re-titles one." (lld-unifier/sdd-to-lld.md:61). "Every BRD ID carries its BRD's key, even with a single BRD, copied exactly from the SDD's Source BRDs register" (lld-unifier/sdd-to-lld.md:62).

Duplication rule the agent enforces on every section: reference + delta, never copy. Contract *names* match the SDD character-for-character; contract *bodies* are referenced. The only sanctioned restatements are derived views that name their source on every row: "§6.3 Runtime Stack, §8.2 Tables (and the §8.1 ERD of their keys and relationships), the §9.6 Idempotency and Transaction cells, §12.3 Resilience instances, §13.1 Configuration defaults, §13.7 Alerts, and §15 SLO rows" (lld-unifier/sdd-to-lld.md:15). Restated upstream content outside those views is a review defect of Type `Duplication` (lld-unifier/sdd-to-lld.md:17).

## 4. Artifacts produced

| Artifact | Path pattern | Purpose |
|---|---|---|
| Master index | `lld-[project-slug]/[project-slug]-lld-master.md` | Navigation graph; "Its Related SDD line links to the SDD master" (lld-unifier/SKILL.md:350), which is how sdd-unifier finds unregistered sibling LLDs |
| `00-metadata.md` | inside the folder | Cover, **Mode** field, Changes Log, Confidence Flag Summary |
| `01-purpose-and-scope.md` | inside the folder | §1-§4: purpose, scope, assumptions, glossary (reference + delta against the SDD) |
| `02-context.md` | inside the folder | §5: bounded context, upstream/downstream, cross-service dependency diagram |
| `03-architecture.md` | inside the folder | §6 with the §6.3 Runtime Stack derived view (a Source column per row) |
| `05-data-model.md` | inside the folder | §8: ERD, tables, indexes, multi-tenancy strategy, Flyway plan, retention, encryption |
| `06-api-contracts.md` | inside the folder | §9 with §9.6 In-Process Port Contracts (modular monolith only) |
| `07-event-contracts.md` | inside the folder | §10 with §10.6 In-Process Domain Events (modular monolith only) |
| `08-state-and-rules.md` | inside the folder | §11: state machines, cross-service business rules, algorithm pseudocode |
| `09-cross-cutting.md` | inside the folder | §12 with the `use_case` log field and span attribute in §12.7/§12.8 |
| `10-operations.md` | inside the folder | §13: configuration (§13.1, a derived view with a Source column), health, RED metrics, logs, tracing, dashboards, §13.7 Alerts (a derived view with a Source column), runbook procedures (RB-NN), on-call |
| `11-security.md` | inside the folder | §14: data classification, PII inventory, secrets, threat notes, compliance |
| `12-performance.md` | inside the folder | §15: SLO rows with per-row source links, caching, bulkheads, peak scenarios |
| `13-testing.md` | inside the folder | §16 with §16.8 E2E Spec Traceability (specs tagged with keyed use case and test case IDs) |
| `04-implementation/<service-slug>.md` | one per service or §13 Type `module` | The load-bearing per-service spec (7.1-7.8); cross-service sagas live in the orchestrator's file; "The folder is created even if there is only one service" (lld-unifier/SKILL.md:351) |
| `14-frontend.md` | inside the folder | §17 with §17.3 Routing; CONDITIONAL: "The chunk is omitted, not stubbed" (lld-unifier/SKILL.md:375) when the scope has no UI |
| `15-open-questions.md` | inside the folder | §18.1 drift index, §18.2 TODO, §18.3 Confirm, §18.4 Decisions Pending (OQ-NN), §18.5 counts per section, §18.6 policy findings |
| `16-references.md` | inside the folder | §19.1 Source Documents (the upstream state the trace was built from) and the §19.9 Use-Case Traceability Index |
| `17-specs.md` | inside the folder | The Specs chunk (§20): Mission, Tech Stack, Roadmap, Project Type, owned by this agent |
| `18-open-items-and-clarifications.md` | inside the folder | §21: the cleared-context reviewer's findings, Resolution Log, Reviewer Notes coverage table |
| Combined LLD | `./LLD-[ProjectName]-v[X.X].md` | Single-file shape; §1-§21 with services as `## 7.N` blocks under one `# 7.` |
| Merged LLD | `./LLD-[ProjectName]-v[X.X]-MERGED.md` at the **project root** | Chunks concatenated on request, originals kept; links rebased per file depth (lld-unifier/chunking.md:139). Note: unlike BRD/SDD merged files, this one lives at the root beside the folder (lld-unifier/chunking.md:157); see 09-open-decisions.md |

Versioning: "one update, one version" (lld-unifier/SKILL.md:359). The first build is one update at 1.0; each later request's first content change bumps one minor step and opens one Changes Log row ending in a `Chunks:` list. The master and `00-metadata.md` carry the current version; every other chunk keeps the version in which its content last changed. These bump nothing: "links (adding a missing BRD key to a citation, or setting an upstream version in a link label to the one 16 § 19.1 records, included), footers, the master's index rows, a chunk 15 location that only follows its flag, and this LLD's own row in the SDD's Child LLDs table" (lld-unifier/SKILL.md:359). No two rows share a version.

## 5. Invocation and arguments

Command forms per platform (lld-unifier/SKILL.md:41): Claude Code `/lld-unifier [chunks|combined]`, Codex `$lld-unifier [chunks|combined]`, Kimi Code `/skill:lld-unifier [chunks|combined]`. In the product this is a Run dialog with one optional argument.

| Argument received | Meaning | Action |
|---|---|---|
| `chunks` (or empty / Enter / `y` / `yes` / `default`) | Multi-file chunked output | CHUNKS shape (the default) |
| `combined` (or `c` / `single` / `one file` / `merged`) | Single consolidated file | COMBINED shape |
| Anything else | Unrecognised | "Re-prompt once with the same question; if still unclear, default to CHUNKS and note the fallback in the handoff summary" (lld-unifier/SKILL.md:55) |

The argument controls only the output shape. "The *direction* (from-code / from-sdd / hybrid) is asked separately" (lld-unifier/SKILL.md:57): "Mode is always asked. Direction (from-code / from-sdd / hybrid) is never silently inferred." (lld-unifier/SKILL.md:82).

Shape prompt, exact text (lld-unifier/SKILL.md:63-66):

> **Output shape?** [chunks / combined] - default `chunks` (press Enter to accept).
>
> - **`chunks`** (default): multi-file layout; one `.md` per template section grouping. Matches the embedded `chunks/*.md` skeleton.
> - **`combined`**: single monolithic `.md` file matching `TEMPLATE-COMBINED.md`.

Direction prompt, exact text (lld-unifier/SKILL.md:107-111):

> **Direction?** [from-code / from-sdd / hybrid]
>
> - **`from-code`**: reverse-engineer an LLD from existing source code (point me at a path). Uses `feature-dev:code-explorer` + `code-documentation:docs-architect`.
> - **`from-sdd`**: forward-design an LLD from an SDD (and BRD if linked). Greenfield, before any code exists.
> - **`hybrid`**: both inputs available and the code is complete. Two-pass: generate the from-sdd view, generate the from-code view, then unify into a single LLD with inline drift markers.

Shorthands (lld-unifier/SKILL.md:113-116): `code` / `from-code` / `reverse` / `1` → from-code; `sdd` / `from-sdd` / `design` / `forward` / `greenfield` / `2` → from-sdd; `hybrid` / `both` / `drift` / `compare` / `3` → hybrid. Anything else: re-prompt once, then ask explicitly.

Smart defaults (the prompt is still asked; only the suggested default moves, lld-unifier/SKILL.md:118-121): only a code path → from-code; only an SDD path → from-sdd; both → hybrid; neither → from-sdd with a request for an SDD. The Project Type override applies before these (lld-unifier/transform-detection.md:30-37): Brownfield with only an SDD keeps the from-sdd suggestion, surfaces the friction prompt (§6, row 5), and records the friction in the handoff; hybrid becomes the suggestion only when both inputs are available (lld-unifier/transform-detection.md:35). Greenfield with only a code path keeps from-code and flags "Greenfield project type per the recorded Project Type, but code is being reverse-engineered. Confirm intent." in the handoff (lld-unifier/transform-detection.md:34). "This override never silently picks the direction" (lld-unifier/transform-detection.md:37). `partial` is a detected fallback, never an offered option.

Resume behavior: on an existing LLD, "still ask, but default the prompt to the Mode its `00-metadata.md` records (for `partial`, the default the inputs give)" (lld-unifier/SKILL.md:121).

Request phrases on an existing LLD (step 9, lld-unifier/SKILL.md:311-323). One request is one update: when it fires several rows, "they run as one: one regeneration, one step 6a, one bump", and a row that changes LLD content ends with the delta review, plus the application check when answers were applied (lld-unifier/SKILL.md:313).

| User says | Action |
|---|---|
| "merge", "consolidate", "single file", "full doc" (after chunks exist) | Concatenate into `./LLD-[ProjectName]-v[X.X]-MERGED.md`; originals kept (lld-unifier/SKILL.md:317) |
| "split into chunks", "re-chunk this" (when a combined file exists) | Split per the heading map applied backwards; the combined file kept (lld-unifier/SKILL.md:318) |
| "regenerate chunk N", "update section X", "fill in service Y" | Targeted regeneration, the rest untouched; version bump (lld-unifier/SKILL.md:319) |
| "re-run from-code" (after partial → full) | Re-dispatch the agents on the now-complete code, re-fit; version bump (lld-unifier/SKILL.md:320) |
| "refresh the trace", or an upstream change the user names or step 3c finds (BRD chunk 16 written, screens or mockups changed, SDD §7.3 changed, a new BRD or BRD version) | Targeted regeneration per the Refresh triggers, then step 6a; version bump (lld-unifier/SKILL.md:321) |
| "the SDD has a new version", or step 3c finds one | See §10 (lld-unifier/SKILL.md:322) |
| "Add a service to this LLD" | New `04-implementation/<service-slug>.md`, master index updated, the service's use cases traced, the Scope of this LLD's Child LLDs row updated; version bump (lld-unifier/transform-detection.md:171-177) |

Chunk 15 flags and OQ-NN rows have no prompt of their own: the user edits the source chunk and asks for its regeneration (step 9), which regenerates the index (lld-unifier/chunks/15-open-questions.md:15-16).

Terminology collision: this skill mixes "shape" (chunks / combined), "direction" (the prompt's word), and "Mode" (the 00-metadata field, Changes Log column, master header, and frontmatter "Three modes, always asked first", lld-unifier/SKILL.md:6); modes.md:3 calls both axes "two orthogonal mode dimensions", and the SDD's Child LLDs column is `Direction`, fed by "This run's mode" (lld-unifier/sdd-to-lld.md:218). See 08-states-and-vocabulary.md.

## 6. Conversation flow

| # | Trigger | Exact text | Options | Default | Skip condition |
|---|---|---|---|---|---|
| 1 | Run started with no shape argument | "**Output shape?** [chunks / combined] - default `chunks` (press Enter to accept)." (lld-unifier/SKILL.md:63) | `chunks` / `combined` | `chunks` | Argument passed, shape already implied in the request ("do NOT ask: proceed with the implied shape and confirm in one short line", lld-unifier/SKILL.md:74), or an existing LLD, which keeps its own shape without asking (lld-unifier/SKILL.md:74) |
| 2 | Every run, after shape | "**Direction?** [from-code / from-sdd / hybrid]" (lld-unifier/SKILL.md:107), with the three option bullets of §5 | from-code / from-sdd / hybrid plus shorthands | Smart default from inputs; the recorded Mode on updates | Never skipped; "Direction ... is never silently inferred" (lld-unifier/SKILL.md:82) |
| 3 | Intake, "at most **three** questions before starting" (lld-unifier/SKILL.md:127) | Project / system name; source material (code path? SDD path? both?); direction confirmation | Free text / paths | Pulled from arguments when provided | "If an answer is in the conversation, do not re-ask." (lld-unifier/SKILL.md:133) |
| 4 | SDD does not record Project Type (step 3a) | Question UI: Greenfield or Brownfield, with the justification line | Greenfield / Brownfield | None | SDD §1 records it; pure from-code assigns Brownfield without asking (lld-unifier/SKILL.md:146) |
| 5 | Brownfield recorded but only an SDD provided | "Brownfield project type per the recorded Project Type: was the existing codebase intentionally excluded? Direction `from-sdd` will document the *target* design without reflecting the *current* code. Consider `hybrid` (provide both) or `from-code` (point at current code) for accurate documentation." (lld-unifier/transform-detection.md:35) | Keep from-sdd / provide code / switch | `hybrid` if both inputs become available, else keep from-sdd | Greenfield, or both inputs already given |
| 6 | Existing LLD and upstream versions moved (step 3c) | One bundled offer: "Make one offer for everything that changed", a targeted regeneration listing each changed SDD chunk with every LLD chunk it maps to, plus the trace refresh each BRD change fires (lld-unifier/SKILL.md:159) | Accept (one update) / decline | None | First build, or SDD and BRDs unchanged. "Never refresh silently: the user accepts the refresh, or the LLD keeps its content and the handoff names the SDD and BRD versions it still reflects" (lld-unifier/SKILL.md:159) |
| 7 | Step 6b Roadmap and no natural breaks | Question UI: phase grouping for the §13 services and their BRD use cases | 3-6 delivery phases | None | Natural breaks exist; pure from-code writes "Not applicable - reverse-engineered LLD." (lld-unifier/SKILL.md:241) |
| 8 | Open items answered before the handoff | No fixed prompt: the user answers OIs in the decision queue, or an answer policy the user set for the run answers them | Per-OI options | None; unanswered OIs stay `Open` | No open items answered. Accepted options are "applied in the same update and Changes Log row, each with its Resolution Log row" (lld-unifier/SKILL.md:256), then one scoped application check runs |

## 7. Work pipeline

1. **Direction resolution** (steps 1-2): shape per argument or prompt; direction per the mandatory prompt, smart defaults, and the Project Type override. `partial` is detected, not offered.
2. **Specs inputs (step 3a):** resolve Project Type and Tech Stack before generating. Pure from-code: "Tech Stack comes from the actual dependency manifests and Project Type is Brownfield" (lld-unifier/SKILL.md:146). Legacy Specs chunks are consumed read-only.
3. **Trace inputs (step 3b):** read the SDD's Source BRDs register, the BRD delivery states, and the §13 scope. The SDD-finished check can stop the run here (§9).
4. **Upstream version checks (step 3c):** on every run that reads an SDD, compare the versions recorded in 16 §19.1 with the SDD's current version, the Source BRDs register, each BRD master, and the BRD chunk 14 rows against the screens 14 §17.3 cites (chunk 14 changes bump no BRD version, so only this row-by-row reading finds them). Emit the single bundled refresh offer of §6.
5. **The from-code pipeline** (from-code, hybrid, partial):
   - *Phase 1, dispatch `feature-dev:code-explorer`:* the 16 numbered asks, each answered with file:line citations and no narrative, capped at ~3000 lines (lld-unifier/agent-orchestration.md:31-88):
     1. Entry points (controllers, event listeners, schedulers, CLI mains)
     2. Service decomposition (modules, packages, build tool, main class)
     3. Call graph per service
     4. Class and interface inventory per service
     5. Database schema per service (Flyway migrations, tables, indexes, FKs)
     6. Kafka topology (plus in-process domain events in a modular monolith)
     7. REST contracts per service (plus in-process ports in a modular monolith)
     8. Cross-cutting hooks (interceptors, aspects, filters, guards)
     9. Structural pattern detection (Strategy, Factory Method, Chain of Responsibility, Mediator, saga orchestrator, outbox candidates)
     10. Resilience4j config per call
     11. Observability hooks per service
     12. Multi-tenancy enforcement points
     13. Anti-patterns (surfaced as `⚠ policy` findings)
     14. Frontend routes with their route `data`
     15. E2E specs with their tags
     16. Use-case markers (`@UseCase` annotations, `use_case` MDC keys, span attributes)
   - *Phase 2, dispatch `code-documentation:docs-architect`:* per-service narratives, pseudocode, pattern subsections, workflow narratives, saga narratives, dependency view, operationalised style, each block tagged `<!-- target: <chunk>:<section> -->` for routing (lld-unifier/agent-orchestration.md:125).
   - *Template fitting (the agent's own work):* structural facts route verbatim (high confidence); narrative routes with its flags; untagged blocks are dropped with a warning; flags are grepped and indexed into chunk 15 (lld-unifier/agent-orchestration.md:219-224).
6. **The from-sdd pipeline:** read the SDD in full (numeric order for chunks, end-to-end for combined), walk the field mapping table (lld-unifier/sdd-to-lld.md:295-348), and "Apply CLAUDE.md defaults aggressively" (lld-unifier/SKILL.md:202) with attribution. Sections the SDD and CLAUDE.md cannot fill get `> TODO: <best-guess> - verify`.
7. **The hybrid two-pass diff:** run both pipelines in memory ("designed" and "built" views), then diff section by section: match → no marker (✅ implicit); differ → reconciled content + `⚠ drift` + `> Drift note:`; code-only → `🆕 code-only`; SDD-only → `⛔ sdd-only` (lld-unifier/hybrid-drift.md:36-69). One unified LLD, never separate `designed/` and `built/` folders.
8. **Partial-code handling:** for an expected service with no code, emit the canonical three-line placeholder (status, owns use cases not built, re-run TODO; quoted in §11) and note the choice in chunk 15 §18.4.
9. **Step 6a, trace reconciliation:** run the checks of lld-unifier/sdd-to-lld.md:181-188 (one keyed workflow block per active in-scope use case, lines equal to §7.3 and BRD chunk 16, index equal to §7.3 both ways, spec tags naming real IDs, `@UseCase` placement, every link resolving, every BRD ID keyed). "Fix what is mechanical (a wrong anchor, a missing key, a cell that disagrees with its home); flag the rest ... Never resolve an upstream disagreement in the LLD." (lld-unifier/SKILL.md:232). Record the upstream state in 16 §19.1.
10. **Step 6b, Specs synthesis (mandatory, after the body):** "derived synthesis, not new authoring" (lld-unifier/SKILL.md:237): Mission distilled from SDD §1 (2-3 sentences); Tech Stack verbatim with version pins, cross-checked against §6.3 (a mismatch is drift); Roadmap grouping §13 services into 3-6 delivery phases; Project Type verbatim with the justification line and the LLD direction taken. "Tone: short, precise, declarative (constitution voice)." (lld-unifier/SKILL.md:244).
11. **Step 6c, register in the parent SDD:** when the SDD has a Child LLDs table, add or update this LLD's row there (matched by Link, §10). "It is the only write outside the LLD folder." (lld-unifier/SKILL.md:248).
12. **Step 7, cleared-context review (mandatory):** dispatch the reviewer (Agent tool `general-purpose`; the `comprehensive-review` plugin's full review may run inside the brief) with no conversation memory. On content updates, dispatch the **delta review** instead: a fresh reviewer scoped to the Changes Log `Chunks:` list, reading chunk 18 first, never raising an existing item, taking the next free OI IDs (lld-unifier/SKILL.md:254). It adds one dated coverage row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN (vX.X)`, `[YYYY-MM-DD] delta: 04-implementation/<service>.md (vX.X)` for a per-service file, `[YYYY-MM-DD] delta: section N (vX.X)` in combined shape, or `[YYYY-MM-DD] delta: global (vX.X)`, "where vX.X is the LLD version when the review runs"; "Earlier rows keep their labels" (lld-unifier/SKILL.md:254).
13. **Step 8, handoff:** surface the structured summary of §13.

Named sub-agent dispatches the platform must model: `feature-dev:code-explorer` (Phase 1), `code-documentation:docs-architect` (Phase 2), the cleared-context reviewer (full and delta), and the application check (a fresh cleared-context reviewer with the same brief, limited to the passages applied answers changed, "with no new hunt", lld-unifier/SKILL.md:256).

## 8. Review and decision loops

Two flag families coexist (lld-unifier/SKILL.md:260-263):

- **Author flags (chunk 15):** "author-generated index of inline confidence flags. Lives alongside the body." Every flag is indexed in chunk 15: §18.1 drift, §18.2 TODO, §18.3 Confirm, §18.6 policy, with §18.5 counting open flags per section.
- **Reviewer items (chunk 18):** "reviewer-generated external findings with options. Independent of the body." The reviewer's job is "to find gaps the author *did not recognise*" (lld-unifier/SKILL.md:258); it skips anything already in chunk 15.

The confidence tiers behind the author flags (lld-unifier/confidence-rules.md):

| Tier | Emission | Grounded in |
|---|---|---|
| High | Clean, no flag | Code structure (from-code), the SDD states it (from-sdd), a CLAUDE.md hard rule applies |
| Medium | Content + `> Confirm: [reason]` | Structural heuristics, a CLAUDE.md guideline applied, plausible but unpinned inference |
| Low | Content + `> TODO: <best-guess> - verify` | Speculation from names and branches, SLOs, threat notes, peak scenario multipliers; a choice resting on an SDD item still `Decided - pending application`, where the body keeps the SDD text and only the flag gives the decided option (lld-unifier/confidence-rules.md:122) |

Weighting is per direction (separate tables for from-code and from-sdd in lld-unifier/confidence-rules.md:73-122). Upgrade rule: "if a claim is supported by a passing unit/integration test that exercises it, upgrade by one tier" (lld-unifier/confidence-rules.md:93). Hybrid takes the higher of the two contributing confidences, except the fact of drift itself is High (lld-unifier/confidence-rules.md:128-130).

The cleared-context reviewer (step 7): receives all generated chunks including chunk 15 and chunk 17, the SDD contract registries (§14 with §14.10, §15 with its `Internal (in-process)` ports, §16, §7.3), the BRD chunks (05, 06x, 11, 14, 16), and CLAUDE.md. It writes directly to chunk 18; "When it cannot write files, it returns the text and the main agent inserts it unchanged." (lld-unifier/SKILL.md:276). Coverage is recorded per service, one line per risk surface (error envelope vs RFC 9457, transaction propagation, idempotency, multi-tenancy filtering, outbox correctness, saga compensation, retry/backoff Resilience4j, observability, contract/integration/e2e test coverage, OpenAPI/event-schema versioning, duplication), plus global lines for contract drift, Specs-body consistency, and use-case traceability, each "`checked: N findings (OI IDs)` or `checked: no issue found`" (lld-unifier/SKILL.md:277). "Zero findings is a valid result for a checked surface. Re-dispatch only when a surface is unchecked or a finding lacks evidence." (lld-unifier/SKILL.md:277).

OI schema, exact fields (lld-unifier/chunks/18-open-items-and-clarifications.md:23-32):

| Field | Rule |
|---|---|
| **ID** | OI-NN. Stable across revisions |
| **Where** | Service name + sub-section, or "global" |
| **Type** | Implementation gap / Missing edge case / Pattern misapplication / Error path / Concurrency hazard / Transaction boundary / Idempotency gap / Multi-tenancy leak / Test gap / Drift / Contract drift / Specs-body mismatch / Duplication / Traceability gap / Missing scenario |
| **Concern** | One paragraph |
| **Options** | At least 2, each with a one-line tradeoff |
| **Recommendation** | REQUIRED. "always pick one, even for close calls" |
| **Why** | REQUIRED. Never empty, never "best option" |
| **Status** | "Open / Resolved (link to LLD update) / Deferred (with rationale)" (lld-unifier/chunks/18-open-items-and-clarifications.md:32) |

Differences from the BRD/SDD open-item schema: the field is **Recommendation**, not Recommended Answer; statuses are Open / Resolved / Deferred with no acceptance loop and no `Accepted - applied` status; answers are applied in the same update as plain implementation text ("no option letter, date stamp, or progress note", and an answered `> TODO:` or `> Confirm:` is removed, lld-unifier/SKILL.md:256). See 09-open-decisions.md. Terminology collision: see 08-states-and-vocabulary.md.

Carry rule for applied answers (lld-unifier/SKILL.md:256): "Other text that the applied option makes wrong, inside or outside the item's Where, is brought in line in the same step when one wording is clearly right (the same fact stated again, a count, a cross-reference; search the LLD for the words the option replaces); name the OI ID with that text in the Changes Log row. Text that needs a choice is left for the application check to raise." The Changes Log, the chunk 18 Resolution Log, and the Reviewer Notes are records: an applied answer that corrects one of their earlier entries "adds a new entry in this update and leaves the old one as it is".

OI status transitions (lld-unifier/sdd-to-lld.md:204; lld-unifier/chunks/18-open-items-and-clarifications.md:32, 73, 77):

| Event | Status | Resolution Log row |
|---|---|---|
| An accepted option is applied in the same update | `Resolved (link to LLD update)` | Option chosen - short note |
| A refresh answers an `Open` or `Deferred` item | `Resolved` | `Settled by SDD v[X.X]` (or `[KEY] v[X.X]`), linking the section that answers it |
| A refresh answers part of an item | Stays `Open` | Names the settled part |
| A refresh overturns a `Resolved` item and decides the new design | Stays `Resolved` | `Superseded by SDD v[X.X]` (or `[KEY] v[X.X]`) |
| A refresh overturns a `Resolved` item and leaves a choice open | Back to `Open`, Concern updated | `Reopened by SDD v[X.X]` (or `[KEY] v[X.X]`) |
| A refresh confirms a `Resolved` item by answering a flag its Resolution Log row names | Stays `Resolved` | `Settled by SDD v[X.X]` (or `[KEY] v[X.X]`), naming the removed flag |

A refresh also removes each `> TODO:` or `> Confirm:` the change answers, states the answer by linking the section that gives it, and lists that chunk and chunk 15 under `Chunks:` (lld-unifier/sdd-to-lld.md:204). The delta review then "checks the items the refresh marked settled, superseded, or reopened" (lld-unifier/SKILL.md:254).

Drift markers (hybrid): `⚠ drift`, `🆕 code-only`, `⛔ sdd-only`, each with a `> Drift note:` block ("SDD says X, code does Y." and variants, lld-unifier/hybrid-drift.md:16-18); ✅ is implicit; text fallbacks `[ALIGNED]`, `[DRIFT]`, `[CODE-ONLY]`, `[SDD-ONLY]`, `[POLICY]` are allowed (lld-unifier/hybrid-drift.md:20). Severity defaults High / Medium / Low per drift type, recorded in §18.1; the reviewer can edit. `⚠ policy` is a separate family for code that breaks a CLAUDE.md rule, in every mode that reads code: "It is not drift: it claims no SDD disagreement" (lld-unifier/pattern-rules.md:200), indexed in §18.6 with the rule cited and the author's recommended fix.

The application check and the two-pass limit: after answers are applied, "run one scoped application check: a fresh cleared-context reviewer with the same brief ... limited to the passages the applied items changed and the passages that depend on them, with no new hunt", adding one dated row per applied item ("its Service cell reads `[YYYY-MM-DD] application check: OI-NN (vX.X)`, with the LLD version when the check runs, brackets included", for example `[2026-10-07] application check: OI-14 (v1.4)`), and "a gap it finds becomes a new `Open` item and waits for a later request" (lld-unifier/SKILL.md:256). "One request has at most two review passes: the full or delta review, and this check." (lld-unifier/SKILL.md:256). "Item 4's re-dispatch of an unchecked row is not a new pass." (lld-unifier/SKILL.md:256).

Decision records: there is NO decision-log.md register for this agent (see 09-open-decisions.md). Decisions live in chunk 15 §18.4 Decisions Pending (OQ-NN, with "Recommended option" and "Why" columns, lld-unifier/chunks/15-open-questions.md:51-53), in the 00-metadata Changes Log, and in the chunk 18 Resolution Log, whose outcomes read: "Option chosen - short note, or Settled by, Superseded by, or Reopened by SDD v[X.X] (or [KEY] v[X.X]) - short note" (lld-unifier/chunks/18-open-items-and-clarifications.md:77).

## 9. Gates and states

This agent has **no generation gate of its own**, in contrast to the BRD's G1-G5 (see 03-agent-brd.md) and the SDD's E1-E4 (see 04-agent-sdd.md). What it has instead:

| Mechanism | Behavior |
|---|---|
| Step 3b SDD-finished check (stops the run) | "If its master shows a part `Pending` or `In progress`, or §7.3 still reads `Pending (part 2)`, stop and name the missing part" (lld-unifier/SKILL.md:152). The platform surfaces this as a run-blocking error naming the missing SDD part, not as a gate |
| Step 3c upstream version checks | Single bundled refresh offer (§6, row 6); "It never refreshes silently." (lld-unifier/sdd-to-lld.md:57) |
| Step 6a trace reconciliation | Mechanical fixes applied; everything else flagged; never an upstream disagreement resolved in the LLD |
| Confidence tiers instead of blocking | "Never blocks low-confidence sections from emitting ... The reviewer decides what to keep." (lld-unifier/SKILL.md:376) |

Upstream states it consumes:

| State | Effect |
|---|---|
| BRD chunk 16 `Up to date` / `Provisional` / `Stale` | Cited; `Stale` or `Provisional` is named in 16 §19.1 and the handoff (lld-unifier/sdd-to-lld.md:55) |
| BRD chunk 16 absent or `Locked` | "`Pending (BRD 16 not written)` in every test case slot; specs tagged with use case IDs only" (lld-unifier/sdd-to-lld.md:169) |
| SDD §7.3 `Not applicable - no source BRD.` | The whole use-case trace is not applicable (lld-unifier/SKILL.md:153) |
| SDD chunk 19 (§24 e2e) absent | Tolerated: "may be absent until the SDD open items are cleared" (lld-unifier/sdd-to-lld.md:322) |
| SDD E2E gate `Locked` or `Stale` | Never stops the run: "A `Locked` or `Stale` E2E gate does not stop the LLD: name its state in 16 § 19.1 and the handoff" (lld-unifier/SKILL.md:152); behind a `Stale` gate line, SDD chunks 02 to `13x` win where chunk 19 differs (lld-unifier/sdd-to-lld.md:322) |
| SDD §23 item `Open` or `Deferred` that an implementation choice depends on | A `> Confirm:` or `> TODO:` that cites it, by the tiers of confidence-rules.md (lld-unifier/sdd-to-lld.md:347) |
| SDD §23 item `Decided - pending application` that an implementation choice depends on | A `> TODO:` that cites it: "the body follows the SDD text as it stands, and the flag gives the decided option as its best guess", until sdd-unifier applies it (lld-unifier/sdd-to-lld.md:347; lld-unifier/confidence-rules.md:122) |
| SDD/BRD versions vs 16 §19.1 | Drive the step 3c offer; the Child LLDs row records the SDD version 16 §19.1 records: after a build or an accepted refresh, the SDD's current version, "which clears sdd-unifier's out-of-date note"; after a declined refresh, the older version, "with that note kept" (lld-unifier/sdd-to-lld.md:220) |

## 10. Handoffs

**Upstream (handoff launcher cards that start this agent only on the user's word):**

| Trigger phrase | Meaning | Routing |
|---|---|---|
| "the SDD has a new version" | Targeted regeneration of the LLD chunks mapped from the SDD chunks its Changes Log lists since the version in 16 §19.1, plus 16 §19.1, the Child LLDs row, and the chunk 18 items and flags the change answers; then step 6a, and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13) (lld-unifier/SKILL.md:322). How far it reaches: for each field mapping row whose SDD source the change touched, the row's destinations are "compared with that whole source as it stands now, not only with what changed", each judged by the part of that source the row sends to it; the other destinations of a listed SDD chunk are checked for the change only; an SDD Changes Log row that names no sections makes every row of its listed chunks touched; applied answers and flags stay unless the change answers them (lld-unifier/sdd-to-lld.md:202) | Direct to this agent |
| "refresh the trace" | Targeted regeneration of the trace per the Refresh triggers (the 04 lines, 14 §17.3, 13 §16.8, 16 §19.1 and §19.9, and the chunk 18 items and flags the change answers), then step 6a (lld-unifier/SKILL.md:321; lld-unifier/chunking.md:185). BRD chunk 16 written and chunk 14 `MK-NN` row changes bump no BRD version, so they reach this agent directly (lld-unifier/SKILL.md:159; brd-unifier/delivery-chunks.md:438) | Direct to this agent |
| "BRD `<KEY>` has a new version" | A BRD newer than the SDD's Source BRDs register is "named in the offer with the suggestion to update the SDD first through sdd-unifier ... its trace refresh waits for the SDD" (lld-unifier/SKILL.md:159) | Redirected while the BRD is newer than the SDD's Source BRDs register: update the SDD first via the Architect, then run this agent; once the register names the version, its trace refresh runs here (lld-unifier/sdd-to-lld.md:197) |
| Business review completed | The Review Panel never touches the LLD. Its findings reach this agent as a new SDD version, arriving through the standard "the SDD has a new version" trigger (see 06-agent-business-reviewer.md) | Via the SDD only |

**Downstream:**

- **The Child LLDs row (the only cross-document write).** Exact columns: `LLD | Scope (§13 services) | Direction | Version | SDD version | Link` (lld-unifier/sdd-to-lld.md:214-221). Direction is "This run's mode: `from-sdd`, `hybrid`, `partial`, or `from-code`"; SDD version is the version 16 §19.1 records: the SDD's current version after a build or an accepted refresh, "which clears sdd-unifier's out-of-date note", the older one after a declined refresh, "with that note kept" (lld-unifier/sdd-to-lld.md:220); Link is this LLD's `[project-slug]-lld-master.md` (or its combined file) relative to the SDD file (lld-unifier/sdd-to-lld.md:221); location: SDD chunk 00 `## Document Lineage` > `### Child LLDs (children)`, or the same section in the cover of a combined SDD. The row is "matched by Link. It never touches other rows"; an SDD without that table gets no row, and the handoff suggests upgrading it through sdd-unifier (lld-unifier/sdd-to-lld.md:212). It runs on every run that reads an SDD: "This runs whether or not the use-case trace applies" (lld-unifier/SKILL.md:248). "The row replaces `None yet`, and the handoff names the change." (lld-unifier/sdd-to-lld.md:223). "sdd-unifier marks a row whose SDD version is older than the SDD's current version as out of date; the next LLD run offers the refresh (SKILL.md step 3c)." (lld-unifier/sdd-to-lld.md:223). "Never writes into the SDD, except this LLD's own row in the SDD's Child LLDs table." (lld-unifier/SKILL.md:371).
- **The Specs chunk for speckit.** "Speckit `/constitution` reads this chunk verbatim." (lld-unifier/SKILL.md:244). The platform treats `17-specs.md` as the canonical constitution source; legacy SDD/BRD Specs are demoted to read-only inputs.
- **The §19.9 production-bug index.** One row per SDD §7.3 row, in the same order and BRD groups, merged and removed use cases included; "a consolidated view: each column is read from its home, and it never states a mapping its home does not state" (lld-unifier/sdd-to-lld.md:147). Future Developer and Tester agents and the support workflow start here.
- **The runtime `use_case` convention future Developer agents must honor:** "Every entry point §7.3 lists for an in-scope use case ... carries a project annotation, `@UseCase("REFUNDS/UC-04")`. ... One aspect puts `use_case` into the log MDC and onto the server or consumer span, and clears it afterwards." (lld-unifier/sdd-to-lld.md:139). Frontend routes carry it in route data: `data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-04'] }` (lld-unifier/sdd-to-lld.md:128). Multi-use-case entry points join values "in §7.3 order, joined by commas without spaces" (lld-unifier/sdd-to-lld.md:140), so one use case's requests are found "by matching a whole comma-delimited token, never by equality": `(^|,)REFUNDS/UC-04(,|$)` (lld-unifier/sdd-to-lld.md:140). "A use case ID is not tenant data or PII, so it is allowed at INFO." (lld-unifier/sdd-to-lld.md:142). The convention is flagged `> Confirm:` "unless SDD §11.4 Observability or the owner's `13x` Observability already settles it" (lld-unifier/sdd-to-lld.md:143).
- **Missing version pins.** A pin missing from the resolved stack "is never asked for here: §6.3 carries one `> TODO:` that names each missing pin and SDD §6 as its home, ... and the handoff suggests pinning it in SDD §6 through sdd-unifier" (lld-unifier/SKILL.md:240). The launcher phrases this as a task for the Architect agent.

## 11. Edge cases and failure modes

| Case | Behavior |
|---|---|
| Pure from-code (no SDD) | Tech Stack from the actual dependency manifests; Project Type Brownfield; workflows headed `### Workflow: [name]`; "every trace slot reads `Not applicable - no source SDD`" (lld-unifier/code-extraction.md:66); Roadmap "Not applicable - reverse-engineered LLD." (lld-unifier/SKILL.md:241) |
| Partial code + SDD | Placeholder per un-built service, verbatim in the block below this table (lld-unifier/transform-detection.md:49-51). No class skeleton for code that does not exist |
| Legacy master name | "Any run on an LLD whose master is still `lld-master.md` ... Rename it to `[project-slug]-lld-master.md`, update the chunk footers and this LLD's Child LLDs row in the SDD, and name the rename in the handoff." (lld-unifier/SKILL.md:323) |
| Legacy Specs chunks | "If one exists, consume it as read-only input (its Tech Stack pins win over CLAUDE.md defaults; if it disagrees with SDD §6, flag the drift). This skill still authors the canonical `17-specs.md`." (lld-unifier/SKILL.md:142) |
| Older SDD without lineage | Plain BRD IDs, flagged once in chunk 15; the handoff suggests upgrading the SDD, offered once: "sdd-unifier offers to add §7.3 and the lineage on its next run" (lld-unifier/sdd-to-lld.md:175) |
| BRD chunk 16 not written | `Pending (BRD 16 not written)` in every test case slot; e2e specs carry use case tags only (lld-unifier/sdd-to-lld.md:169) |
| Unmatched entry points (SDD given) | A platform endpoint carries no use case; an endpoint doing what the BRD or SDD asks for gets the `No BRD use case - realises [link]` line; the rest get `> Confirm: [METHOD] [path] matches no SDD §7.3 entry point`. "They are open questions, never a new UC." (lld-unifier/code-extraction.md:69) |
| `[NEEDS CLARIFICATION: ...]` in the SDD | "Carry it as a `> TODO:` that cites the SDD section; never resolve it in the LLD." (lld-unifier/sdd-to-lld.md:176). This agent never emits that marker itself |
| Low-confidence sections | Never blocked: emit plus flag, index in chunk 15, let the reviewer decide (lld-unifier/SKILL.md:376) |
| SoW-only input | Deflect: "An LLD usually derives from an SDD, not directly from a SoW. ... Want me to first generate a BRD via `brd-unifier`, then an SDD via `sdd-unifier`, then an LLD here? Or do you have an SDD already?" (lld-unifier/transform-detection.md:113) |
| Intentional drift (architect tolerates it) | Run hybrid; resolve markers per row with "tolerated by design - see ADR-NN" (lld-unifier/transform-detection.md:185) |
| From-code snapshot limits | The handoff always notes the four limitations: "Code may have been refactored after the LLD was generated", "Tests pass != code is correct", "Naming != intent", "Comments are not source-of-truth" (lld-unifier/code-extraction.md:121-124) |

The partial-code placeholder, verbatim (lld-unifier/transform-detection.md:49-51):

```markdown
> **Status:** Not yet built. SDD-described in [SDD path] §17.X. [Hybrid: `⛔ sdd-only`]
> **Owns use cases (SDD 09), not built yet:** [[KEY]/UC-NN](...), … [or: None]
> **TODO:** when this service is scaffolded, re-run lld-unifier in the from-code direction on `<service-path>` (SKILL.md step 9, "re-run from-code") to populate this chunk.
```

## 12. UI and productization requirements

**Screens and dashboards:**

| Surface | Content |
|---|---|
| Direction picker card | The three direction options with the §5 bullets, the smart default pre-selected and its reason shown ("only a code path given → from-code suggested"), shorthands hidden behind the card's quick-reply buttons; the prompt is never auto-answered |
| Agent job cards | Live status for each dispatch: code-explorer (Phase 1, 16 asks), docs-architect (Phase 2), reviewer, delta review, application check, each labeled "fresh context, no conversation memory" |
| Confidence flag dashboard | Built from chunk 15: §18.5 counts per section, §18.1-18.3 and §18.6 rows with location links, statuses (Open / Verified / Replaced, Open / Confirmed / Edited, Pending / Done) |
| Drift board (hybrid) | Every `⚠ drift`, `🆕 code-only`, `⛔ sdd-only` marker grouped by severity (High / Medium / Low), each with its `> Drift note:` and recommended resolution; per-row resolution including "tolerated by design - see ADR-NN" |
| Trace coverage view | The §19.9 index rendered against SDD §7.3: rows missing a workflow block, routes without screens, test cases without specs, `Pending (BRD 16 not written)` slots, broken links |
| Specs panel | The four fields (Mission, Tech Stack, Roadmap, Project Type) with per-field status, missing pins named with their "pin it in SDD §6 through sdd-unifier" action, and the "consumed by speckit `/constitution`" label |
| Child LLDs lineage write confirmation | A diff of the exact row written into the SDD (columns `LLD`, `Scope (§13 services)`, `Direction`, `Version`, `SDD version`, `Link`), flagged as the only cross-document write |
| OI queue | Chunk 18 rendered as decision-queue items with Options, Recommendation, and Why; answering applies in the same update and triggers the scoped application check |

**Decision queue items:** the step 3c bundled refresh offer (accept / decline); Roadmap grouping (when asked); open-item answers; OQ-NN Decisions Pending rows with their recommended option and stakeholder; drift resolutions on the drift board.

**Notifications:** "new SDD version detected" (with the mapped LLD chunks listed); "BRD `<KEY>` has a new version" (with the update-the-SDD-first redirect); "refresh offer pending" on an existing LLD whose upstream moved; "BRD chunk 16 became available" (the refresh trigger that fills `Pending (BRD 16 not written)` slots); "SDD part finished" after a step 3b stop.

**Hard-to-productize notes:** codebase access and analysis depth (Phase 1 caps at ~3000 lines; large repos need scoping UI, lld-unifier/agent-orchestration.md:88); answer policies (a user-set policy for the run reaches "the items of the full or delta review only", never the application check's items, lld-unifier/SKILL.md:256); judgment in pattern rationale (semantic claims stay medium confidence by design, so the dashboard must not present them as errors); the `<!-- target: -->` routing and template fitting are deterministic enough to automate, but the confidence weighting behind them is not.

## 13. Handoff inventory

The final summary card (step 8, lld-unifier/SKILL.md:295-309) must surface, in order:

1. **Shape and direction:** project name, version, shape (chunks / combined), direction (from-code / from-sdd / hybrid / partial), file paths.
2. **Counts:** number of chunks (chunks shape) or section count (combined); number of services covered and their names; count of inline Mermaid diagrams.
3. **Drift marker counts (hybrid only):** `⚠ drift` / `🆕 code-only` / `⛔ sdd-only`, indexed in chunk 15 §18.1.
4. **Policy finding counts:** `⚠ policy` findings by severity (every mode that reads code), indexed in §18.6.
5. **Flag counts:** `> Confirm:` and `> TODO:` counts, indexed in chunk 15 (author-flagged).
6. **OI counts and application-check results:** Open Items (OI-NN) in chunk 18 (reviewer-flagged); when answers were applied, "the items applied, the application check's result, and the items it raised, which wait for a new request" (lld-unifier/SKILL.md:304).
7. **Specs status per field:** Mission ✓ / Tech Stack ✓ / Roadmap ✓ / Project Type ✓, or any placeholder fallback, "and name each version pin missing from the resolved stack with the suggestion to pin it in SDD §6 through sdd-unifier; note if a legacy SDD/BRD Specs was consumed as input" (lld-unifier/SKILL.md:305).
8. **Use-case traceability, one line per source BRD:** active use cases in scope and how many have a workflow block, merged or removed ones, routes mapped to a screen vs platform pages, test cases cited (automated / not automated / `Pending (BRD 16 not written)`), the flags, then the link count and whether all resolve. Format example (lld-unifier/SKILL.md:306): `REFUNDS v1.0: 4 active (4 traced), 1 merged; 5 routes (4 screens, 1 platform); 9 TCs (8 automated, 1 not) | LOYALTY v1.0: 2 active (2 traced); TCs Pending (BRD 16 not written) | 71 links, all resolve`. An older SDD (no Source BRDs register or no §7.3) is named here with the upgrade suggestion.
9. **Parent SDD lineage (every run that reads an SDD):** "this LLD's Child LLDs row added or updated, with its Direction and SDD version; on an existing LLD, the step 3c result (SDD and BRDs unchanged, or the newer versions and which chunks were refreshed or left); for an SDD without that table, the suggestion to upgrade it through sdd-unifier" (lld-unifier/SKILL.md:307). A `Locked` or `Stale` SDD E2E gate is named here too (lld-unifier/SKILL.md:152).
10. **Chain handoff check:** "every `../sdd-[sdd-slug]/...` reference resolves; topic, event and role names and `API-NN` contract names and URIs match SDD §14/§15/§16 character-for-character; SDD content is referenced with an implementation delta, or restated in principle 13's derived views with a source per row; every BRD ID carries a key from the SDD's Source BRDs register" (lld-unifier/SKILL.md:308).
11. **One-line offer**, for example "Want me to merge?" or "Want me to re-run from-code now that the missing services are scaffolded?" (lld-unifier/SKILL.md:309), surfaced as handoff launcher actions.
