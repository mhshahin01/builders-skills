<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: all preceding LLD chunks
PART OF: LLD - [Project Name]
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures implementation-level gaps, missing edge cases, untested error paths, and pattern application questions flagged by an independent reviewer. Complements (does not replace) chunk 15 (Open Questions / confidence-flag index), which is author-generated.
GENERATED_BY: lld-unifier post-generation reviewer (cleared-context subagent run after the main LLD generation completes).
RELATIONSHIP_TO_15: chunk 15 indexes the author's own `> Confirm:` and `> TODO:` flags emitted during generation. Chunk 18 captures the *external* reviewer's adversarial findings - gaps the author did not flag inline.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of implementation-level concerns identified after the main LLD was authored, by a reviewer running with cleared context. Items are not blockers in themselves - they are decisions the implementer or technical lead needs to make before code can be written confidently.
>
> **What this section is not.** It is not a list of inline `> Confirm:` or `> TODO:` flags found in the body - those are indexed in chunk 15 (Open Questions). This section is the reviewer's *external* findings: edge cases the body did not consider, pattern applications that look wrong, error paths that were assumed away.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Service name + sub-section (e.g., `wallet-core / Method Pseudocode`), or "global" if cross-cutting. |
| **Type** | Implementation gap / Missing edge case / Pattern misapplication / Error path / Concurrency hazard / Transaction boundary / Idempotency gap / Multi-tenancy leak / Test gap / Drift (hybrid-mode only) / Contract drift (vs SDD §14/§15/§16) / Specs-body mismatch / Duplication (SDD content restated instead of referenced) / Traceability gap (a use case, route, test case, spec, or entry point the trace misses, a link that does not resolve, or a BRD ID without its key) / Missing scenario (behaviour the design needs that no BRD use case covers; never a new UC). |
| **Concern** | One paragraph. What was missed and why it matters for code correctness or production reliability. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommendation** | REQUIRED. The reviewer's suggested option - always pick one, even for close calls (state that it is a close call in the Why). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins - the evidence behind it (CLAUDE.md rule, SDD contract, code fact, correctness/production risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Resolved (link to LLD update) / Deferred (with rationale). |

---

## Open Items

### OI-01: [Short title]

- **Where:** [Service / sub-section, or "global"]
- **Type:** [Implementation gap | Missing edge case | Pattern misapplication | Error path | Concurrency hazard | Transaction boundary | Idempotency gap | Multi-tenancy leak | Test gap | Drift | Contract drift | Specs-body mismatch | Duplication | Traceability gap | Missing scenario]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
  - **C.** [Option C] - [one-line tradeoff]. *(Optional.)*
- **Recommendation:** [Suggested option letter + the concrete change.]
- **Why:** [The reason this option wins, e.g., "Option A matches the CLAUDE.md idempotency rule for money writes and survives consumer redelivery; B is simpler but silently double-credits on retry."]
- **Status:** Open

---

### OI-02: [Short title]

- **Where:** [...]
- **Type:** [...]
- **Concern:** [...]
- **Options:**
  - **A.** [...] - [...].
  - **B.** [...] - [...].
- **Recommendation:** [...]
- **Why:** [...]
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Resolution Log

<!-- When an open item is resolved, move its summary here with a pointer to the LLD update (chunk + service + sub-section). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk / service / sub-section] | [Option chosen - short note] |

---

## Reviewer Notes

<!-- The coverage table is required (SKILL.md step 7): one row per risk surface per service, plus the three `global` rows. Zero findings is valid for a surface that was checked. Free-form notes that did not become a numbered open item follow it. -->

| Service | Risk surface | Checked | Findings | What was checked |
|---------|--------------|---------|----------|------------------|
| [service-a] | [Error envelope (RFC 9457) / Transactions / Idempotency / Multi-tenancy / Outbox / Saga compensation / Retry and backoff / Observability / Test coverage / Schema versioning / Duplication] | [Yes / No] | [OI-NN, … or "No issue found"] | [What the reviewer read and verified] |
| global | [Contract drift (SDD §14/§15/§16) / Specs-body / Use-case traceability] | [Yes / No] | [OI-NN, … or "No issue found"] | [What the reviewer read and verified] |

- [Note 1]
- [Note 2]

<!-- MASTER: [project-slug]-lld-master.md | PREV: 17-specs.md | NEXT: none -->
