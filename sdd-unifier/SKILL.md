---
name: sdd-unifier
description: >-
  Generate, transform, or reformat a Solution Design Document (SDD) into the user's standard
  template. Use when asked to create, draft, write, or build an SDD, technical design, system
  design, HLD, or architecture design document; to convert an existing SDD or technical design into
  this template; or to derive an SDD from a BRD (including brd-unifier output). The SDD owns the
  technical HOW: architecture, services, a centralized event hub, user roles, cross-cutting
  concerns, and an end-to-end design. Arguments: [chunks|combined], default chunks. Output is
  Markdown only, with inline Mermaid diagrams.
---

# SDD Unifier

Author, transform, and unify Solution Design Documents (SDDs) into the user's standardised template. This skill encapsulates the full SDD section structure, the per-service spec block convention, the platform contract registries (event hub, user roles, e2e design), the chunking model, the BRD→SDD derivation rules, the interactive ecosystem selection flow, and the inline-Mermaid-first diagram policy.

The embedded templates in this skill folder are the authoritative source — `TEMPLATE-COMBINED.md` for the single-file layout and `chunks/*.md` for the chunked layout. Both were lifted verbatim from the user's working templates at `W:\ITV\STANDARDZzzz\`.

This skill is a sibling of `brd-unifier` — they work in concert when the workflow is SoW → BRD → SDD.

---

## Running outside Claude Code

This skill follows the Agent Skills format and also runs in Codex, Kimi Code, and other compatible agents. Where the text names a Claude Code tool or file, use the equivalent below. In Claude Code, follow the text as written.

| Written as | Outside Claude Code |
|---|---|
| `CLAUDE.md` defaults | The project instruction file (`AGENTS.md`, or `CLAUDE.md` if present). If neither states a default, use the defaults this skill states and flag the gap. |
| `Agent` tool with a `subagent_type` | Start a sub-agent with a fresh context if the runtime supports it. Otherwise run the step yourself as a separate pass: re-read the files from disk, set aside your drafting reasoning, and follow the same brief. For a named agent (for example `general-purpose` or a `plugin:agent` name), take on the role its brief describes. |
| `AskUserQuestion` (and `ToolSearch` to load it) | Ask in chat: numbered questions, each with options, tradeoffs, and your recommendation first. Wait for the answer before continuing. |
| Miro MCP | Use only if a Miro tool is available; otherwise follow this skill's rule for when Miro is unavailable. |
| Invoking this skill | Claude Code: `/<skill-name> <args>`. Codex: `$<skill-name> <args>`. Kimi Code: `/skill:<skill-name> <args>`. |

Paths in this file are relative to the skill folder.

---

## Argument parsing — do this first

The skill is invoked with an optional argument: `sdd-unifier [chunks|combined]`.

| Argument received | Meaning | Action |
|---|---|---|
| `chunks` (or empty / Enter / `y` / `yes` / `default`) | Produce multi-file chunked output | Proceed with CHUNKS mode (the default). |
| `combined` (or `c` / `single` / `one file` / `merged`) | Produce a single consolidated `.md` file | Proceed with COMBINED mode. |
| Anything else | Unrecognised | Re-prompt once with the same question; if still unclear, default to CHUNKS and note the fallback in the handoff summary. |

### Interactive mode prompt (when no arg passed)

**CHUNKS is the default.** Ask one question, accept Enter / empty / "y" as confirmation of the default. Do not ramble:

> **Output format?** [chunks / combined] — default `chunks` (press Enter to accept).
>
> - **`chunks`** (default) — multi-file layout; one `.md` per template section grouping. Matches the embedded `chunks/*.md` skeleton.
> - **`combined`** — single monolithic `.md` file matching `TEMPLATE-COMBINED.md`.

Interpretation rules:

- Empty reply / Enter / `""` / `y` / `yes` / `chunks` / `default` → **CHUNKS mode**.
- `combined` / `c` / `single` / `one file` / `merged` → **COMBINED mode**.
- Anything else → re-prompt once; if still unclear, default to CHUNKS and note the fallback.

If the user has already implied a mode in their request ("give me the full SDD as one file" → `combined`; "split it into chunks" → `chunks`), do NOT ask — proceed with the implied mode and confirm in one short line.

---

## Core principles

1. **Templates are authoritative.** `TEMPLATE-COMBINED.md` and the files under `chunks/` define the section order, naming, and structure. Section headings are never silently renamed.
2. **Markdown only.** No `.docx`, `.pdf`, `.html` unless the user explicitly asks.
3. **Mode is explicit.** Either from argument or interactive prompt. Never guess silently.
4. **Chunks are semantic, not size-based.** Never split by line count. The detailed-service chunk (`10a-service-*.md`) splits by service, not by length.
5. **Diagrams are inline Mermaid by default.** Architecture, context, workflow, sequence, ER, and state diagrams render inline in the chunks, each with a 1-2 sentence prose summary. Miro boards are produced only when the user explicitly asks — see `mermaid-diagrams.md`.
6. **Flag gaps explicitly.** Where source material doesn't cover something the template requires, insert `**[NEEDS CLARIFICATION: <specific question>]**`. Never paper over gaps with plausible-sounding invention.
7. **One SDD per SoW (default).** A single SDD covers a single SoW / single BRD by default. Multi-BRD rollup is out of scope for this skill version.
8. **Use platform defaults when source is silent — and confirm them via the ecosystem selection flow.** Architecture doctrine: microservices + **EDA** (event-driven backbone, outbox mandatory) + **DDD** (bounded contexts) + **hexagonal** (ports & adapters per service). Stack defaults from CLAUDE.md: Java 21 / Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Kafka (on-prem) or SNS+SQS (AWS), Keycloak, Angular 17+ standalone. The Ecosystem Overview falls back to these unless the BRD or SoW overrides them — and is always confirmed with the user per Step 3b.
9. **Generate, transform, or derive — detect, don't ask twice.** See `transform-detection.md`.
10. **One fact, one home (no duplication).** The SDD references the BRD, never restates it: business content is cited by link + ID (reference + delta — full rules in `brd-to-sdd.md` § One fact, one home). Within the SDD, the consolidation chunks (10 event hub, 11 roles, 16 e2e) are *views* that declare their source and reference — never mirror — each other; scalar facts (counts, versions, targets) are stated once and referenced everywhere else. Restated content is a review defect (OI Type: Duplication). Only an explicitly requested standalone export may inline referenced sections, marked as inlined.
11. **Producer/consumer contracts are reconciled, never assumed.** Chunk 10 (Centralized Event Hub) is the contract registry: topic names, event names, envelope fields, and payload contracts in every per-service chunk must match it character-for-character, and consumer lists are reconciled from both the producer and consumer sides. Divergences are flagged (chunk 10 §14.8), never silently reconciled. See `chunking.md` § Contract consistency. The key goal: a smooth implementation with zero cross-service contract drift.

---

## Workflow

### 1. Resolve mode

Per the Argument parsing section above. Default is CHUNKS.

### 2. Resolve intent

Three possible intents:

- **GENERATE** — fresh SDD from a SoW, conversation, or topic seed. The architect supplies all technical decisions (or accepts CLAUDE.md defaults).
- **TRANSFORM** — re-shape an existing SDD (vendor template, IEEE 1016 style, prior in-house format) into this template.
- **DERIVE-FROM-BRD** — generate an SDD skeleton from a BRD (chunked folder or combined file), auto-filling BRD-derivable sections and flagging SDD-only sections with `[NEEDS CLARIFICATION: ...]` markers.

See `transform-detection.md` for the decision rules.

### 3. Intake (short — not a clarification storm)

Ask at most **three** questions before starting:

- **Project / system name** — if not stated.
- **Source material** — fresh? Existing SDD to migrate? BRD to derive from?
- **Mode confirmation** — only if step 1 left ambiguity.

If an answer is in the conversation, do not re-ask.

### 3a. Project Type early ask + technical inputs (mandatory)

Two things happen before generation:

1. **Project Type.** If the source does not state whether this is **Greenfield** or **Brownfield**, ask this single question now via **AskUserQuestion** (load via ToolSearch if deferred):

   > "Greenfield (new product, no existing code) or Brownfield (extending an existing codebase)? If brownfield, where is the codebase?"

   **Brownfield** activates the brownfield flow: add §1 Existing System Context sub-section, mark cross-cutting concerns as inherit/override/new, flag per-service specs as extending existing services. Record the answer + a one-line justification in §1 — `lld-unifier` reads it from there when it synthesises its Specs chunk.

2. **Technical inputs from the BRD (when DERIVE-FROM-BRD).** Read the BRD's Appendix § "Technical Inputs for the SDD" — source technical mandates parked verbatim by `brd-unifier`. These are the highest-fidelity technical signal: they seed §6 Ecosystem Overview and override CLAUDE.md defaults where they conflict. Also read the BRD's Users & Use Cases Matrix and UC chunks — they drive §7 Actors/Use Cases, the §16 Centralized User Roles catalogue, and per-service authorization notes.

**Legacy BRDs:** if the source BRD contains a `Specs` section or a `Technical Implementation Expectations` section (pre-restructure template), consume them the same way — Tech Stack rows verbatim into §6, Roadmap as phasing input, Project Type as the intake answer (skip the intake question). Note "legacy BRD sections consumed" in the handoff summary.

### 3b. Ecosystem selection (mandatory, interactive — before any chunk is written)

The §6 Ecosystem Overview is never filled silently. Run this flow via **AskUserQuestion**:

1. **Assemble the proposed ecosystem.** Precedence per row: BRD Technical Inputs (verbatim, marked `BRD-mandated`) > user CLAUDE.md defaults > skill recommendation informed by the BRD (NFRs, integrations, scale signals). The architecture doctrine row defaults to **EDA + DDD + hexagonal** (principle 8).
2. **Present the full proposed table compactly** (layer → choice → source: BRD-mandated / default / recommended), then ask ONE question:

   > **Ecosystem: accept all proposed defaults?**
   > - **Accept all (Recommended)** — proceed with the table as shown.
   > - **Walk through item by item** — review each layer with recommendations.

3. **If accepted:** fill §6, marking each row's source in Notes. Done.
4. **If declined (walkthrough):** batch the remaining items through AskUserQuestion (up to 4 questions per call), grouped by concern: (a) architecture doctrine; (b) compute & runtime; (c) data — RDBMS, cache, object storage; (d) messaging & streaming; (e) identity & security — IAM, secrets; (f) edge — gateway, mesh/ingress; (g) delivery & observability — CI/CD, logs/metrics/traces; (h) application stacks — backend, frontend, BI. For every item, list the recommended option FIRST labelled "(Recommended)" with a one-line justification citing the BRD evidence that drives it (e.g., "BRD 10-nfrs NFR-03 seasonal peaks → managed streaming tier"). Offer 2-3 alternatives with one-line tradeoffs.
5. **BRD-mandated rows are not re-asked.** Show them as locked with source attribution. If the user overrides one anyway, record the deviation as an ADR in §10 and note it in the handoff summary.
6. **Every decision lands in §6** with its source in the Notes column; deviations from CLAUDE.md defaults or from the doctrine get an ADR row.

### 4. Plan internally

Enumerate which sections (combined) or chunks (chunked) will exist, which Mermaid diagrams each will carry, and which sections need `[NEEDS CLARIFICATION: ...]` markers. The canonical chunk list is in `chunking.md`.

### 5. Diagram policy (inline Mermaid; Miro on demand)

All diagrams are authored as **inline Mermaid** in the chunks, each followed by a 1-2 sentence prose **Summary** so the content reads without a renderer. Validate every emitted Mermaid block parses; on failure, fall back to a text description + `[NEEDS CLARIFICATION: Mermaid syntax error — review]`. See `mermaid-diagrams.md` for the diagram-type → dialect map and conventions.

SDDs typically need: System Context, High-Level Architecture, Workflow per critical flow, Sequence per critical interaction, event-hub topology + async backbone (chunk 10), role taxonomy + authorization sequence (chunk 11), the e2e fan-out maps and sagas (chunk 16), plus per-service ERDs, flows, and sequences.

**Miro only on explicit request:** if the user asks for a Miro board, create it via the Miro MCP per `mermaid-diagrams.md` § Miro on demand and append `> Miro: <url>` links below the corresponding Mermaid blocks — the inline Mermaid stays authoritative.

### 6. Generate / transform / derive output

**CHUNKS mode (default):**

- Use `chunks/*.md` as the section skeleton.
- Write output to `./sdd-[project-slug]/`.
- Each chunk starts with the self-describing comment block (see `chunking.md`).
- For section 15 (Detailed Service Specs), produce one chunk per service: `10a-service-[slug].md`, `10b-service-[slug].md`, ...
- **Generation order for the contract chunks:** draft the per-service Event Models (10a, 10b, …) → consolidate into chunk 10 (event hub) → back-propagate fixes → author chunk 16 (e2e system design) LAST from the reconciled state.

**COMBINED mode:**

- Use `TEMPLATE-COMBINED.md` as the structure.
- Write output to `./SDD-[ProjectName]-v[X.X].md`.

**TRANSFORM intent:**

- Read the source SDD fully.
- Map content to template sections per `source-transformation.md`.
- Preserve verbatim numbers, dates, named technologies, version pins.
- Flag every gap with `**[NEEDS CLARIFICATION: ...]**`.

**DERIVE-FROM-BRD intent:**

- Read the BRD fully (chunked folder OR combined file — see `brd-to-sdd.md` § Detecting BRD input form).
- Map BRD content to SDD sections per the table in `brd-to-sdd.md`.
- For SDD-only sections (Architecture Style, ADRs, Cross-cutting overrides, Runbook procedures), produce the heading + structure with `[NEEDS CLARIFICATION: ...]` markers naming the specific decisions the architect must make.
- For Ecosystem Overview, apply the BRD's Appendix § "Technical Inputs for the SDD" (parked source mandates) first, then fall back to user's CLAUDE.md defaults. (Legacy BRDs: a "Technical Implementation Expectations" section plays the same role.)
- The output is intentionally an architect-ready skeleton, not a finished SDD.

### 6a. Contract consistency reconciliation (mandatory, AFTER the per-service chunks)

Before authoring chunk 16 and running the reviewer, reconcile the contract surface (see `chunking.md` § Contract consistency):

1. **Topic + event names:** every topic and event name in every `10x` Event Model matches chunk 10 §14.4/§14.5 character-for-character.
2. **Producer/consumer symmetry:** every event consumed somewhere is published by exactly one service; every producer's consumer list matches the union of the consumers' consumed tables.
3. **Payload fields:** every field a consumer's Effect column relies on exists in the §14.9 payload contract.
4. **Roles:** role names and permission tokens in per-service authorization notes match chunk 11 verbatim.
5. **Fix what you can; flag the rest** in chunk 10 §14.8 / chunk 11 §16.12 — never silently reconcile.

Then author **chunk 16 (End-to-End System Design)** from the reconciled state — it is a faithful consolidation, not new design; its counts and edges must trace to chunks 09/10/10x/11.

> **Specs note:** the constitution-grade `Specs` (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and synthesised at LLD time from this SDD's body. This skill does NOT author a Specs chunk.

### 7. Post-generation review (mandatory, cleared-context)

After the body of the SDD is written but **before** presenting to the user, run an adversarial review pass that produces the `Open Items & Clarifications` chunk (`17-open-items-and-clarifications.md` / `# 23. Open Items & Clarifications` section in combined mode).

**Why cleared context.** The same context that authored the SDD anchors on its own architectural choices. The reviewer's job is to find what is missing or risky, not to confirm what was decided.

**How to run it.**

1. Use the `Agent` tool with `subagent_type: comprehensive-review:full-review` (preferred for SDDs given the multi-dimensional review surface) or `general-purpose`. The subagent starts with no conversation memory.
2. Pass the subagent:
   - Absolute paths to all generated SDD chunks (or the combined file).
   - The path to the source BRD (chunks folder or combined file) so the reviewer can cross-check against requirements.
   - The path to this skill's templates.
   - The brief: identify architecture-level gaps, missing scenarios, ADR ambiguities, NFR shortfalls, integration corner cases, multi-tenancy implications, inconsistencies, AND cross-chunk contract mismatches (topic/event names or payload fields diverging between chunk 10 and any 10x chunk; consumer lists that don't reconcile; roles/permission tokens diverging between chunk 11 and per-service authorization notes; counts or edges in chunk 16 that don't trace to 09/10/10x/11). For each finding, propose 2-3 concrete options with one-line tradeoffs AND a **Recommended Answer** (the concrete resolution text, written so it can be pasted into the SDD as-is — the exact row, ADR, sub-section, or wording) AND a **Why** (REQUIRED: the reason that option wins — the evidence behind it, e.g., BRD requirement, NFR, doctrine default, risk avoided, and the tradeoff accepted; never empty). Output goes into the chunk/section using the schema in `chunks/17-open-items-and-clarifications.md`.
   - Constraint: the reviewer captures **external** findings only — gaps the body did not flag inline. Inline `[NEEDS CLARIFICATION: ...]` markers stay where they are.
3. The subagent writes directly to `17-open-items-and-clarifications.md` (chunks mode) or appends to the `# 23. Open Items & Clarifications` section (combined mode).
4. Verify coverage: at minimum one OI per major risk surface (architecture style, ADRs, cross-cutting concerns, per-service contracts, event contract consistency, NFRs, integrations, security, observability). Every OI must have a non-empty Recommended Answer AND a non-empty Why. Zero OIs typically means a confirmatory review — re-dispatch with stronger adversarial framing.

**Reviewer prompt skeleton (adapt per project):**

> You are an independent adversarial reviewer for a Solution Design Document. You have no memory of how this document was authored. Your job is to find what is missing, ambiguous, or risky in the architecture — not to confirm what is present.
>
> Read these files: [SDD paths]. Cross-reference against the source BRD: [BRD paths]. Use [TEMPLATE-COMBINED.md path] as the structural reference.
>
> For each architecture-level gap, missing scenario, corner case, ambiguity, risk, NFR shortfall, inconsistency, or contract mismatch, write an OI entry following the schema in [chunks/17-open-items-and-clarifications.md path]. Each entry must include: Where (§N or service), Type, Concern (one paragraph), Options (at least 2 with tradeoffs), **Recommended Answer (the concrete resolution text, ready to paste into the SDD)**, **Why (the reason that option wins over the alternatives — evidence + tradeoff accepted; never empty)**, Status: Open.
>
> Cover at minimum: architecture style fit (EDA/DDD/hexagonal doctrine adherence), ADR completeness, cross-cutting concerns coverage, per-service contract completeness, **event contract consistency (every topic name, event name, and payload field in each per-service Event Model must match §14 the Centralized Event Hub verbatim; every consumed event must have exactly one producer; consumer lists must reconcile from both sides)**, **role catalogue consistency (per-service authorization notes vs §16)**, **e2e traceability (§22 counts and edges trace to §13/§14/§15/§16)**, NFR realisability (the BRD states NFRs in business language — check the SDD quantified them technically), integration error paths and timeouts, multi-tenancy edge cases, observability gaps, security/compliance hooks (cross-check per-service authorization against the BRD's Users & Use Cases Matrix), deployment failure modes, runbook completeness, BRD-to-SDD traceability gaps (every BRD UC lands in a service), and duplication (BRD content restated instead of referenced with a delta; chunk-16 mirrors of chunk 10/11 content; the same scalar fact stated in two places — one fact, one home).
>
> Do not echo what the document says. Do not confirm. Find what is missing. Write directly to [output path].

### 8. Open Items review & acceptance loop (mandatory)

The Open Items are not left for the user to discover — walk them through each item and get a decision:

1. Present the OI list compactly (ID, title, one-line concern, the Recommended Answer and its Why).
2. Ask the user to decide per item, batched via **AskUserQuestion** (up to 4 items per call); the recommended option's description carries its Why so the user decides with the reason in view. Options per item: **Accept recommendation** (recommended, listed first) / **Choose option [B/C]** / **Defer** / user types their own answer via "Other".
3. For every **accepted** (or user-adjusted) item: apply the Recommended Answer (or adjusted text) to the referenced chunk(s)/section(s); set the OI's Status to `Accepted - applied` (or `Adjusted - applied`); add a Resolution Log row; bump the Changes Log in chunk 00 once for the batch. If the change touches event contracts, roles, or services, re-verify chunks 10/11/16 still reconcile with the affected `10x` chunks.
4. **Deferred / Rejected** items keep their entry with the new status and rationale; they are not applied.
5. If the user says "later" / "I'll review offline", leave all items `Open` and note in the handoff that the acceptance loop is pending — do not apply anything without an explicit decision.

### 9. Present

After the body, the Open Items chunk, and the acceptance loop, surface to the user:

- Project name, version, mode (chunks / combined), file paths.
- Number of chunks (if chunks mode) or section count (if combined).
- Count of inline Mermaid diagrams generated (and the Miro board URL, only if one was requested).
- Ecosystem selection outcome: accepted-all or walked-through, with the list of user overrides and BRD-mandated rows.
- Contract consistency status: reconciled ✓, plus any flags left in chunk 10 §14.8 / chunk 11 §16.12.
- Count of inline `[NEEDS CLARIFICATION: ...]` markers — explicit body-level gap inventory, with a list of the SDD-only sections that need the architect's input.
- Open Items summary: total, accepted & applied, adjusted, deferred, rejected, still open.
- Chain handoff check: every `../brd-[slug]/...` reference resolves against the actual BRD folder; BRD content is referenced + delta, never restated; chunk names match the canonical map so `lld-unifier` can consume them.
- Reminder line: "Specs (Mission / Tech Stack / Roadmap / Project Type) is synthesised by lld-unifier from this SDD."
- One-line offer: "Want me to switch modes?" / "Want me to merge?" / "Want me to fill in section X now that you have decisions?"

### 10. Cross-mode conversion (on explicit request)

| User says | Action |
|---|---|
| "merge", "consolidate", "single file", "full doc" (after chunks exist) | Concatenate per `chunking.md` § Merge handling. Write to `./sdd-[project-slug]/SDD-[ProjectName]-v[X.X]-MERGED.md` (alongside the chunks). Keep originals. |
| "split into chunks", "re-chunk this" (when a combined file exists) | Slice by template section per `chunks/*.md` skeleton. Keep the original combined file. |
| "regenerate chunk N", "update section X", "fill in section Y now that I have decisions" | Targeted regeneration of one chunk or section, leaving the rest untouched. Bump the Changes Log. |

---

## Reference files (read these when the situation calls for them)

- `TEMPLATE-COMBINED.md` — the single-file template. Read at the start of any COMBINED-mode generation.
- `chunks/*.md` — the per-chunk template skeletons. Read at the start of any CHUNKS-mode generation.
- `chunking.md` — canonical chunk map, naming convention, merge rules.
- `modes.md` — chunks vs combined behavioural details.
- `transform-detection.md` — rules for deciding generate / transform / derive-from-BRD.
- `source-transformation.md` — how to map SoW or existing-SDD content into this template.
- `brd-to-sdd.md` — explicit BRD→SDD field mapping (read this when the source is a BRD; covers the business-language BRD shape: UC chunks, Users & Use Cases Matrix, parked technical inputs, legacy Specs handling).
- `sdd-quality.md` — what makes a substantive section vs a thin one (analogous to fr-quality.md in brd-unifier).
- `mermaid-diagrams.md` — inline Mermaid conventions per diagram type, plus the Miro-on-demand flow.

---

## Output conventions

- **Project slug**: kebab-case, lowercased, derived from project name.
- **Chunked output folder**: `./sdd-[project-slug]/`.
- **Chunked filenames**: `NN-short-title.md` (two-digit prefix, optional letter for service splits like `10a`, `10b`). See `chunking.md`.
- **Combined output filename**: `SDD-[ProjectName]-v[X.X].md` (PascalCase project name).
- **Merged-from-chunks filename**: `SDD-[ProjectName]-v[X.X]-MERGED.md`, written inside `./sdd-[project-slug]/` alongside the chunks.
- **Encoding**: UTF-8, LF line endings.
- **Tables**: pipe-table format, no hard line wrap.

---

## Things this skill never does

- Never emits `.docx`, `.pdf`, `.xlsx`, or any non-Markdown output unless the user explicitly asks.
- Never creates a Miro board unless the user explicitly asks. Inline Mermaid is the authoritative diagram medium; Miro links are additive.
- Never fills the §6 Ecosystem Overview silently — the ecosystem selection flow (Step 3b) always runs.
- Never authors a `Specs` chunk — Specs (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and synthesised from this SDD.
- Never lets per-service event tables drift from chunk 10. A topic/event/payload divergence is fixed or flagged (chunk 10 §14.8), never left silently inconsistent.
- Never invents performance targets, version pins, technology choices, or capacity numbers to fill a table. Missing target → `[NEEDS CLARIFICATION: ...]`.
- Never produces a "here's a summary, let me know if you want the full version" preview. Generate the actual deliverable.
- Never silently drops template sections. Empty sections keep their heading and write `Not applicable for this release.` (with a clarification flag if surprising).
- Never modifies the embedded templates (`TEMPLATE-COMBINED.md` or `chunks/*.md`) during a generation run — they are read-only references.
- Never writes a per-service detailed spec from the BRD alone. The BRD doesn't have enough technical specificity; per-service detailed specs (DB Modeling, API list, Event Model) need architect input or are flagged.
