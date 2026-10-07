# Code Extraction (FROM-CODE direction)

This file defines how to drive the two specialist agents (`feature-dev:code-explorer` and `code-documentation:docs-architect`) to populate the LLD chunks from existing source code.

The principle: **structural claims default to high confidence; semantic claims default to medium confidence unless cross-validated.**

See `agent-orchestration.md` for the dispatch templates.

See `confidence-rules.md` for the structural-vs-semantic weighting.

---

## Two-phase pipeline

### Phase 1: Discovery (`feature-dev:code-explorer` agent)

**Goal:** structurally map the codebase. The agent's output is *evidence*, not narrative.

**Inputs to brief the agent with:**

- Target path (root or specific module).
- Optional: SDD path (for cross-reference; helps the agent name services per SDD vocabulary).
- The explicit asks (below).

**Explicit asks:** the 16 asks of the Phase 1 dispatch template in `agent-orchestration.md` (Agent 1), their single home: entry points through use-case markers, including the anti-patterns that `pattern-rules.md` § Anti-patterns to flag reports as `⚠ policy`. Brief them unchanged.

**Output format expected from the agent:** structured Markdown with one section per ask of that template, file:line citations everywhere, no narrative.

### Phase 2: Synthesis (`code-documentation:docs-architect` agent)

**Goal:** turn Phase 1 evidence into per-section narrative content for the LLD.

**Inputs to brief the agent with:**

- Phase 1 findings (the structured Markdown).
- This skill's section schema (paste from the relevant chunks).
- Confidence rules (paste from `confidence-rules.md`).
- Pattern rules (paste from `pattern-rules.md`).

**Explicit asks:** the asks of the Phase 2 dispatch template in `agent-orchestration.md` (Agent 2), their single home: per-service responsibility, pseudocode for non-trivial methods, design-pattern subsections, use-case workflow narratives (headed `### KEY/UC-NN: Title` only when § Tracing to BRD use cases matched an SDD §7.3 entry point, otherwise `### Workflow: [name]`), cross-service sagas, the §5.4 dependency view, and the §6.4 operationalised style, with its confidence rules. Brief them unchanged.

**Output format expected from the agent:** Markdown blocks tagged `<!-- target: <chunk>:<section> -->`, as that template defines.

---

## Template fitting (the skill's own work)

The skill takes Phase 1 + Phase 2 outputs and routes them into the chunks:

- **Structural facts** (call graph, schema, topic names, method signatures) → routed verbatim from Phase 1, no flags (high confidence).
- **Per-service narrative** (responsibility, business logic, pattern rationale) → routed from Phase 2 with `> Confirm:` if Phase 2 flagged the inference.
- **Pseudocode** → routed from Phase 2 verbatim. Pseudocode is medium confidence and carries `> Confirm:`. A file:line citation records where it came from, not that it is right; the flag drops only under the upgrade rules in `confidence-rules.md` (a straight-line method of 10 lines or fewer, or a passing test that exercises it).
- **Diagrams** → Mermaid blocks from Phase 2, embedded inline in the chunks per `mermaid-diagrams.md`.

For sections the agents cannot fill from code alone:

- **SLO targets** (`12-performance.md`): code rarely declares SLOs. From-code mode emits `> TODO: SLO targets - verify with SDD §18 or production data`.
- **Threat notes** (`11-security.md`): code rarely captures threat reasoning. From-code mode emits `> TODO: threat notes - verify with security review or threat model`.
- **Compliance applicability** (`11-security.md` § 14.6): code shows what's done; *whether it's compliant* needs human judgement. Flag with `> Confirm:`.
- **Future enhancements** (`15-open-questions.md` § 18.4 Decisions Pending, as in the `sdd-to-lld.md` field mapping): code rarely tracks future work. Skip if no `// TODO`-style markers found; otherwise transcribe what exists.

---

## Tracing to BRD use cases (only with an SDD)

Code carries no BRD use case IDs of its own, so a pure from-code LLD has no use-case trace: every trace slot reads `Not applicable - no source SDD`, and workflows are headed `### Workflow: [name]`. When an SDD path is given for cross-reference (and in hybrid), match the code to SDD §7.3 and the BRD, then apply `sdd-to-lld.md` § Use-case traceability to what matched.

1. **Entry points.** Match each discovered entry point to a §7.3 Entry points cell by its service, HTTP method, and normalized path. The service is the one whose code exposes the entry point, and it must be the service §7.3 names for it: the Owner, or the service the cell names when it is not the owner. For the path, combine class-level and method-level mappings, then compare segment by segment, treating any `{param}` as equal to any other `{param}` (parameter names are ignored). Event listeners match `Event: [EVENT_NAME]` by service and event name, and scheduled jobs match `Schedule: [name]` by service and name. A full match gives the use case(s) and the owner; it is high confidence (both sides are stated facts). A match on everything but the service, or one whose exposing service cannot be determined, is medium confidence: `> Confirm: [entry point] in [service] matches [KEY/UC-NN] except for the service; §7.3 names [service]` (hybrid: `⚠ drift`).
2. **Unmatched entry points.** A platform endpoint (health, actuator, sign-in, admin tooling) carries no use case. Any other unmatched endpoint that does what the BRD or SDD asks for (a job, a BRD chunk 09 report, an NFR-driven process) gets the `No BRD use case - realises [link]` line of `sdd-to-lld.md` § Use-case traceability, Behaviour no use case covers. The rest get `> Confirm: [METHOD] [path] matches no SDD §7.3 entry point; platform endpoint, or behaviour no BRD use case covers?` They are open questions, never a new UC.
3. **Unmatched §7.3 entry points.** An active in-scope use case whose entry point the code does not have: from-code notes it in chunk 15 (`> Confirm:`); hybrid marks it `⛔ sdd-only` (`hybrid-drift.md` § Use-case trace drift).
4. **Routes to screens.** A route whose `data.screen` names a BRD screen reference (a chunk 14 row's ID, or a screen ID the BRD text carries) maps to it (high confidence), cited as `sdd-to-lld.md` § The link, Targets, says (the chunk 14 row wins). Otherwise match by name against the screen or flow names of the BRD chunk 14 rows (medium confidence, `> Confirm:`). A route with no match is a platform page or gets `> Confirm: no BRD screen for route [path]`. The route's use cases are then read from the BRD for that screen, never taken from the code alone.
5. **Specs.** Existing tags that name BRD IDs fill 13 § 16.8. A tag naming an ID the BRD does not have gets `> Confirm:` (hybrid: `⚠ drift`).
6. **Existing use-case markers.** An `@UseCase` value, `use_case` MDC key, or route `data.useCases` that disagrees with §7.3 or the BRD is `> Confirm:` (hybrid: `⚠ drift`), and the LLD cites the upstream value. A missing marker is a `> Confirm:` in every direction: the code has not adopted the LLD convention yet.

---

## Confidence weighting in from-code mode

Per `confidence-rules.md`:

| Claim type | Default confidence | Flag |
|------------|-------------------|------|
| Class name, method signature, field type | High | None |
| Table / column / index / constraint | High | None |
| Topic name, partition key, consumer group | High | None |
| REST path, method, status code | High | None |
| Pattern detection (interface + multi-impl + context class) | Medium | `> Confirm: pattern detected via structural heuristic` |
| Pattern rationale (why-this-pattern-here narrative) | Medium | `> Confirm: rationale inferred from code structure / naming` |
| Method-level pseudocode | Medium | `> Confirm: pseudocode derived from method body - verify against current code` |
| Cross-service saga step ordering | Medium | `> Confirm: saga step ordering inferred from event flow + listener registrations` |
| Idempotency point identification | High if `Idempotency-Key` header is checked; Medium if inferred from natural-key dedup table | varies |
| Business rule narrative | Low | `> TODO: business rule narrative inferred from variable names + branches - verify` |
| Entry point → use case, by service + method + normalized path (or service + event / schedule) match to SDD §7.3 | High | None |
| Entry point matching §7.3 in everything but the service, or with its service unknown | Medium | `> Confirm: matches [KEY/UC-NN] except for the service` |
| Entry point with no §7.3 match (not a platform endpoint) that nothing in the BRD or SDD asks for | Medium | `> Confirm: matches no SDD §7.3 entry point` |
| Route → screen, by route `data.screen` | High | None |
| Route → screen, by name only | Medium | `> Confirm: route matched to BRD screen by name` |

**Override rule:** if the agent finds a unit/integration test that exercises a claim (e.g., a test verifying a Strategy resolver picks `EnterprisePricingStrategy` for `Tier.ENTERPRISE`), upgrade the confidence by one tier. A test that proves a claim *is* the claim's source-of-truth.

---

## Workflow

1. **Resolve target path** from user input.
2. **Phase 1: Discovery.** Dispatch `feature-dev:code-explorer` with the Phase 1 brief (`agent-orchestration.md`). Wait for output.
3. **Phase 2: Synthesis.** Dispatch `code-documentation:docs-architect` with Phase 1 output + section schema + rules. Wait for output.
4. **Template fit.** Walk the chunks; fill content from Phase 1 + Phase 2; apply confidence flags.
5. **Trace to BRD use cases** when an SDD is given (§ Tracing to BRD use cases), then SKILL.md step 6a; register in the SDD per step 6c.
6. **Index flags** in `15-open-questions.md`.
7. **Write output** per chosen shape.
8. **Specs and review.** SKILL.md step 6b (Specs chunk), then step 7 (cleared-context review).
9. **Surface handoff summary**: file paths, services discovered, patterns detected, confidence flag counts, and the use-case traceability line when an SDD was given.

---

## Limitations to acknowledge in the handoff

The skill ALWAYS notes the following limitations in the handoff summary when in from-code direction:

1. **Code may have been refactored after the LLD was generated.** The LLD captures a point-in-time snapshot. Re-run for current state.
2. **Tests pass != code is correct.** Pattern detection finds structural shape, not correctness.
3. **Naming != intent.** A class named `*Strategy` may not be a Strategy pattern; a true Strategy may not be named that way. The skill leans on structural heuristics, not names, but is fallible.
4. **Comments are not source-of-truth.** The skill does not lift Javadoc / comments as canonical narrative; comments rot, code does not.
