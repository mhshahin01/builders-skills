# Code Extraction (FROM-CODE direction)

This file defines how to drive the two specialist agents — `feature-dev:code-explorer` and `code-documentation:docs-architect` — to populate the LLD chunks from existing source code.

The principle: **structural claims default to high confidence; semantic claims default to medium confidence unless cross-validated.**

See `agent-orchestration.md` for the dispatch templates.

See `confidence-rules.md` for the structural-vs-semantic weighting.

---

## Two-phase pipeline

### Phase 1 — Discovery (`feature-dev:code-explorer` agent)

**Goal:** structurally map the codebase. The agent's output is *evidence*, not narrative.

**Inputs to brief the agent with:**

- Target path (root or specific module).
- Optional: SDD path (for cross-reference; helps the agent name services per SDD vocabulary).
- Explicit asks (see below).

**Explicit asks (always include in the brief):**

1. **Entry points** — controllers (`@RestController`), event listeners (`@KafkaListener`, `@RabbitListener`, `@JmsListener`), schedulers (`@Scheduled`), CLI mains. List one row per entry point with file:line and the trigger.
2. **Service decomposition** — modules / packages / projects that constitute distinct services. List with: name, root path, build tool (Maven / Gradle), main class.
3. **Call graph (per service)** — controller → service → service-impl → repository → external calls. Document with file:line citations.
4. **Class & interface inventory (per service)** — controllers, service interfaces, service impls, repositories, domain types (records, entities). Method signatures.
5. **Database schema** — Flyway migrations enumerated (`src/main/resources/db/migration`). Table list, column types, indexes, constraints. PK/FK relationships.
6. **Kafka topology** — topics produced (`@KafkaTemplate.send` / outbox writes), topics consumed (`@KafkaListener`). Topic names, key strategies, partitioning if discoverable.
7. **REST contracts** — per controller: method, path, request/response types, auth (`@PreAuthorize`), idempotency-key handling.
8. **Cross-cutting hooks** — interceptors (`HandlerInterceptor`), aspects (`@Around`), filters (servlet filters), guards (Spring Security `@Configuration`).
9. **Structural pattern detection** — interfaces with multiple implementations + a context class that holds one of them (Strategy candidate); factory methods returning interface types (Factory candidate); `@Async` + ordered handler chains (Chain of Responsibility); single-listener components routing events (Mediator); orchestrator services with step-by-step compensating actions (Saga). Each detection includes the file:line evidence.
10. **Resilience4j / circuit-breaker config** — `@CircuitBreaker`, `@Retry`, `@Bulkhead`, `@TimeLimiter` annotations. Per call, the configured policy.
11. **Observability hooks** — `@Timed`, `@Counted`, custom Micrometer registrations. List with metric name + labels.
12. **Multi-tenancy enforcement points** — Hibernate filters (`@Filter`), row-level-security policy clauses, query helpers that inject `tenant_id`. Document the enforcement mechanism.

**Output format expected from the agent:** structured Markdown with one section per ask above, file:line citations everywhere, no narrative.

### Phase 2 — Synthesis (`code-documentation:docs-architect` agent)

**Goal:** turn Phase 1 evidence into per-section narrative content for the LLD.

**Inputs to brief the agent with:**

- Phase 1 findings (the structured Markdown).
- This skill's section schema (paste from the relevant chunks).
- Confidence rules (paste from `confidence-rules.md`).
- Pattern rules (paste from `pattern-rules.md`).

**Explicit asks (always include in the brief):**

1. **Per-service responsibility** — one paragraph describing each service's bounded context, derived from its entry points + DB tables + topics produced.
2. **Method-level pseudocode for non-trivial methods** — the agent should identify which methods are non-trivial (multi-step, has branching beyond null-check, touches multiple aggregates) and produce pseudocode. Skip plain CRUD.
3. **Design pattern rationale** — for each structural pattern detected by Phase 1, write the rationale (why this pattern was used here, what it solves) referencing the triggering CLAUDE.md rule. If the pattern is *named* (file/class names suggest it) but not *applied* (the structure doesn't match), do NOT document it.
4. **Use-case workflow narratives** — per use case (entry-point method), describe the control flow step by step, identify idempotency points, identify outbox emission points, identify retry/timeout choices.
5. **Cross-service saga narratives** — if multi-service flows are detected (orchestrator + N participants), describe the saga steps + compensation per step.
6. **Sequence diagram authoring** — per use case, generate a Mermaid `sequenceDiagram` with participants (Client, Controller, Service, DB, Outbox, Kafka, downstream system).
7. **Class diagram authoring (per design pattern)** — for each design pattern, generate a Mermaid `classDiagram` showing roles.
8. **Confidence annotation** — every claim that goes beyond pure structure (e.g., "this Strategy is for tenant-tier pricing") gets a `> Confirm:` flag if rationale was inferred from naming or structure rather than from explicit evidence (comments, tests, ADRs).

**Output format expected from the agent:** Markdown blocks tagged by target chunk (`<!-- target: 04-implementation/wallet-core.md § 7.4 -->`).

---

## Template fitting (the skill's own work)

The skill takes Phase 1 + Phase 2 outputs and routes them into the chunks:

- **Structural facts** (call graph, schema, topic names, method signatures) → routed verbatim from Phase 1, no flags (high confidence).
- **Per-service narrative** (responsibility, business logic, pattern rationale) → routed from Phase 2 with `> Confirm:` if Phase 2 flagged the inference.
- **Pseudocode** → routed from Phase 2 verbatim. Pseudocode is medium-confidence by default; flag with `> Confirm:` unless it directly cites file:line.
- **Diagrams** → Mermaid blocks from Phase 2, embedded inline in the chunks per `mermaid-diagrams.md`.

For sections the agents cannot fill from code alone:

- **SLO targets** (`12-performance.md`) — code rarely declares SLOs. From-code mode emits `> TODO: SLO targets — verify with SDD §18 or production data`.
- **Threat notes** (`11-security.md`) — code rarely captures threat reasoning. From-code mode emits `> TODO: threat notes — verify with security review or threat model`.
- **Compliance applicability** (`11-security.md` § 14.6) — code shows what's done; *whether it's compliant* needs human judgement. Flag with `> Confirm:`.
- **Future enhancements** (`16-references.md`) — code rarely tracks future work. Skip if no `// TODO`-style markers found; otherwise transcribe what exists.

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
| Method-level pseudocode | Medium | `> Confirm: pseudocode derived from method body — verify against current code` |
| Cross-service saga step ordering | Medium | `> Confirm: saga step ordering inferred from event flow + listener registrations` |
| Idempotency point identification | High if `Idempotency-Key` header is checked; Medium if inferred from natural-key dedup table | varies |
| Business rule narrative | Low | `> TODO: business rule narrative inferred from variable names + branches — verify` |

**Override rule:** if the agent finds a unit/integration test that exercises a claim (e.g., a test verifying a Strategy resolver picks `EnterprisePricingStrategy` for `Tier.ENTERPRISE`), upgrade the confidence by one tier. A test that proves a claim *is* the claim's source-of-truth.

---

## Workflow

1. **Resolve target path** from user input.
2. **Phase 1: Discovery.** Dispatch `feature-dev:code-explorer` with the brief (above). Wait for output.
3. **Phase 2: Synthesis.** Dispatch `code-documentation:docs-architect` with Phase 1 output + section schema + rules. Wait for output.
4. **Template fit.** Walk the chunks; fill content from Phase 1 + Phase 2; apply confidence flags.
5. **Index flags** in `15-open-questions.md`.
6. **Write output** per chosen shape.
7. **Surface handoff summary**: file paths, services discovered, patterns detected, confidence flag counts.

---

## Limitations to acknowledge in the handoff

The skill ALWAYS notes the following limitations in the handoff summary when in from-code direction:

1. **Code may have been refactored after the LLD was generated.** The LLD captures a point-in-time snapshot. Re-run for current state.
2. **Tests pass != code is correct.** Pattern detection finds structural shape, not correctness.
3. **Naming != intent.** A class named `*Strategy` may not be a Strategy pattern; a true Strategy may not be named that way. The skill leans on structural heuristics, not names — but is fallible.
4. **Comments are not source-of-truth.** The skill does not lift Javadoc / comments as canonical narrative; comments rot, code does not.
