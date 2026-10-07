<!--
CHUNK: 15
TITLE: Open Questions, Drift Index, Confidence Flags
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 18. Open Questions & Flag Index

> **How to use this chunk:** this is the single review surface. Every `> Confirm:`, `> TODO:`, `⚠ drift`, `🆕 code-only`, `⛔ sdd-only`, and `⚠ policy` marker placed anywhere in the LLD has a row here pointing to its location. Reviewers should:
>
> 1. Open this file first.
> 2. Walk the tables in order: Drift and Policy Findings first (action items), then TODO (low-confidence), then Confirm (medium-confidence).
> 3. Edit the source chunk to resolve each row.
> 4. Ask lld-unifier to regenerate the changed chunks (SKILL.md step 9); this index is regenerated with them.

---

## 18.1 Drift Markers (hybrid mode only)

<!-- Every row carries the author's recommended reconciliation AND the reason behind it - never a bare "Pending". -->

| Location | Marker | Summary | Severity | Recommended resolution | Why | Status |
|----------|--------|---------|----------|------------------------|-----|--------|
| `[chunk:section]` | `⚠ drift` | [SDD says X, code does Y] | [High / Medium / Low] | [Reconcile in code / Reconcile in SDD] | [Reason, e.g., "code behaviour is live and consumers depend on it - update the SDD"] | [Pending / Done] |
| `[chunk:section]` | `🆕 code-only` | [Feature in code not in SDD] | [Severity] | [Backfill SDD / Remove from code] | [Reason] | [Pending / Done] |
| `[chunk:section]` | `⛔ sdd-only` | [In SDD, not yet built] | [Severity] | [Implement / Defer] | [Reason] | [Pending / Done] |

> **Severity guide:**
> - **High:** affects security, data integrity, or contract surface.
> - **Medium:** affects observability, performance, or cross-team integration.
> - **Low:** naming, documentation, or non-load-bearing detail.

## 18.2 Low-Confidence Inferences (TODO)

| Location | Best-guess content | Source / Reason | Status |
|----------|--------------------|----|--------|
| `[chunk:section]` | [Summary of best guess] | [from-code: heuristic / from-sdd: not specified] | [Open / Verified / Replaced] |

## 18.3 Medium-Confidence Inferences (Confirm)

| Location | Inferred content | Source / Reason | Status |
|----------|------------------|----|--------|
| `[chunk:section]` | [Summary of inference] | [from-code: pattern detection / from-sdd: CLAUDE.md default applied] | [Open / Confirmed / Edited] |

## 18.4 Decisions Pending

<!-- Every open decision carries the author's recommended option AND the reason behind it - the stakeholder decides with a default in hand, never from a blank slate. -->

| ID | Decision needed | Recommended option | Why | Stakeholder | Blocking? | Target date |
|----|-----------------|--------------------|-----|-------------|-----------|-------------|
| OQ-01 | [Decision] | [The suggested choice] | [Reason it wins: evidence + tradeoff accepted] | [Role / Person] | [Yes / No] | [YYYY-MM-DD] |

## 18.5 Inference Confidence Summary

| Section | Medium: open `> Confirm:` flags | Low: open `> TODO:` flags |
|---------|---------------------------------|---------------------------|
| 1. Purpose | [N] | [N] |
| 2. Scope | [N] | [N] |
| 3. Assumptions | [N] | [N] |
| 4. Glossary | [N] | [N] |
| 5. Context | [N] | [N] |
| 6. Architecture Overview | [N] | [N] |
| 7.N [Service Name] (one row per service) | [N] | [N] |
| 8. Data Model | [N] | [N] |
| 9. API Contracts | [N] | [N] |
| 10. Event Contracts | [N] | [N] |
| 11. State & Rules | [N] | [N] |
| 12. Cross-Cutting | [N] | [N] |
| 13. Operations | [N] | [N] |
| 14. Security | [N] | [N] |
| 15. Performance | [N] | [N] |
| 16. Testing | [N] | [N] |
| 17. Frontend | [N] | [N] |
| 20. Specs | [N] | [N] |
| Global (flags this chunk holds itself, outside its tables) | [N] | [N] |

> **Convention:** each cell counts the open flags of its kind in that section, as a search for `> Confirm:` and `> TODO:` finds them; nothing is judged, and a section with none reads 0. These counts are updated whenever a chunk is regenerated.

## 18.6 Policy Findings (every mode that reads code)

<!-- Code that breaks a CLAUDE.md rule or a pattern-rules.md anti-pattern (from-code, hybrid, partial). Not drift: it claims no SDD disagreement. Every row cites the rule, takes the severity from pattern-rules.md, and carries the author's recommended fix and the reason. -->

| Location | Marker | Rule (source) | Finding | Severity | Recommended fix | Why | Status |
|----------|--------|---------------|---------|----------|-----------------|-----|--------|
| `[chunk:section]` | `⚠ policy` | [CLAUDE.md: "No dual-writes to DB and Kafka"] | [What the code does, with file:line] | [High / Medium / Low] | [Fix in code] | [Reason] | [Pending / Done] |

<!-- MASTER: [project-slug]-lld-master.md | PREV: 14-frontend.md (or 13-testing.md if no UI) | NEXT: 16-references.md -->
