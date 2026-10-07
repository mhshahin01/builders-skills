# SDD Unifier

The solution design skill: it generates, transforms, or derives a Solution Design Document (SDD) into the house template, owning the entire technical HOW (stage 3 of the lifecycle). Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

---

## What

`sdd-unifier` produces an SDD in the user's standardized template, in one of two layouts: `chunks` (one `.md` file per section grouping, the default) or `combined` (one monolithic file). It runs in one of three intents, detected from the input rather than asked:

| Intent | Trigger | Result |
| ------ | ------- | ------ |
| GENERATE | No source document; a SoW, architecture notes, or a topic seed | Fresh SDD, with technical decisions from the architect or platform defaults |
| TRANSFORM | An existing SDD in another format (vendor template, IEEE 1016, prior in-house) | Content mapped into this template, numbers and version pins preserved verbatim |
| DERIVE-FROM-BRD | A BRD (brd-unifier chunked folder or combined file) | An architect-ready SDD skeleton: BRD-derivable sections auto-filled, SDD-only sections flagged with `[NEEDS CLARIFICATION: ...]` |

The template carries three platform-level contract registries that the rest of the document must conform to verbatim: the Centralized Event Hub (chunk 10: topic names, event names, envelope fields, payload contracts, plus the in-process domain events of a modular monolith), the Service Integration API Contracts (chunk 11: URI, headers, body, error codes, security, and auth per synchronous HTTP integration, or the port, DTOs, errors, permission, and behaviour (idempotency, transaction) of an in-process module call; external contracts stay TBD until you supply the provider documentation), and the Centralized User Roles and Authorities (chunk 12). The End-to-End System Design (chunk 19) consolidates them last, and only after the open items (chunk 18) are cleared. The SDD owns every technical decision; the constitution-grade Specs section (Mission, Tech Stack, Roadmap, Project Type) is deliberately not authored here and is synthesized by `lld-unifier` from this SDD's body.

This skill is a sibling of `brd-unifier`: they work in concert when the workflow is SoW to BRD to SDD. Technical mandates found in a source document arrive via the BRD Appendix section "Technical Inputs for the SDD" and take precedence over platform defaults.

## Why

Architecture documents drift in two ways: against their own contracts (one service publishes an event another consumes under a different name) and against the platform they run on (every project re-litigating the stack). This skill is built to prevent both:

- **One contract surface, reconciled.** Chunk 10 is the event contract registry. Every per-service Event Model must match it character-for-character, every consumed event must have exactly one producer, and consumer lists are reconciled from both sides. Divergences are fixed or flagged (chunk 10 §14.8, chunk 11 §15.5, chunk 12 §16.12), never silently reconciled.
- **The ecosystem is never filled silently.** The §6 Ecosystem Overview goes through a mandatory interactive selection flow: a proposed table (BRD-mandated rows locked, and in a transformation the source SDD's own choices too; platform defaults and BRD-informed recommendations for the rest) is offered for one-shot accept-all or an item-by-item walkthrough, with every decision's source recorded in the Notes column and deviations logged as ADRs.
- **One fact, one home.** The SDD references the BRD by link and ID, never restates it, and inside the SDD the consolidation chunks are views that reference, never mirror, each other. Restated content is a review defect.
- **One SDD, several BRDs, several LLDs.** An SDD derives from one or more BRDs and may be the source of several LLDs. Chunk 00 § Document Lineage lists the source BRDs, each with a short key (`REFUNDS`, `WALLET`), and the child LLDs, whose rows `lld-unifier` writes. With two or more BRDs, conflicts between them (personas, terms, qualities, technical mandates) are asked, recorded as ADRs, or flagged, never resolved silently.
- **Every BRD use case traceable.** When the SDD is derived from brd-unifier BRDs, every use case it cites carries its BRD key and links to its heading in that BRD (`[REFUNDS/UC-04](...)`), chunk 09 names the one service that owns each use case, and §7.3 Use Case Traceability shows per use case, grouped by BRD, its owner, entry points, flows, API contracts, and events. The reconciliation checks it in both directions, links included.
- **Architecture chosen, not assumed.** When deriving from a BRD, a short architecture questionnaire (accept all, or walk through eight questions) recommends a style from the BRD's drivers: a modular monolith for an MVP or small stable scope, hybrid or microservices when teams, load, or independent releases call for it. DDD boundaries, hexagonal structure, and the outbox apply in every style. The house stack (Java 21 / Spring Boot 3.5+, PostgreSQL 17+, Kafka or SNS+SQS, Keycloak, Angular 17+) then seeds the ecosystem proposal, always confirmed through the ecosystem flow.
- **Gaps are flagged, never papered over.** Anything the source material does not cover gets `**[NEEDS CLARIFICATION: <specific question>]**`. Invented capacity numbers, version pins, or technology choices are forbidden.
- **Review in parts, not at the end.** By default the architecture and service decomposition are agreed before any per-service spec is written, and the contracts are agreed before the end-to-end design; `whole` is there for one-shot runs.
- **Settled design in the chunks, history in the register.** Decision narration never lands in the body; `decision-log.md` records how each decision was reached and links the ADR or section that now states it.
- **Independent review, then an acceptance loop.** A cleared-context adversarial reviewer writes the Open Items and Clarifications chunk, each item with a paste-ready Recommended Answer and its Why. The user is walked through accept, adjust, defer, or reject per item, and accepted answers are applied to the body.

## How

### Usage

```text
sdd-unifier [chunks|combined] [parts|whole]
```

| Argument | Action |
| -------- | ------ |
| `chunks` (or empty / Enter / `y` / `default`) | Multi-file chunked output to `./sdd-[project-slug]/`, one `.md` per template section grouping (the default). |
| `combined` (or `c` / `single` / `merged`) | One consolidated file, `./SDD-[ProjectName]-v[X.X].md`. Always written `whole`. |
| `parts` (or nothing, in chunks mode) | Three parts with a stop for review after parts 1 and 2: 00-09 (architecture, ADRs, service decomposition), then `13x` + 10 + 12 + 11 (service specs and the event, role, and API contract registries, reconciled), then 14-18 (operations, appendix, review) with chunk 19 (e2e design) written only once chunk 18 is cleared. See `parts-mode.md`. |
| `whole` (or "one shot", "in one go") | Chunks 00-18 in one run, no checkpoints; chunk 19 follows only if the e2e gate is open. |
| Anything else | Re-prompt once; if still unclear, default to `chunks` and note the fallback. |

Invoking the skill on a folder whose `[project-slug]-sdd-master.md` shows a pending part resumes it; reply "continue" to start the next part, "redo part N" to rewrite one, or "just finish it" to switch to `whole`.

If the request already implies a mode ("give me the full SDD as one file"), the skill proceeds without asking. Conversions and targeted updates are available afterwards on request: "merge" concatenates chunks into a `-MERGED.md` file, "split into chunks" slices a combined file, and "regenerate chunk N" rewrites one chunk, back-fills any other chunk the change makes wrong, and bumps the version.

Invocation prefix depends on the agent: `/sdd-unifier chunks` in Claude Code, `$sdd-unifier chunks` in Codex, `/skill:sdd-unifier chunks` in Kimi Code. Or describe the task in plain words ("derive an SDD from the BRD in ./brd-acme") and the agent picks the skill from its description.

### The workflow

1. **Resolve mode and intent.** Mode comes from the argument or one prompt (default `chunks`). Intent (generate, transform, derive-from-BRD) is detected from the source per `transform-detection.md`.
2. **Intake, capped at three questions.** Project name, source material, mode confirmation if ambiguous. Project Type (greenfield or brownfield) is asked here if the source does not state it; brownfield activates the existing-system-context flow and is recorded in §1 for `lld-unifier` to read.
3. **Architecture questionnaire (derive-from-BRD).** Eight questions (release stage, teams, load; then style, communication, data ownership, tenancy, deployment) pre-filled with recommendations from the BRD's drivers. Accept all in one answer, or walk through them. The choice lands in §6, §8.1, and ADR-01 (`architecture-questionnaire.md`).
4. **Ecosystem selection.** The full proposed §6 table is assembled (precedence: in a transformation, the source SDD's named technologies first; then BRD Technical Inputs verbatim, then user defaults, then skill recommendation), presented compactly, and either accepted in one shot or walked through layer by layer with recommendations first. BRD-mandated and source-SDD rows are locked; replacing a source-SDD row is a recorded design change.
5. **Plan and generate.** Sections or chunks are enumerated with their Mermaid diagrams and clarification markers. In `parts` (the default) the run stops after chunks 00-09 and again after the service specs and registries, each time with a short summary of what to review; `whole` runs straight through. In chunks mode the per-service detailed specs (chunk `13a`, `13b`, ...) are drafted first, consolidated into chunk 10 (event hub), fixes are back-propagated, then chunk 12 (roles) and chunk 11 (API contracts) are written.
6. **Contract reconciliation.** A mandatory pass checks topic and event names, producer/consumer symmetry, payload fields, role and permission tokens, and API contracts (coverage, URIs, auth tokens) across chunks 10, 11, 12, and 13x, the data model of each changed 13x (ERD against Tables Design, `tenant_id` in shared-schema keys, NOT NULL, retention), and, when derived from a BRD, the use-case traceability (§7.3 against its home chunks, and every UC link). What can be fixed is fixed; the rest is flagged in place.
7. **Cleared-context review.** An independent reviewer subagent (no memory of authoring) hunts architecture-level gaps, NFR shortfalls, integration corner cases, and cross-chunk contract mismatches, and writes the Open Items and Clarifications chunk (`18-open-items-and-clarifications.md`, §23 in combined mode), starting with a coverage record per risk surface. A zero-finding review is valid; the reviewer is re-dispatched only when a surface is unchecked or a finding lacks evidence.
8. **Open Items acceptance loop.** Each item is presented with its Recommended Answer and Why; the user accepts, adjusts, defers, or rejects, batched through the question tool. Accepted answers are applied to the body, statuses and logs are updated, and any change to chunks 09 to 13x is re-verified (step 6a). The skill also offers to settle the clarification markers that keep the gate shut, with a recommended answer for each design choice; a fact only its named owner can supply (a provider fact, a legal basis, a business number) is handed off to that owner, never answered. Then the e2e gate (E1-E4) is checked: chunk 19 is written only when it is open, with no override. Every write of chunk 19 gets a cleared-context faithfulness check against its source chunks, and chunk 19 is fixed, and the fixes confirmed, before the gate line reads `Open - Up to date`. A later update that changes content gets a delta review of the chunks it changed (an update that only applies decisions left pending gets an application check of them instead), and its new items go through the same loop. One request runs at most three review passes: one baseline and up to two scoped checks of applied answers.
9. **Present and hand off.** A summary with paths, chunk or section counts, diagram counts, ecosystem outcome, contract status, open-item tally, the e2e gate state, and the chain check that every BRD reference resolves and chunk names match the canonical map so `lld-unifier` can consume them.

### Outputs

- Chunks mode: `./sdd-[project-slug]/` with `NN-short-title.md` files (two-digit prefix, `13a`-style letters for per-service specs), a regenerated `[project-slug]-sdd-master.md` index, and chunk 18 holding the reviewer findings. Typical count is 19 plus one per service. Chunk 19 (e2e design) is gated: it is written only when E1-E4 pass, with no open/deferred OI or divergence, no unresolved value its claims depend on (follow references regardless of marker location), and final relevant sources reconciled with ordered evidence. The master holds the owner-classified E3 inventory; the external named-black-box placeholder exception remains. An already-current consolidation is verified and retained.
- Combined mode: `./SDD-[ProjectName]-v[X.X].md` matching `TEMPLATE-COMBINED.md`.
- Optional: `SDD-[ProjectName]-v[X.X]-MERGED.md` alongside the chunks when the user asks to merge.
- `decision-log.md` in `./sdd-[project-slug]/`: the decision register (architecture questionnaire, ecosystem walkthrough, clarification Q&A, settled markers, business review points, who decided what and when). Created on first use, never merged; the chunks and ADRs carry only the settled design.
- All diagrams are inline Mermaid with a short prose summary; a Miro board is created via the Miro MCP only on explicit request and its link is additive.

### Reference files

| File | Contents |
| ---- | -------- |
| `TEMPLATE-COMBINED.md` | The single-file template; read at the start of any combined-mode generation |
| `chunks/*.md` | The per-chunk template skeletons, including `13a-service-detailed-template.md` and the `sdd-master.md` index skeleton (written per project as `[project-slug]-sdd-master.md`) |
| `chunking.md` | Canonical chunk map, the 13a per-service pattern, contract-consistency rules, merge handling |
| `modes.md` | Chunks vs combined behavioral details |
| `architecture-questionnaire.md` | The step 3b questionnaire: eight questions, recommendation rules by profile (MVP, first release, platform at scale), and how a modular monolith, hybrid, or microservices style shapes the SDD |
| `parts-mode.md` | The `parts` / `whole` generation option: the three parts, checkpoints, exit checklists, back-fill, ID stability, progress record, resuming |
| `decision-log.md` | The decision register companion file: structure, relationship with ADRs, and the rule that chunks carry no decision narration |
| `transform-detection.md` | Decision tree for generate / transform / derive-from-BRD, including how to recognize BRD and legacy SDD formats |
| `source-transformation.md` | Mapping of SoW or existing-SDD content into this template |
| `brd-to-sdd.md` | Explicit BRD-to-SDD field mapping: UC chunks, Users and Use Cases Matrix, parked technical inputs, legacy Specs handling; use-case traceability (UC link format, where each use case is cited, §7.3, its checks) |
| `sdd-quality.md` | What makes a substantive section versus a thin one |
| `mermaid-diagrams.md` | Inline Mermaid conventions per diagram type, plus the Miro-on-demand flow |
