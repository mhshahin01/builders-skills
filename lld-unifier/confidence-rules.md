# Confidence Rules — Tiered Inference Emission

The skill emits content at three confidence tiers. Every tier behaves consistently across direction (from-code / from-sdd / hybrid).

---

## The three tiers

### High confidence — emit clean, no flag

The claim is grounded in:

- (FROM-CODE) source code structure (class declarations, method signatures, table DDL, config files, annotations).
- (FROM-SDD) the SDD states it directly.
- (FROM-SDD) a CLAUDE.md hard rule applies and the rule is unambiguous in this context.

Examples:
- Class `FooController` exists at `src/main/java/com/example/foo/FooController.java:42`.
- Table `foo` has columns `id uuid PK, tenant_id uuid NOT NULL, status text NOT NULL`.
- Service `[service-a]` produces topic `foo.lifecycle.created` (per SDD §17.1 Event Model, verbatim - which itself must match SDD §14, the platform event catalog).
- Constructor injection only (CLAUDE.md hard rule, applied unconditionally).

**Emission:** clean content. No flag.

### Medium confidence — emit + `> Confirm:` flag

The claim is grounded in:

- (FROM-CODE) structural pattern detection that uses heuristics (interface + multiple impls + context class → Strategy).
- (FROM-CODE) inference from naming or code shape that is plausible but not directly stated.
- (FROM-SDD) a CLAUDE.md guideline (not a hard rule) applied because the situation matches.
- (FROM-SDD) inference from SDD prose that is plausible but not pinned.

Examples:
- "Strategy pattern is used here for tenant-tier pricing." (Pattern detected structurally; rationale inferred from naming.)
- "This service uses choreography saga for the order-fulfilment flow." (Inferred from event listener registrations + state transitions.)
- "Caching tier is in-process Caffeine, sized 10k entries." (Inferred from `@Cacheable` annotation; size from `application.yml`.)
- "GET /v1/foo p99 latency target is 100ms." (Inferred: SDD §18 didn't pin per-endpoint targets but mentioned 100ms as a service-level target.)

**Emission:** content + `> Confirm: [reason for medium confidence — what to verify]`.

Example:

```markdown
> Confirm: Strategy pattern detected via structural heuristic (interface FooStrategy + 3 implementations + context FooService). Verify the runtime selection logic matches the documented per-tenant-tier rationale.
```

### Low confidence — emit + `> TODO: <best-guess> — verify` flag

The claim is grounded in:

- (FROM-CODE) speculation from variable names + branch structure when the actual rule isn't documented.
- (FROM-CODE) extrapolation from one observed example to a general rule.
- (FROM-SDD) the SDD is silent and CLAUDE.md doesn't speak to the issue.

Examples:
- "Business rule: `foo.amount` cannot exceed `tenant.daily_limit`." (Inferred from a `if (amount > tenant.dailyLimit) throw new ValidationException(...)` block; the SDD didn't state the rule.)
- "Peak scenario: month-end batch reconciliation, 5x sustained RPS for 4 hours." (No SDD §18.3 entry; best guess based on a similar service.)
- "PII column: `customer_email` requires masking in non-prod." (Best guess — the SDD didn't enumerate PII columns.)

**Emission:** best-guess content + `> TODO: <best-guess> — verify or replace`.

Example:

```markdown
> TODO: Best-guess business rule: `foo.amount` cannot exceed `tenant.daily_limit`. Inferred from validation branch at `FooServiceImpl:107`. Verify against business owner and replace with the canonical rule statement.
```

---

## Confidence weighting in FROM-CODE direction

| Claim type | Default tier | Override conditions |
|------------|--------------|---------------------|
| Class name, method signature, field type | High | (none) |
| Table DDL, column types, constraints, indexes | High | (none) |
| Topic name, partition key, consumer group | High | (none) |
| REST path, method, status codes | High | (none) |
| `@Annotation`-driven config (e.g. `@Transactional`, `@CircuitBreaker`) | High | (none) |
| Pattern detection (interface + multi-impl + context) | Medium | Test exists exercising the pattern → upgrade to High |
| Pattern rationale (why-this-pattern-here narrative) | Medium | Comment / ADR / test name explicitly states the rationale → upgrade to High |
| Method-level pseudocode | Medium | Method ≤10 lines and is straight-line → upgrade to High |
| Cross-service saga step ordering | Medium | An orchestrator class with explicit step methods → upgrade to High |
| Idempotency point identification | High if `Idempotency-Key` is read; Medium if natural-key dedup is inferred | (varies) |
| Business rule narrative | Low | Test exists asserting the rule → upgrade to Medium; ADR or doc cites the rule → upgrade to High |
| SLO targets | Low | (none — rarely in code) |
| Threat notes | Low | Comments mention threat reasoning → upgrade to Medium |
| Entry point → use case (SDD given), same service + method + normalized path (or event / schedule) as §7.3 | High | (none) |
| Entry point matching §7.3 in everything but the service, or with its service unknown (SDD given) | Medium (`> Confirm:`) | (none) |
| Entry point with no §7.3 match, not a platform endpoint (SDD given) | Medium (`> Confirm:`) | (none; an open question, never a new UC) |
| Route → BRD screen (SDD given) | High via route `data.screen`; Medium (`> Confirm:`) by name only | (none) |

**Override rule:** if a claim is supported by a passing unit/integration test that exercises it, upgrade by one tier. Tests are stronger evidence than source code structure for *why* something is the way it is.

---

## Confidence weighting in FROM-SDD direction

| Claim type | Default tier | Override conditions |
|------------|--------------|---------------------|
| Section directly carried from SDD (verbatim or paraphrased) | High | (none) |
| Pattern application driven by CLAUDE.md hard rule (Outbox, Idempotency on money, RFC 9457) | High | (none — CLAUDE.md hard rules are unconditional) |
| Pattern application driven by CLAUDE.md guideline (Strategy, Factory, Mediator) | Medium | SDD prose explicitly names the pattern → upgrade to High |
| Concrete class names per CLAUDE.md naming conventions | Medium | (none — names are conventions, not facts) |
| Method-level pseudocode | Medium | SDD `13x` Business Logic is detailed enough to dictate the algorithm → upgrade to High |
| Concrete API request/response shapes | Medium | SDD pins shape (rare) → upgrade to High |
| Concrete event payload shapes | Medium | SDD pins shape (rare) → upgrade to High |
| Concrete table column types | Medium | SDD's per-service DB Modeling pins them (rare) → upgrade to High |
| SLO targets | High if SDD §18 pins per-endpoint targets; Medium if SDD only has service-level targets | |
| Hot-path index choices | Medium | (rare for SDD to pin indexes) |
| PII column inventory | Medium | SDD §17.X Data Encryption lists them (PII columns) → upgrade to High |
| Threat notes | Low | (almost never in SDD) |
| Peak scenario multipliers | Low | SDD §18.3 lists them → upgrade to High |
| Runbook procedures (concrete commands) | Low | (commands depend on real cluster names which the SDD rarely pins) |
| Use case IDs, titles, owners, entry points (read from SDD §7.3 and the BRD) | High | (none: cited, never inferred) |
| Test case IDs and their use cases (read from BRD chunk 16) | High | (none) |
| `MK-NN` rows (and any screen ID the BRD text carries) and their use cases (read from the BRD) | High | (none) |
| Route paths, and which screen each route implements | Medium | Existing code or an SDD frontend section pins them → upgrade to High |
| `use_case` attribute convention | Medium | SDD §11.4 or a `13x` Observability section names it → upgrade to High |
| Owner and entry points from an older SDD with no §7.3 (inferred from 09 and `13x`) | Medium | (none; suggest upgrading the SDD) |
| A use case with neither a screen ID nor an `MK-NN` in the BRD | Medium (`> Confirm:`) | BRD chunk 14 adds its `MK-NN` row → upgrade to High |

---

## Confidence weighting in HYBRID direction

In hybrid mode, every section has both a from-sdd and a from-code value. The unified emission's confidence is **the higher of the two contributing confidences**, with one exception:

- If the two values **disagree** (drift case), the emission's confidence is **High** for the *fact of drift* itself (we know they disagree because we can compare both), regardless of the contributing tiers. The drift note's *resolution suggestion* may be lower confidence — annotate accordingly.

Example:

> ⚠ drift
>
> Designed: Strategy pattern with 3 concrete classes per tier (per SDD §17.1 Business Logic).
>
> Built: if/else chain in `PricingServiceImpl.calculate()` (FooServiceImpl:42).
>
> > Drift note (HIGH confidence in fact-of-drift): the code does not implement the Strategy pattern as designed. The chain works for the current 3 tiers but new tiers require modifying this method.
> >
> > Resolution suggestion (Medium confidence): refactor to Strategy pattern as designed; one new class per tier; controller `Map<Tier, PricingStrategy>`. Effort: ~2 dev-days.

---

## Index-of-flags requirement

Every flag emitted anywhere in the LLD MUST appear as a row in `15-open-questions.md`:

- Drift markers → § 18.1 Drift Markers.
- `> TODO: <best-guess> — verify` → § 18.2 Low-Confidence Inferences.
- `> Confirm:` → § 18.3 Medium-Confidence Inferences.
- `⚠ policy` → § 18.6 Policy Findings.

When a chunk is regenerated, the index is regenerated too. The skill enforces this by walking each chunk and grepping for the flag patterns, then emitting the index file.

The summary table in § 18.5 (counts per section) is updated on each regeneration.

---

## Quick reference

| Situation | Emit |
|-----------|------|
| Code says X | X (no flag) |
| SDD says X | X (no flag) |
| CLAUDE.md hard rule applies | applied content (no flag, with attribution) |
| Pattern detected via structural heuristic | content + `> Confirm:` |
| Pattern proposed via CLAUDE.md guideline | content + `> Confirm:` (unless SDD names the pattern) |
| Best-guess from variable names / branches | content + `> TODO: <best-guess> — verify` |
| Best-guess for SLO / threat / peak scenario | content + `> TODO: <best-guess> — verify` |
| Section neither code nor SDD covers | section heading + `> TODO: not derivable from inputs — please specify` |
| Use case, test case, `MK-NN`, or screen ID the BRD / SDD states | cited with its key and link (no flag) |
| Upstream piece missing (BRD chunk 16 not written, no `MK-NN` row for a screen) | the gap text (`Pending (BRD 16 not written)` or `> Confirm:`) per `sdd-to-lld.md` § Use-case traceability › Upstream gaps; never a made-up ID |
