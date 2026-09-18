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

The template carries three platform-level contract registries that the rest of the document must conform to verbatim: the Centralized Event Hub (chunk 10: topic names, event names, envelope fields, payload contracts), Centralized User Roles and Authorities (chunk 11), and the End-to-End System Design (chunk 16, authored last from the reconciled state). The SDD owns every technical decision; the constitution-grade Specs section (Mission, Tech Stack, Roadmap, Project Type) is deliberately not authored here and is synthesized by `lld-unifier` from this SDD's body.

This skill is a sibling of `brd-unifier`: they work in concert when the workflow is SoW to BRD to SDD. Technical mandates found in a source document arrive via the BRD Appendix section "Technical Inputs for the SDD" and take precedence over platform defaults.

## Why

Architecture documents drift in two ways: against their own contracts (one service publishes an event another consumes under a different name) and against the platform they run on (every project re-litigating the stack). This skill is built to prevent both:

- **One contract surface, reconciled.** Chunk 10 is the event contract registry. Every per-service Event Model must match it character-for-character, every consumed event must have exactly one producer, and consumer lists are reconciled from both sides. Divergences are fixed or flagged (chunk 10 §14.8, chunk 11 §16.12), never silently reconciled.
- **The ecosystem is never filled silently.** The §6 Ecosystem Overview goes through a mandatory interactive selection flow: a proposed table (BRD-mandated rows locked, platform defaults, BRD-informed recommendations) is offered for one-shot accept-all or an item-by-item walkthrough, with every decision's source recorded in the Notes column and deviations logged as ADRs.
- **One fact, one home.** The SDD references the BRD by link and ID, never restates it, and inside the SDD the consolidation chunks are views that reference, never mirror, each other. Restated content is a review defect.
- **Defaults with doctrine.** When the source is silent, the skill falls back to the platform doctrine (EDA with mandatory outbox, DDD bounded contexts, hexagonal per service) and the house stack (Java 21 / Spring Boot 3.5+, PostgreSQL 17+, Kafka or SNS+SQS, Keycloak, Angular 17+), always confirmed through the ecosystem flow.
- **Gaps are flagged, never papered over.** Anything the source material does not cover gets `**[NEEDS CLARIFICATION: <specific question>]**`. Invented capacity numbers, version pins, or technology choices are forbidden.
- **Independent review, then an acceptance loop.** A cleared-context adversarial reviewer writes the Open Items and Clarifications chunk, each item with a paste-ready Recommended Answer and its Why. The user is walked through accept, adjust, defer, or reject per item, and accepted answers are applied to the body.

## How

### Usage

```text
sdd-unifier [chunks|combined]
```

| Argument | Action |
| -------- | ------ |
| `chunks` (or empty / Enter / `y` / `default`) | Multi-file chunked output to `./sdd-[project-slug]/`, one `.md` per template section grouping (the default). |
| `combined` (or `c` / `single` / `merged`) | One consolidated file, `./SDD-[ProjectName]-v[X.X].md`. |
| Anything else | Re-prompt once; if still unclear, default to `chunks` and note the fallback. |

If the request already implies a mode ("give me the full SDD as one file"), the skill proceeds without asking. Cross-mode conversion is available afterwards on request: "merge" concatenates chunks into a `-MERGED.md` file, "split into chunks" slices a combined file, and "regenerate chunk N" rewrites one chunk and bumps the Changes Log.

Invocation prefix depends on the agent: `/sdd-unifier chunks` in Claude Code, `$sdd-unifier chunks` in Codex, `/skill:sdd-unifier chunks` in Kimi Code. Or describe the task in plain words ("derive an SDD from the BRD in ./brd-acme") and the agent picks the skill from its description.

### The workflow

1. **Resolve mode and intent.** Mode comes from the argument or one prompt (default `chunks`). Intent (generate, transform, derive-from-BRD) is detected from the source per `transform-detection.md`.
2. **Intake, capped at three questions.** Project name, source material, mode confirmation if ambiguous. Project Type (greenfield or brownfield) is asked here if the source does not state it; brownfield activates the existing-system-context flow and is recorded in §1 for `lld-unifier` to read.
3. **Ecosystem selection.** The full proposed §6 table is assembled (precedence: BRD Technical Inputs verbatim, then user defaults, then skill recommendation), presented compactly, and either accepted in one shot or walked through layer by layer with recommendations first. BRD-mandated rows are locked.
4. **Plan and generate.** Sections or chunks are enumerated with their Mermaid diagrams and clarification markers. In chunks mode the per-service detailed specs (chunk `10a`, `10b`, ...) are drafted first, consolidated into chunk 10 (event hub), fixes are back-propagated, and chunk 16 (e2e design) is authored last from the reconciled state.
5. **Contract reconciliation.** A mandatory pass checks topic and event names, producer/consumer symmetry, payload fields, and role and permission tokens across chunks 10, 10x, 11, and 16. What can be fixed is fixed; the rest is flagged in place.
6. **Cleared-context review.** An independent reviewer subagent (no memory of authoring) hunts architecture-level gaps, NFR shortfalls, integration corner cases, and cross-chunk contract mismatches, and writes the Open Items and Clarifications chunk (`17-open-items-and-clarifications.md`, §23 in combined mode). Zero findings means re-dispatch with stronger adversarial framing.
7. **Open Items acceptance loop.** Each item is presented with its Recommended Answer and Why; the user accepts, adjusts, defers, or rejects, batched through the question tool. Accepted answers are applied to the body, statuses and logs are updated, and any change touching contracts is re-verified.
8. **Present and hand off.** A summary with paths, chunk or section counts, diagram counts, ecosystem outcome, contract status, open-item tally, and the chain check that every BRD reference resolves and chunk names match the canonical map so `lld-unifier` can consume them.

### Outputs

- Chunks mode: `./sdd-[project-slug]/` with `NN-short-title.md` files (two-digit prefix, `10a`-style letters for per-service specs), a regenerated `sdd-master.md` index, and chunk 17 holding the reviewer findings. Typical count is 18 plus one per service.
- Combined mode: `./SDD-[ProjectName]-v[X.X].md` matching `TEMPLATE-COMBINED.md`.
- Optional: `SDD-[ProjectName]-v[X.X]-MERGED.md` alongside the chunks when the user asks to merge.
- All diagrams are inline Mermaid with a short prose summary; a Miro board is created via the Miro MCP only on explicit request and its link is additive.

### Reference files

| File | Contents |
| ---- | -------- |
| `TEMPLATE-COMBINED.md` | The single-file template; read at the start of any combined-mode generation |
| `chunks/*.md` | The per-chunk template skeletons, including `10a-service-detailed-template.md` and the `sdd-master.md` index skeleton |
| `chunking.md` | Canonical chunk map, the 10a per-service pattern, contract-consistency rules, merge handling |
| `modes.md` | Chunks vs combined behavioral details |
| `transform-detection.md` | Decision tree for generate / transform / derive-from-BRD, including how to recognize BRD and legacy SDD formats |
| `source-transformation.md` | Mapping of SoW or existing-SDD content into this template |
| `brd-to-sdd.md` | Explicit BRD-to-SDD field mapping: UC chunks, Users and Use Cases Matrix, parked technical inputs, legacy Specs handling |
| `sdd-quality.md` | What makes a substantive section versus a thin one |
| `mermaid-diagrams.md` | Inline Mermaid conventions per diagram type, plus the Miro-on-demand flow |
