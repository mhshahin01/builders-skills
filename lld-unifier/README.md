# LLD Unifier

The detailed-design stage of the suite: authors, transforms, or unifies a Low-Level Design (LLD) per service into the user's standard template (stage 4, Detailed design). Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

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

## Why

A design doc an implementer cannot code from is a dead document. This skill exists to make the LLD executable and honest about its own uncertainty:

- **Bidirectional by design.** The same template fits reverse engineering, forward design, and unification, so a brownfield codebase and a greenfield SDD land in the same structure and can be diffed.
- **Drift is a feature, not a flaw.** In hybrid mode, divergences between SDD intent and code reality are marked inline (`drift`, `code-only`, `sdd-only` markers with a drift note) instead of being silently reconciled.
- **Design patterns are first-class.** Every applied pattern carries its name, the triggering CLAUDE.md rule, the roles classes and methods play, a one-line rationale, a Mermaid class diagram, and a pseudocode skeleton.
- **Confidence is tiered, not binary.** High-confidence inference emits clean, medium emits with a `> Confirm:` flag, low emits with a `> TODO:` flag plus best-guess content. Nothing is invented to paper over a gap, and nothing is blocked from emitting.
- **One fact, one home.** The LLD references the SDD, never restates it. Contract names (topics, events, roles, permission tokens) match the SDD character-for-character; contract bodies are cited with only the implementation delta added.
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
2. **Resolve direction.** Always asked: from-code, from-sdd, or hybrid, with partial-code handling (missing services get a `> TODO: not yet built` placeholder).
3. **Intake.** At most three questions: project name, source material, direction confirmation. Plus the Specs inputs (Project Type, Tech Stack) are resolved now because they steer generation.
4. **Plan internally.** Enumerate chunks, workflows, per-service files, applicable CLAUDE.md defaults, and sections needing confidence flags.
5. **Dispatch agents (from-code and hybrid only).** Phase 1: `code-explorer` maps entry points, call graph, dependencies, topics, and patterns with file:line citations. Phase 2: `docs-architect` turns findings into per-service narratives and pattern rationale. The from-sdd direction skips this and reads the SDD directly.
6. **Generate.** Fit content to the chunk skeletons (or the combined template), per the direction's rules: from-code weighting, from-sdd mapping plus aggressive CLAUDE.md defaults, or hybrid's section-by-section diff with drift markers.
7. **Synthesise the Specs chunk.** Mandatory, after the body: Mission, Tech Stack with version pins, Roadmap in 3 to 6 delivery phases, Project Type. Written in constitution voice for SpecKit `/constitution`.
8. **Post-generation review.** A cleared-context reviewer subagent (no conversation memory) hunts for unflagged gaps and writes the Open Items and Clarifications chunk, each item with options, a recommendation, and a Why. Zero findings triggers a re-dispatch with stronger adversarial framing.
9. **Present.** A summary covering shape, direction, services covered, diagram counts, drift marker counts, confidence flag counts, Open Item counts, Specs status, and the chain handoff check (every SDD reference resolves, contract names match character-for-character).
10. **Cross-shape conversion (on request).** Merge chunks to a `-MERGED.md` file, split a combined file into chunks, regenerate a single chunk or service, or re-run from-code once missing services are built.

### Outputs

- `./lld-[project-slug]/` with `NN-kebab-name.md` chunks plus an `lld-master.md` index (chunks shape), or `./LLD-[ProjectName]-v[X.X].md` (combined shape).
- Per-service implementation files under `04-implementation/`, one per service, each self-sufficient for an implementer.
- `17-specs.md`: the Specs chunk (Mission, Tech Stack, Roadmap, Project Type) consumed verbatim by SpecKit `/constitution`.
- `15-open-questions.md`: the author-generated index of every inline `> Confirm:` and `> TODO:` flag, plus the hybrid drift index.
- `18-open-items-and-clarifications.md`: the reviewer-generated findings, each with options, a recommendation, and a Why.

### Reference files

| File | Contents |
| ---- | -------- |
| `TEMPLATE-COMBINED.md` | The single-file template, authoritative for COMBINED shape |
| `chunks/*.md` | Per-chunk template skeletons (00 through 18, plus `04-implementation-template.md` and `lld-master.md`), authoritative for CHUNKS shape |
| `chunking.md` | Canonical chunk map, per-service split, chunk header contract, merge and re-chunk handling |
| `modes.md` | Chunks vs combined behavioural details |
| `transform-detection.md` | Direction question rules, acceptable shorthands, partial-code resolution |
| `sdd-to-lld.md` | SDD-to-LLD field mapping, Specs ownership and synthesis, one-fact-one-home rules |
| `code-extraction.md` | How to drive `code-explorer` and `docs-architect` to populate the LLD from a codebase |
| `hybrid-drift.md` | Two-pass orchestration and section-by-section diff rules with drift markers |
| `pattern-rules.md` | CLAUDE.md design rules to triggering conditions (from-sdd) and pattern-detection heuristics (from-code) |
| `confidence-rules.md` | High/medium/low tiering plus structural-vs-semantic weighting |
| `lld-quality.md` | What makes a substantive section versus a thin one |
| `mermaid-diagrams.md` | Diagram conventions: which diagrams default to inline Mermaid versus a Miro link |
| `agent-orchestration.md` | Dispatch templates and confidence-weighting rules for the two specialist agents |
