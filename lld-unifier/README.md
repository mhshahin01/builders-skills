# LLD Unifier

The detailed-design stage of the suite: authors, transforms, or unifies a Low-Level Design (LLD) for the services of an SDD (by default all of them, one `04-implementation/` file per service, or per module in a modular monolith) into the user's standard template (stage 4, Detailed design). Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

---

## What

`lld-unifier` produces an implementation-ready LLD: the bridge from architectural intent to executable code, written in enough detail (class signatures, method-level pseudocode, design patterns with rationale, workflow steps) for an AI implementer or human developer to scaffold code without further questions. It works in three directions, always asked first:

| Direction | When | How |
| --------- | ---- | --- |
| `from-sdd` | Greenfield, before code exists | Forward-design from the SDD (and BRD if linked), per the field mapping in `sdd-to-lld.md` |
| `from-code` | Code already exists | Reverse-engineer the LLD from a codebase using two specialist agents (`feature-dev:code-explorer` for discovery, `code-documentation:docs-architect` for synthesis) |
| `hybrid` | SDD and complete code both exist | Two-pass: generate both views, then unify into one LLD with inline drift markers |

Output is Markdown only, in one of two shapes: `chunks` (the default, one `.md` per section grouping, with one file per service under `04-implementation/`) or `combined` (a single file matching `TEMPLATE-COMBINED.md`). The chunk map runs 00-metadata through 18-open-items-and-clarifications, with the load-bearing chunk 04 split per service and `14-frontend.md` omitted entirely when there is no UI surface.

The skill also owns the Specs chunk (chunk 17: Mission, Tech Stack, Roadmap, Project Type), synthesised after the body as constitution-grade input for SpecKit `/constitution`.

When the SDD derives from brd-unifier BRDs, the LLD carries the SDD's use-case trace down to the code. Each use case gets one `### KEY/UC-NN: Title` workflow block in its owner's file, with a traceability line that links the BRD use case, SDD §7.3, the owner and entry points, the UAT/BAT test cases, and the screens and routes that start it. Routes map to the BRD's screens (the ID of their chunk 14 Mockup coverage row, or a screen ID with no row that the BRD text carries), e2e specs are tagged with use case and test case IDs, entry points carry a `use_case` span and log attribute, and the use-case traceability index (chunk 16 §19.9) ties it together. Separately, every run that reads an SDD registers the LLD in the SDD's Child LLDs table, with or without a source BRD.

## Why

A design doc an implementer cannot code from is a dead document. This skill exists to make the LLD executable and honest about its own uncertainty:

- **Bidirectional by design.** The same template fits reverse engineering, forward design, and unification, so a brownfield codebase and a greenfield SDD land in the same structure and can be diffed.
- **Drift is a feature, not a flaw.** In hybrid mode, divergences between SDD intent and code reality are marked inline (`drift`, `code-only`, `sdd-only` markers with a drift note) instead of being silently reconciled.
- **Design patterns are first-class.** Every applied pattern carries its name, the triggering CLAUDE.md rule, the roles classes and methods play, a one-line rationale, a Mermaid class diagram, and a pseudocode skeleton.
- **Confidence is tiered, not binary.** High-confidence inference emits clean, medium emits with a `> Confirm:` flag, low emits with a `> TODO:` flag plus best-guess content. Nothing is invented to paper over a gap, and nothing is blocked from emitting.
- **One fact, one home.** The LLD references the SDD and restates it only in a derived view that names its source on every row (the runtime stack, tables, the idempotency and transaction cells of in-process port contracts, resilience instances, configuration defaults, and SLOs). Contract names (topics, events, `API-NN` contracts and their URIs, roles, permission tokens) match the SDD character-for-character; contract bodies are cited with only the implementation delta added.
- **A production bug leads back to its requirement.** From a page, route, error report, or failing UAT case, a reader reaches the use case, its LLD workflow, its SDD §7.3 row, its BRD heading, its test cases, and its mockup in a few clicks. Every BRD ID carries its BRD's key (`REFUNDS/UC-04`), so two BRDs' `UC-04` never collide. The trace rests on one workflow block per use case, routes mapped to BRD screens, UAT/BAT cases cited one by one, e2e specs tagged with the same IDs, a `use_case` attribute on every traced entry point, the §19.9 index, and the LLD's own row in the SDD's Child LLDs table. IDs stay with the document that owns them.
- **A second pair of eyes with no memory.** Every generation ends with a cleared-context reviewer subagent whose job is to find what the author did not flag (edge cases, error paths, concurrency hazards, multi-tenancy leaks), written to the Open Items chunk.

## How

### Usage

```text
lld-unifier [chunks|combined]
```

| Argument | Action |
| -------- | ------ |
| `chunks` (default) | Multi-file output to `./lld-[project-slug]/`, one chunk per section grouping, one file per service under `04-implementation/`. Empty input, Enter, or `y` all confirm it. |
| `combined` | Single consolidated file `./LLD-[ProjectName]-v[X.X].md` matching `TEMPLATE-COMBINED.md`. |

The argument controls only the output shape. The direction (`from-code` / `from-sdd` / `hybrid`) is always asked separately and is never silently inferred, though a provided code path or SDD path defaults the prompt accordingly.

Invocation prefix depends on the agent: `/lld-unifier chunks` in Claude Code, `$lld-unifier chunks` in Codex, `/skill:lld-unifier chunks` in Kimi Code. Or describe the task in plain words ("write the LLD for the wallet service from the SDD") and the agent picks the skill from its description.

### The workflow

1. **Resolve output shape.** Chunks is the default; a single question confirms it unless the user already implied a shape.
2. **Resolve direction.** Always asked: from-code, from-sdd, or hybrid, with partial-code handling (missing services get the not-yet-built placeholder that lists the use cases they own).
3. **Intake.** At most three questions: project name, source material, direction confirmation. Plus the Specs inputs (Project Type, Tech Stack) are resolved now because they steer generation. On an existing LLD, a newer SDD version or a BRD change is detected (step 3c): the changed chunks are named and one targeted refresh is offered for all of them, never applied silently.
4. **Plan internally.** Enumerate chunks, workflows, per-service files, applicable CLAUDE.md defaults, and sections needing confidence flags.
5. **Dispatch agents (from-code and hybrid only).** Phase 1: `code-explorer` maps entry points, call graph, dependencies, topics, and patterns with file:line citations. Phase 2: `docs-architect` turns findings into per-service narratives and pattern rationale. The from-sdd direction skips this and reads the SDD directly.
6. **Generate.** Fit content to the chunk skeletons (or the combined template), per the direction's rules: from-code weighting, from-sdd mapping plus aggressive CLAUDE.md defaults, or hybrid's section-by-section diff with drift markers. Then reconcile the use-case trace against SDD §7.3 and the BRD (every link and anchor checked).
7. **Synthesise the Specs chunk.** Mandatory, after the body: Mission, Tech Stack with version pins, Roadmap in 3 to 6 delivery phases, Project Type. Written in constitution voice for SpecKit `/constitution`. Then add this LLD's row to the SDD's Child LLDs table (step 6c).
8. **Post-generation review.** A cleared-context reviewer subagent (no conversation memory) hunts for unflagged gaps and writes the Open Items and Clarifications chunk, each item with options, a recommendation, and a Why. It records a coverage row per service and risk surface; zero findings is valid for a checked surface, and the reviewer is re-dispatched only when a surface is unchecked or a finding lacks evidence. A later update that changes content gets a delta review of the chunks it changed (SKILL.md step 7, On an update).
9. **Present.** A summary covering shape, direction, services covered, diagram counts, drift marker counts, `⚠ policy` finding counts by severity, confidence flag counts, Open Item counts, Specs status, the use-case traceability line per source BRD, the parent SDD's Child LLDs row, and the chain handoff check (every SDD reference resolves, contract names match character-for-character, every BRD ID is keyed).
10. **Cross-shape conversion (on request).** Merge chunks to a `-MERGED.md` file, split a combined file into chunks, regenerate a single chunk or service, refresh after a new SDD version, or re-run from-code once missing services are built.

### Outputs

- `./lld-[project-slug]/` with `NN-kebab-name.md` chunks plus a `[project-slug]-lld-master.md` index (chunks shape), or `./LLD-[ProjectName]-v[X.X].md` (combined shape).
- Per-service implementation files under `04-implementation/`, one per service, each self-sufficient for an implementer.
- `16-references.md` § 19.9: the use-case traceability index, the entry point for production-bug triage.
- One row in the SDD's Child LLDs table (the only write outside the LLD folder).
- `17-specs.md`: the Specs chunk (Mission, Tech Stack, Roadmap, Project Type) consumed verbatim by SpecKit `/constitution`.
- `15-open-questions.md`: the author-generated index of every inline `> Confirm:` and `> TODO:` flag, plus the hybrid drift index and the `⚠ policy` findings (§ 18.6).
- `18-open-items-and-clarifications.md`: the reviewer-generated findings, each with options, a recommendation, and a Why.

### Reference files

| File | Contents |
| ---- | -------- |
| `TEMPLATE-COMBINED.md` | The single-file template, authoritative for COMBINED shape |
| `chunks/*.md` | Per-chunk template skeletons (00 through 18, plus `04-implementation-template.md` and `lld-master.md`, written per project as `[project-slug]-lld-master.md`), authoritative for CHUNKS shape |
| `chunking.md` | Canonical chunk map, per-service split, chunk header contract, merge and re-chunk handling |
| `modes.md` | Chunks vs combined behavioural details |
| `transform-detection.md` | Direction question rules, acceptable shorthands, partial-code resolution |
| `sdd-to-lld.md` | SDD-to-LLD field mapping, use-case traceability rules (keys, links, anchors, homes, upstream gaps, checks, Child LLDs row, refresh), Specs ownership and synthesis, one-fact-one-home rules |
| `code-extraction.md` | How to drive `code-explorer` and `docs-architect` to populate the LLD from a codebase |
| `hybrid-drift.md` | Two-pass orchestration and section-by-section diff rules with drift markers |
| `pattern-rules.md` | CLAUDE.md design rules to triggering conditions (from-sdd) and pattern-detection heuristics (from-code) |
| `confidence-rules.md` | High/medium/low tiering plus structural-vs-semantic weighting |
| `lld-quality.md` | What makes a substantive section versus a thin one |
| `mermaid-diagrams.md` | Diagram conventions: which diagrams default to inline Mermaid versus a Miro link |
| `agent-orchestration.md` | Dispatch templates and confidence-weighting rules for the two specialist agents |
