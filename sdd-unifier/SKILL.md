---
name: sdd-unifier
description: >-
  Generate, transform, or reformat a Solution Design Document (SDD) into the user's standard
  template. Use when asked to create, draft, write, or build an SDD, technical design, system
  design, HLD, or architecture design document; to convert an existing SDD or technical design into
  this template; or to derive an SDD from one or more BRDs (including brd-unifier output). The SDD owns the
  technical HOW: architecture, services, a centralized event hub, user roles, cross-cutting
  concerns, service API contracts, and an end-to-end design. Arguments: [chunks|combined] [parts|whole], default chunks
  in three reviewed parts. Output is Markdown only, with inline Mermaid diagrams.
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

The skill is invoked with two optional arguments, in any order: `sdd-unifier [chunks|combined] [parts|whole]`. Match each argument by its value: `chunks` / `combined` set the **output mode**; `parts` / `whole` set the **generation option**. Either one can be left out.

| Argument received | Meaning | Action |
|---|---|---|
| `chunks` | Produce multi-file chunked output | Skip the mode prompt; proceed with CHUNKS mode. |
| `combined` | Produce a single consolidated `.md` file | Skip the mode prompt; proceed with COMBINED mode. |
| No mode passed | User has not chosen a mode | Run the resume check first (step 1): if the folder already holds an SDD in progress, continue with it in its own mode without asking. Otherwise run the **interactive mode prompt** below. |
| Anything else (not `chunks`, `combined`, `parts`, or `whole`) | Unrecognised | Tell the user the valid options and ask them to re-invoke, or treat as empty and prompt. If still unclear, default to CHUNKS and note the fallback in the handoff summary. |

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

### Generation option: `parts` (default) or `whole`

| Argument received | Meaning | Action |
|---|---|---|
| `parts`, or nothing | Write the SDD in three parts and stop for the user's review after parts 1 and 2 | **Default in CHUNKS mode.** Part 1 = chunks 00-09, part 2 = `13x`, 10, 11 (API contracts), and 12 with the contract reconciliation, part 3 = 14-18, then 19 behind the e2e gate. See `parts-mode.md`. |
| `whole` | Write chunks 00-18 in one run (one-shot); chunk 19 follows in the same run only if the e2e gate is open after the acceptance loop | Use when asked for, always in COMBINED mode, and always for pure conversions (merge, re-chunk) and targeted updates. |

- Never ask which one. In CHUNKS mode, with nothing said, use `parts` and say so in one line before starting: "Generation: parts (default). Say 'whole' to get everything in one go."
- Words count as the argument: "all at once", "in one go", "one shot" mean `whole`; "part by part", "step by step" mean `parts`.
- `combined parts` is not available. Say so in one line and continue in `whole`.

---

## Core principles

1. **Templates are authoritative.** `TEMPLATE-COMBINED.md` and the files under `chunks/` define the section order, naming, and structure. Section headings are never silently renamed.
2. **Markdown only.** No `.docx`, `.pdf`, `.html` unless the user explicitly asks.
3. **Mode is explicit.** Either from argument or interactive prompt. Never guess silently.
4. **Chunks are semantic, not size-based.** Never split by line count. The detailed-service chunk (`13a-service-*.md`) splits by service, not by length.
5. **Diagrams are inline Mermaid by default.** Architecture, context, workflow, sequence, ER, and state diagrams render inline in the chunks, each with a 1-2 sentence prose summary. Miro boards are produced only when the user explicitly asks — see `mermaid-diagrams.md`.
6. **Flag gaps explicitly.** Where source material doesn't cover something the template requires, insert `**[NEEDS CLARIFICATION: <specific question>]**`. Never paper over gaps with plausible-sounding invention.
7. **One SDD, one or more parent BRDs, and zero or more child LLDs.** An SDD derives from one or more BRDs (for example, the products of one platform, or a phase-2 BRD added later) and may be the source of several LLDs. Chunk 00 § Document Lineage lists both: every source BRD with its key, version, and link, and every child LLD with its scope. Each BRD gets a short capital key (`REFUNDS`, `WALLET`), and every BRD reference in the SDD carries it, even with one BRD. With two or more BRDs, the BRDs are checked against each other before the design starts, and conflicts are never resolved silently. Child LLD rows are written by `lld-unifier` and checked on every run of this skill. Rules: `brd-to-sdd.md` § Source BRDs and lineage.
8. **The architecture style is chosen, not assumed; stack defaults are confirmed.** When deriving from a BRD, a short architecture questionnaire (step 3b, `architecture-questionnaire.md`) settles the style (modular monolith, hybrid, or microservices), the communication model, data ownership, tenancy, and deployment target, each with a recommendation drawn from the BRD's drivers (stage, teams, load). Microservices is recommended only when a driver needs it; for an MVP, POC, or small stable scope a modular monolith is usually the better fit. DDD boundaries and hexagonal structure apply in every style. Stack defaults from CLAUDE.md (Java 21 / Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Kafka on-prem or SNS+SQS on AWS, Keycloak, Angular 17+ standalone) then seed the ecosystem proposal, adapted to the chosen style, and are always confirmed with the user in step 3c.
9. **Generate, transform, or derive — detect, don't ask twice.** See `transform-detection.md`.
10. **One fact, one home (no duplication).** The SDD references the BRD, never restates it: business content is cited by link + ID (reference + delta — full rules in `brd-to-sdd.md` § One fact, one home). Within the SDD, the consolidation chunks (10 event hub, 11 API contracts, 12 roles, 19 e2e) are *views* that declare their source and reference — never mirror — each other; scalar facts (counts, versions, targets) are stated once and referenced everywhere else. Restated content is a review defect (OI Type: Duplication). Only an explicitly requested standalone export may inline referenced sections, marked as inlined.
11. **Producer/consumer contracts are reconciled, never assumed.** Chunk 10 (Centralized Event Hub) is the contract registry: topic names, event names, envelope fields, and payload contracts in every per-service chunk must match it character-for-character, and consumer lists are reconciled from both the producer and consumer sides. Chunk 11 (Service Integration API Contracts) does the same for synchronous APIs: the method and URI in every per-service List of APIs match it verbatim, and headers, body, and error codes live only there. Divergences are flagged (chunk 10 §14.8, chunk 11 §15.5), never silently reconciled. See `chunking.md` § Contract consistency. The key goal: a smooth implementation with zero cross-service contract drift.
12. **Decision history lives in the register, not in the body.** Content chunks state the settled design in plain present tense ("Wallet events are published through the transactional outbox"), never the decision narrative ("The user selected option B on...", "OI-04 remains partial", "walked through the ecosystem"). The decision story (the ecosystem walkthrough answers, the clarification Q&A, which option was chosen, who decided, when, what was delegated, what was superseded, part-handoff instructions) goes into `decision-log.md`, the companion register in `./sdd-[project-slug]/` (structure: the `decision-log.md` reference in this skill folder). ADRs in chunk 06 stay design content (decision, context, rationale, consequences); the register links them and never restates them. Compact references to stable IDs (OI-NN, ADR-NN, UC-NN, AP-NN) inside design text and table cells are allowed; storytelling is not.
13. **Parts by default, with a real stop; one-shot on request.** In CHUNKS mode the SDD is written in three parts (00-09, then `13x`, 10, 11, and 12, then 14-18, with 19 behind the e2e gate). After parts 1 and 2 the skill shows a short summary, says what to review, and **stops until the user says to continue**. The architecture, ADRs, and service decomposition are agreed before any per-service spec is written; the event, role, and API contracts are agreed before the review. `whole` writes everything in one run. Rules: `parts-mode.md`.
14. **IDs are stable once seen.** Service chunk letters, BRD keys, ADR-NN, AP-NN, API-NN, topic names, event names, role names, permission tokens, and OI-NN are never renumbered or reused after the user has seen them; `lld-unifier` and implementers reference them. Merged or removed services keep their 09 row with a status (`parts-mode.md` step 4).
15. **The end-to-end design comes last, behind a gate.** Chunk 19 (End-to-End System Design) consolidates a reviewed, settled system, so it cannot be generated or refreshed until chunk 18 is cleared: every open item `Accepted - applied`, `Adjusted - applied`, or `Rejected`. `Deferred` counts as open. There is no override. Gate conditions E1-E4: step 8b.
16. **Every synchronous integration has a full API contract; external ones are TBD, never invented.** Chunk 11 holds one contract per integration API (`API-NN`): URI, version, headers, parameters, body, responses, error codes, security, and auth, with the platform conventions (Problem Details errors, correlation and tenant headers, idempotency keys, URI versioning) stated once in §15.1. When the other side is an external system, the provider-owned fields are `TBD` with a `**[TBD - EXTERNAL: ...]**` marker and the contract status is `TBD - external` until the user supplies the provider's documentation; our-side policy (timeouts, retries, circuit breaker, fallback, credential storage) is filled from §12.
17. **Every BRD use case is traced by link (derive-from-BRD from brd-unifier output).** Each use case the SDD cites carries its BRD key and links to its heading in that BRD (`[REFUNDS/UC-04](...#uc-04-...)`, file + anchor). Chunk 09 names the one service that owns each use case, and §7.3 Use Case Traceability (chunk 03) shows, one row per use case of every source BRD, grouped by BRD, its owner, entry points, flows, API contracts, and events, read from their home chunks and reconciled in step 6a. UC IDs belong to their BRD: cited exactly, never renumbered, never created by the SDD. Rules: `brd-to-sdd.md` § Use-case traceability.

---

## Workflow

### 1. Resolve mode and generation option

Per the Argument parsing section above. Default is CHUNKS, in `parts`.

**Resume check.** If the target folder already holds an `[project-slug]-sdd-master.md` whose Generation Progress shows a part that is `Pending` or `In progress`, this is a resume. Do not start over, and do not rerun intake or the ecosystem selection. Say which part is next, then act on what the user asked (`parts-mode.md` § Resuming): start that part only when the request says to go on ("continue", "next part", "part 3"); if the request is empty, ask "Continue with part N?" and wait; if the request is something else, do that and name the part that is still waiting. On any run on an existing SDD (resume or targeted update), also check the Child LLDs table in chunk 00 § Document Lineage (`brd-to-sdd.md` § Source BRDs and lineage).

### 2. Resolve intent

Three possible intents:

- **GENERATE** — fresh SDD from a SoW, conversation, or topic seed. The architect supplies all technical decisions (or accepts CLAUDE.md defaults).
- **TRANSFORM** — re-shape an existing SDD (vendor template, IEEE 1016 style, prior in-house format) into this template.
- **DERIVE-FROM-BRD** — generate an SDD skeleton from a BRD (chunked folder or combined file), auto-filling BRD-derivable sections and flagging SDD-only sections with `[NEEDS CLARIFICATION: ...]` markers.

See `transform-detection.md` for the decision rules.

### 3. Intake (short — not a clarification storm)

Ask at most **three** questions before starting:

- **Project / system name** — if not stated.
- **Source material** — fresh? Existing SDD to migrate? One or more BRDs to derive from? (Several BRDs for one system give one SDD with several parents; if it is unclear whether the BRDs belong to one system, ask.)
- **Mode confirmation** — only if step 1 left ambiguity.

If an answer is in the conversation, do not re-ask.

### 3a. Project Type early ask + technical inputs (mandatory)

Two things happen before generation:

1. **Project Type.** If the source does not state whether this is **Greenfield** or **Brownfield**, ask this single question now via **AskUserQuestion** (load via ToolSearch if deferred):

   > "Greenfield (new product, no existing code) or Brownfield (extending an existing codebase)? If brownfield, where is the codebase?"

   **Brownfield** activates the brownfield flow: add §1 Existing System Context sub-section, mark cross-cutting concerns as inherit/override/new, flag per-service specs as extending existing services. Record the answer + a one-line justification in §1 — `lld-unifier` reads it from there when it synthesises its Specs chunk.

2. **Technical inputs from the BRD (when DERIVE-FROM-BRD).** Read each BRD's Appendix § "Technical Inputs for the SDD" — source technical mandates parked verbatim by `brd-unifier`. These are the highest-fidelity technical signal: they seed §6 Ecosystem Overview and override CLAUDE.md defaults where they conflict. Also read each BRD's Users & Use Cases Matrix and UC chunks — they drive §7 Actors/Use Cases (including the §7.3 traceability), the §16 Centralized User Roles catalogue, and per-service authorization notes. Propose a key for each BRD in one line (`brd-to-sdd.md` § Source BRDs and lineage), and with two or more BRDs run the cross-BRD reconciliation before step 3b; conflicting technical mandates are asked there, via **AskUserQuestion**, before the questionnaire.

**Legacy BRDs:** if the source BRD contains a `Specs` section or a `Technical Implementation Expectations` section (pre-restructure template), consume them the same way — Tech Stack rows verbatim into §6, Roadmap as phasing input, Project Type as the intake answer (skip the intake question). Note "legacy BRD sections consumed" in the handoff summary.

### 3b. Architecture questionnaire (DERIVE-FROM-BRD; optional walkthrough)

Read `architecture-questionnaire.md` and run it before the ecosystem selection. It runs for DERIVE-FROM-BRD; for GENERATE only when the user asks; never for TRANSFORM (the source SDD's architecture is kept).

1. Pre-fill the eight questions (Q1-Q3 drivers: release stage, teams, load and availability; Q4-Q8 decisions: architecture style, communication, data ownership, multi-tenancy, deployment target) with recommended answers and their BRD evidence, using the recommendation rules in the reference file. BRD-mandated answers are locked.
2. Show the proposed answers as one compact table, then ask ONE question via **AskUserQuestion**: **Accept all** (skip the questionnaire) or **Walk through the questions**. Mark Accept all as recommended when the drivers are clear and consistent; mark the walkthrough as recommended when a driver is missing or two drivers conflict, and say which.
3. Walkthrough: Q1-Q4 in one call, then Q5-Q8 in a second call with recommendations re-derived from the first answers. Recommended option first, labelled "(Recommended)", with the BRD evidence; 2-3 alternatives with one-line tradeoffs.
4. Apply the answers: §6 Architecture Doctrine row (source `questionnaire`), §8.1 Architecture Style, and **ADR-01** (style, drivers, rejected options, extraction or consolidation trigger). A modular monolith or hybrid changes how chunks 09-13x read (modules vs services, in-process port contracts in chunk 11): `architecture-questionnaire.md` § Effect on the SDD.
5. Record the outcome in `decision-log.md` § Architecture questionnaire record (always, even for Accept all).

### 3c. Ecosystem selection (mandatory, interactive — before any chunk is written)

The §6 Ecosystem Overview is never filled silently. Run this flow via **AskUserQuestion**:

1. **Assemble the proposed ecosystem.** Precedence per row: BRD Technical Inputs (verbatim, marked `BRD-mandated` with the BRD key) > user CLAUDE.md defaults > skill recommendation informed by the BRDs (NFRs, integrations, scale signals). When two BRDs mandate different choices for the same row, the row is not locked: it was asked right after the cross-BRD reconciliation (recommendation order: `brd-to-sdd.md` § Source BRDs and lineage) and is shown here as decided, with its ADR. The architecture doctrine row comes from step 3b (or, when the questionnaire did not run, from the source, else it is proposed and flagged). Rows that do not apply to the chosen style are proposed as `Not applicable` (for example, a service mesh for a single deployable, or a broker for a monolith with no asynchronous integration).
2. **Present the full proposed table compactly** (layer → choice → source: BRD-mandated / default / recommended), then ask ONE question:

   > **Ecosystem: accept all proposed defaults?**
   > - **Accept all (Recommended)** — proceed with the table as shown.
   > - **Walk through item by item** — review each layer with recommendations.

3. **If accepted:** fill §6, marking each row's source in Notes. Done.
4. **If declined (walkthrough):** batch the remaining items through AskUserQuestion (up to 4 questions per call), grouped by concern: (a) architecture doctrine (already settled in step 3b when it ran: shown locked with source `questionnaire`); (b) compute & runtime; (c) data — RDBMS, cache, object storage; (d) messaging & streaming; (e) identity & security — IAM, secrets; (f) edge — gateway, mesh/ingress; (g) delivery & observability — CI/CD, logs/metrics/traces; (h) application stacks — backend, frontend, BI. For every item, list the recommended option FIRST labelled "(Recommended)" with a one-line justification citing the BRD evidence that drives it (e.g., "BRD 10-nfrs NFR-03 seasonal peaks → managed streaming tier"). Offer 2-3 alternatives with one-line tradeoffs.
5. **BRD-mandated rows are not re-asked.** Show them as locked with source attribution. If the user overrides one anyway, record the deviation as an ADR in §10 and note it in the handoff summary.
6. **Every decision lands in §6** with its source in the Notes column; deviations from CLAUDE.md defaults or from the doctrine get an ADR row.
7. **Record the selection in `decision-log.md`** § Ecosystem selection record when the user walked through items or overrode a row: the outcome, the date, and one row per walked or overridden layer (offered options, chosen, source, rule-home link to the §6 row or the ADR). An "Accept all" with no override needs no register entry.

### 4. Plan internally

Enumerate which sections (combined) or chunks (chunked) will exist, which Mermaid diagrams each will carry, and which sections need `[NEEDS CLARIFICATION: ...]` markers. The canonical chunk list is in `chunking.md`.

### 5. Diagram policy (inline Mermaid; Miro on demand)

All diagrams are authored as **inline Mermaid** in the chunks, each followed by a 1-2 sentence prose **Summary** so the content reads without a renderer. Validate every emitted Mermaid block parses; on failure, fall back to a text description + `[NEEDS CLARIFICATION: Mermaid syntax error — review]`. See `mermaid-diagrams.md` for the diagram-type → dialect map and conventions.

SDDs typically need: System Context, High-Level Architecture, Workflow per critical flow, Sequence per critical interaction, event-hub topology + async backbone (chunk 10), role taxonomy + authorization sequence (chunk 12), the e2e fan-out maps and sagas (chunk 19), plus per-service ERDs, flows, and sequences.

**Miro only on explicit request:** if the user asks for a Miro board, create it via the Miro MCP per `mermaid-diagrams.md` § Miro on demand and append `> Miro: <url>` links below the corresponding Mermaid blocks — the inline Mermaid stays authoritative.

### 6. Generate / transform / derive output

**Parts or whole.** In `parts` (the default in CHUNKS mode), steps 6 to 9 are spread over three parts, each ending as `parts-mode.md` says:

| Part | Writes | Then |
|---|---|---|
| 1 | Chunks 00-09 and `[project-slug]-sdd-master.md` with its Generation Progress table | Exit checklist, part summary, **stop and wait** |
| 2 | Every `13x` service chunk, then 10 (event hub), back-propagation into the `13x` chunks, then 12 (roles), then 11 (API contracts), then the §7.3 Entry points, APIs, and Events columns (derive-from-BRD), then step 6a reconciliation; back-fill of 00-09 | Exit checklist, part summary, **stop and wait** |
| 3 | Chunks 14-17; back-fill; exit checklist; then steps 7 and 8 (chunk 18 and the acceptance loop); then step 8b (chunk 19 if the e2e gate is open, otherwise `Locked`) | Final `[project-slug]-sdd-master.md` and chunk 00, full handoff (step 9) |

Never start the next part in the same turn, and never without the user's go-ahead. In `whole`, run steps 6 to 9 straight through, as one run.

**CHUNKS mode (default):**

- Use `chunks/*.md` as the section skeleton.
- Write output to `./sdd-[project-slug]/`.
- Each chunk starts with the self-describing comment block (see `chunking.md`).
- Write `[project-slug]-sdd-master.md` from `chunks/sdd-master.md`, linking this project's real chunk files (one row per `13x` service chunk). In `parts` it is written in part 1 and updated at the end of every part; in `whole` it is written once the chunks exist and updated after step 8. Chunks not written yet are plain text: `Pending (part N)`, or `Locked` for chunk 19 while the e2e gate is shut.
- For section 17 (Detailed Service Specs), produce one chunk per service: `13a-service-[slug].md`, `13b-service-[slug].md`, ...
- **Generation order for the contract chunks:** draft the per-service Event Models and List of APIs (13a, 13b, …) → consolidate into chunk 10 (event hub) → back-propagate fixes → chunk 12 (roles) → chunk 11 (API contracts) → §7.3 Entry points, APIs, and Events (derive-from-BRD) → step 6a → review (18) → chunk 19 (e2e system design) LAST, behind the e2e gate.

**COMBINED mode:**

- Use `TEMPLATE-COMBINED.md` as the structure.
- Write output to `./SDD-[ProjectName]-v[X.X].md`.
- Leave `# 24. End-to-End System Design` out entirely (no heading, no stub) while the e2e gate is shut; append it at step 8b once the gate opens.

**TRANSFORM intent:**

- Read the source SDD fully.
- Map content to template sections per `source-transformation.md`.
- Preserve verbatim numbers, dates, named technologies, version pins.
- Flag every gap with `**[NEEDS CLARIFICATION: ...]**`.

**DERIVE-FROM-BRD intent:**

- Read every source BRD fully (chunked folder OR combined file — see `brd-to-sdd.md` § Detecting BRD input form), register each one in chunk 00 § Document Lineage with its key, and with two or more BRDs apply the cross-BRD reconciliation (`brd-to-sdd.md` § Source BRDs and lineage).
- Map BRD content to SDD sections per the table in `brd-to-sdd.md`.
- For SDD-only sections (Architecture Style, ADRs, Cross-cutting overrides, Runbook procedures), produce the heading + structure with `[NEEDS CLARIFICATION: ...]` markers naming the specific decisions the architect must make.
- For Ecosystem Overview, apply the BRD's Appendix § "Technical Inputs for the SDD" (parked source mandates) first, then fall back to user's CLAUDE.md defaults. (Legacy BRDs: a "Technical Implementation Expectations" section plays the same role.)
- Trace every BRD use case (`brd-to-sdd.md` § Use-case traceability): one owner service per use case in chunk 09's `Use cases (BRD)` column, a link on every `UC-NN` the SDD cites, a `**Use cases:**` line under each §8.4 and §8.5 diagram, and one §7.3 row per BRD use case.
- The output is intentionally an architect-ready skeleton, not a finished SDD.

### 6a. Contract consistency reconciliation (mandatory, AFTER the per-service chunks)

Before running the reviewer, reconcile the contract surface (see `chunking.md` § Contract consistency):

1. **Topic + event names:** every topic and event name in every `13x` Event Model matches chunk 10 §14.4/§14.5 character-for-character.
2. **Producer/consumer symmetry:** every event consumed somewhere is published by exactly one service; every producer's consumer list matches the union of the consumers' consumed tables.
3. **Payload fields:** every field a consumer's Effect column relies on exists in the §14.9 payload contract.
4. **Roles:** role names and permission tokens in per-service authorization notes match chunk 12 verbatim.
5. **API contracts:** every synchronous integration (every §12 row with a synchronous protocol, every synchronous edge in §8.5, every synchronous row in a service's Integrations table) has an `API-NN` in chunk 11 and a row in its §15.4 coverage matrix; method and URI in each `13x` List of APIs match chunk 11 verbatim; every authorization value in chunk 11 is a permission token from chunk 12; every contract uses the §15.1 error model; no service-to-service synchronous chain is deeper than one hop; every external contract is `TBD - external` or cites the provider document it was filled from.
6. **Use-case traceability (derive-from-BRD):** run the checks in `brd-to-sdd.md` § Use-case traceability: every BRD reference keyed with a registered BRD key; one §7.3 row per use case of every source BRD, under its BRD group, with title and status as the BRD states them; exactly one owner per active use case, the same in 09 and §7.3; every owned use case cited in its owner's `13x` Business Logic; §7.3 entry points, flows, API contracts, and events matching `13x`, 05, §15.2, and §14.5 in both directions; every UC link resolving (file and anchor).
7. **Fix what you can; flag the rest** in chunk 10 §14.8 / chunk 12 §16.12 / chunk 11 §15.5, or as a `[NEEDS CLARIFICATION: ...]` in the §7.3 cell — never silently reconcile.

Record the reconciliation date in the master's Generation Progress (`Reconciled: YYYY-MM-DD`). Chunk 19 (End-to-End System Design) is NOT written here: it waits for step 8b.

> **Specs note:** the constitution-grade `Specs` (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and synthesised at LLD time from this SDD's body. This skill does NOT author a Specs chunk.

### 7. Post-generation review (mandatory, cleared-context)

After the body of the SDD is written but **before** presenting to the user (in `parts`: once, in part 3, after chunk 17; chunks 00-17 exist, chunk 19 does not yet), run an adversarial review pass that produces the `Open Items & Clarifications` chunk (`18-open-items-and-clarifications.md` / `# 23. Open Items & Clarifications` section in combined mode).

**Why cleared context.** The same context that authored the SDD anchors on its own architectural choices. The reviewer's job is to find what is missing or risky, not to confirm what was decided.

**How to run it.**

1. Use the `Agent` tool with `subagent_type: comprehensive-review:full-review` (preferred for SDDs given the multi-dimensional review surface) or `general-purpose`. The subagent starts with no conversation memory.
2. Pass the subagent:
   - Absolute paths to all generated SDD chunks (or the combined file).
   - The path to the source BRD (chunks folder or combined file) so the reviewer can cross-check against requirements.
   - The path to this skill's templates.
   - The brief: identify architecture-level gaps, missing scenarios, ADR ambiguities, NFR shortfalls, integration corner cases, multi-tenancy implications, inconsistencies, AND cross-chunk contract mismatches (topic/event names or payload fields diverging between chunk 10 and any 13x chunk; consumer lists that don't reconcile; roles/permission tokens diverging between chunk 12 and per-service authorization notes; synchronous integrations without an API contract in chunk 11, contracts missing URI, headers, body, error codes, security, or auth, URIs diverging between chunk 11 and a `13x` List of APIs, invented external contract details; derive-from-BRD: BRD use cases with no owner or no entry point, §7.3 rows that disagree with their home chunks, UC links whose file or anchor does not resolve, BRD references without their BRD key, conflicts between source BRDs left unresolved and unflagged). For each finding, propose 2-3 concrete options with one-line tradeoffs AND a **Recommended Answer** (the concrete resolution text, written so it can be pasted into the SDD as-is — the exact row, ADR, sub-section, or wording) AND a **Why** (REQUIRED: the reason that option wins — the evidence behind it, e.g., BRD requirement, NFR, doctrine default, risk avoided, and the tradeoff accepted; never empty). Output goes into the chunk/section using the schema in `chunks/18-open-items-and-clarifications.md`.
   - Constraint: the reviewer captures **external** findings only — gaps the body did not flag inline. Inline `[NEEDS CLARIFICATION: ...]` markers stay where they are.
3. The subagent writes directly to `18-open-items-and-clarifications.md` (chunks mode) or appends to the `# 23. Open Items & Clarifications` section (combined mode).
4. Verify coverage: at minimum one OI per major risk surface (architecture style, ADRs, cross-cutting concerns, per-service contracts, event contract consistency, API contracts, NFRs, integrations, security, observability). Every OI must have a non-empty Recommended Answer AND a non-empty Why. Zero OIs typically means a confirmatory review — re-dispatch with stronger adversarial framing.

**Reviewer prompt skeleton (adapt per project):**

> You are an independent adversarial reviewer for a Solution Design Document. You have no memory of how this document was authored. Your job is to find what is missing, ambiguous, or risky in the architecture — not to confirm what is present.
>
> Read these files: [SDD paths]. Cross-reference against the source BRD: [BRD paths]. Use [TEMPLATE-COMBINED.md path] as the structural reference.
>
> For each architecture-level gap, missing scenario, corner case, ambiguity, risk, NFR shortfall, inconsistency, or contract mismatch, write an OI entry following the schema in [chunks/18-open-items-and-clarifications.md path]. Each entry must include: Where (§N or service), Type, Concern (one paragraph), Options (at least 2 with tradeoffs), **Recommended Answer (the concrete resolution text, ready to paste into the SDD)**, **Why (the reason that option wins over the alternatives — evidence + tradeoff accepted; never empty)**, Status: Open.
>
> Also flag decision-process narration left in content chunks ("resolved on <date>", option letters, "the user chose", walkthrough or progress notes) as Type Inconsistency; the design text must read as settled.
>
> Cover at minimum: architecture style fit (does the style in ADR-01 match the BRD drivers: stage, teams, load; are DDD boundaries and hexagonal structure respected; does everything that leaves the process go through an outbox), ADR completeness, cross-cutting concerns coverage, per-service contract completeness, **event contract consistency (every topic name, event name, and payload field in each per-service Event Model must match §14 the Centralized Event Hub verbatim; every consumed event must have exactly one producer; consumer lists must reconcile from both sides)**, **role catalogue consistency (per-service authorization notes vs §16)**, **API contract completeness (every synchronous integration has an `API-NN` in §15 with URI, headers, body, responses, error codes, security, and auth; internal contracts fully defined; external contracts `TBD - external` rather than invented; method and URI match each service's List of APIs; no synchronous chain deeper than one hop)**, NFR realisability (the BRD states NFRs in business language — check the SDD quantified them technically), integration error paths and timeouts, multi-tenancy edge cases, observability gaps, security/compliance hooks (cross-check per-service authorization against the BRD's Users & Use Cases Matrix), deployment failure modes, runbook completeness, BRD-to-SDD traceability gaps (use §7.3 as the checklist: every UC of every source BRD has exactly one owner service and an entry point, every §7.3 cell agrees with its home chunk, every UC reference carries its BRD key and opens the right BRD heading; a UC whose realisation is missing, such as an approval step no API or event carries, is a finding; with several BRDs, a persona, term, quality, or mandate that differs between them and is neither decided nor flagged is a finding), and duplication (BRD content restated instead of referenced with a delta; chunk 11 or `13x` restating each other's contract fields; the same scalar fact stated in two places — one fact, one home).
>
> Do not echo what the document says. Do not confirm. Find what is missing. Write directly to [output path].

### 8. Open Items review & acceptance loop (mandatory)

The Open Items are not left for the user to discover — walk them through each item and get a decision:

1. Present the OI list compactly (ID, title, one-line concern, the Recommended Answer and its Why).
2. Ask the user to decide per item, batched via **AskUserQuestion** (up to 4 items per call); the recommended option's description carries its Why so the user decides with the reason in view. Options per item: **Accept recommendation** (recommended, listed first) / **Choose option [B/C]** / **Defer** / user types their own answer via "Other".
3. For every **accepted** (or user-adjusted) item:
   - Apply the Recommended Answer (or adjusted text) to the referenced chunk(s)/section(s) as plain design text in present tense: the chunk never keeps a "resolved on <date>" stamp, an option letter, or a progress note, and any inline clarification marker the decision clears is removed. A decision that sets architecture direction becomes (or updates) an ADR in chunk 06.
   - Record the decision in `decision-log.md` (create the register on first use; structure: the `decision-log.md` reference in this skill folder): the question, its options, the chosen answer, who decided, the date, and the rationale (the Why, unless an ADR now carries it), under the clarification register, with a `Rule home:` link to the chunk section or ADR now carrying the settled design. A decision that replaces an earlier one keeps both records, the newer one marked as superseding.
   - If the change touches event contracts, API contracts, roles, or services, rerun step 6a (chunks 10, 11, 12 against the affected `13x` chunks) and update its date.
   - Set the OI's Status to `Accepted - applied` (or `Adjusted - applied`), add a Resolution Log row, and bump the Changes Log in chunk 00 once for the batch. Chunk 18 keeps only the item's current status line; the narrative lives in the register.
4. **Deferred / Rejected** items keep their entry with the new status and rationale; they are not applied.
5. If the user says "later" / "I'll review offline", leave all items `Open` and note in the handoff that the acceptance loop is pending — do not apply anything without an explicit decision.
6. When the loop ends, go to step 8b. Any `Open` or `Deferred` item keeps the e2e gate shut.

### 8b. End-to-End System Design, chunk 19 (gated)

Runs at the end of step 8, and again whenever the user asks for the e2e design, chunk 19, or a refresh of it (for example, after deciding deferred items later).

**Guardrail. Chunk 19 cannot be generated or refreshed until chunk 18 is cleared. There is no override, even when the user asks for it directly.**

1. **Verify the e2e gate against the files, never from memory or from status words in the master alone:**
   - **E1 - Open items cleared.** Chunk 18 exists and every OI has Status `Accepted - applied`, `Adjusted - applied`, or `Rejected`. None is `Open` or `Deferred`. `Deferred` counts as open.
   - **E2 - No open contract divergence.** Chunk 10 §14.8, chunk 12 §16.12, and chunk 11 §15.5 hold no row with Status `Open`.
   - **E3 - No clarification left in the consolidated chunks.** No `[NEEDS CLARIFICATION: ...]` marker remains in chunks 09, 10, 11, 12, or `13x`, or in §7.3 of chunk 03 (derive-from-BRD: a use case with no owner or no entry point). Markers in other chunks (for example, runbook or capacity) do not block. `[TBD - EXTERNAL: ...]` markers do not block: external systems appear in the e2e design at the system-context level only.
   - **E4 - Reconciled after the last change.** Step 6a was rerun after the last change to chunks 09, 10, 11, 12, or `13x`, with no unflagged finding (the `Reconciled:` date in the master is not older than those changes).
2. **Gate shut:** write nothing of chunk 19: no draft, preview, or outline, in a file or in the chat. Mark chunk 19 `Locked` in the master (or `Stale` if it already exists). Tell the user exactly what is open, condition by condition (OI IDs, divergence rows, markers by chunk), and the next action. A user's "just do it" does not open the gate: explain the rule and repeat the list.
3. **Gate open:** write chunk 19 from `chunks/19-e2e-system-design.md` as a faithful consolidation of 09, 10, 11, 12, and `13x`, not new design. Every count, name, and edge traces to those chunks; §24.7 references API IDs from chunk 11 and never restates contract fields. Validate every Mermaid block, then check the counts in "Counts at a Glance" against §13, §14.4, and §14.9 coverage, and every sync edge against §15.2. Update the master (chunk 19 linked, `Up to date`) and the chunk 00 indices. In COMBINED mode append `# 24. End-to-End System Design` as the last section.
4. **Refresh rule:** a later change to chunks 09, 10, 11, 12, or `13x`, or a new or reopened OI, marks an existing chunk 19 `Stale` in the master. It is refreshed only through this step, with the gate checked again.

### 9. Present

In `parts`, parts 1 and 2 end with the short part summary of `parts-mode.md` § The checkpoint, not with this handoff. This full handoff closes part 3, or a `whole` run.

After the body, the Open Items chunk, and the acceptance loop, surface to the user:

- Generation option used (`parts` or `whole`), and for `parts` the date each part was completed.
- Project name, version, mode (chunks / combined), file paths, and the `decision-log.md` path if the register exists (with its entry count).
- Number of chunks (if chunks mode) or section count (if combined).
- Count of inline Mermaid diagrams generated (and the Miro board URL, only if one was requested).
- Architecture questionnaire outcome: style chosen (and whether it followed the recommendation), the drivers behind it, the extraction or consolidation trigger, and accepted-all vs walked-through.
- Ecosystem selection outcome: accepted-all or walked-through, with the list of user overrides and BRD-mandated rows.
- Contract consistency status: reconciled ✓ (with date), plus any flags left in chunk 10 §14.8 / chunk 12 §16.12 / chunk 11 §15.5.
- API contracts: total `API-NN`, how many internal (`Defined`) and how many `TBD - external`, with the list of external providers whose documentation the user must supply (§15.6).
- Lineage: each source BRD with its key and version, the cross-BRD conflicts found and where each landed (ADR, clarification marker, open item), and the child LLDs (or `None yet`), with any row flagged by the Child LLDs check.
- Use-case traceability (derive-from-BRD), one line per source BRD: use cases (active, merged, removed), how many are fully traced, which carry a marker in §7.3 (by keyed ID), and that every UC link resolves (file and anchor). Example: `REFUNDS v1.0: 4 active, 4 traced, 0 flagged, 1 merged | WALLET v2.1: 9 active, 8 traced, 1 flagged (WALLET/UC-07); all UC links resolve`.
- **E2E gate: `Open` or `Shut`.** When open, chunk 19 was written (service, topic, event, sync-edge, and saga counts). When shut, say plainly that chunk 19 was not generated, list the conditions (E1-E4) that are not met with what is open behind each, and state that `Deferred` items count as open and that there is no override.
- Count of inline `[NEEDS CLARIFICATION: ...]` markers — explicit body-level gap inventory, with a list of the SDD-only sections that need the architect's input.
- Open Items summary: total, accepted & applied, adjusted, deferred, rejected, still open.
- Chain handoff check: every BRD reference carries a registered key and resolves against its BRD's actual location, UC anchors included; every Child LLDs link resolves; BRD content is referenced + delta, never restated; chunk names match the canonical map so `lld-unifier` can consume them.
- Reminder line: "Specs (Mission / Tech Stack / Roadmap / Project Type) is synthesised by lld-unifier from this SDD."
- One-line offer: "Want me to switch modes?" / "Want me to merge?" / "Want me to fill in section X now that you have decisions?"

### 10. Cross-mode conversion (on explicit request)

| User says | Action |
|---|---|
| "merge", "consolidate", "single file", "full doc" (after chunks exist) | Concatenate per `chunking.md` § Merge handling. Write to `./sdd-[project-slug]/SDD-[ProjectName]-v[X.X]-MERGED.md` (alongside the chunks). Keep originals. **Never merge `decision-log.md`.** |
| "split into chunks", "re-chunk this" (when a combined file exists) | Slice by template section per `chunks/*.md` skeleton. Keep the original combined file. |
| "regenerate chunk N", "update section X", "fill in section Y now that I have decisions" | Targeted regeneration of one chunk or section, leaving the rest untouched. Bump the Changes Log. Decisions the user gives are recorded in `decision-log.md`; the chunk carries only the settled design. If a `13x`, 10, 11, or 12 chunk changes, rerun step 6a and mark chunk 19 `Stale` if it exists (refresh through step 8b). |
| "generate the e2e design", "chunk 19", "refresh the e2e", or deferred items decided later | Step 8b (gated): apply any decisions the user gives through the step 8 mechanics first, rerun step 6a if contracts changed, then verify E1-E4. Gate shut means nothing is written and the user gets the list of what is open. |
| "update the API contracts", or external provider documentation supplied | Fill the affected `API-NN` blocks in chunk 11 from the supplied document (cite it as the Source document), set Status `Defined`, remove the `TBD - EXTERNAL` marker, update §15.6, rerun step 6a, and mark chunk 19 `Stale` if it exists. Never fill a provider field without a document or the user's explicit answer. |
| "continue", "next part", "part 2", "part 3" (a part is `Pending` in `[project-slug]-sdd-master.md`) | Resume with the next pending part, in order (`parts-mode.md`). Read every chunk already written and `decision-log.md` first. |
| "redo part N" | Follow `parts-mode.md` § Resuming (redo a completed part). Decisions taken since are kept, not lost. |
| "just finish it", "do the rest in one go" | Switch to `whole` for the remaining parts; no more checkpoints. |
| "add BRD <path>", "BRD <KEY> has a new version" | Targeted update per `brd-to-sdd.md` § Source BRDs and lineage, Changes after the SDD exists: register the BRD or update its version, reconcile it against the other BRDs, derive the delta, rerun step 6a, mark chunk 19 `Stale`, bump the version. |
| Any request on an SDD derived from a brd-unifier BRD that has no § Document Lineage or no §7.3 (derived before these rules) | Do what was asked, then offer once to add the lineage, the BRD keys, and use-case traceability (`brd-to-sdd.md` § Use-case traceability, SDDs derived before these rules). Never add them without asking. |

---

## Reference files (read these when the situation calls for them)

- `TEMPLATE-COMBINED.md` — the single-file template. Read at the start of any COMBINED-mode generation.
- `chunks/*.md` — the per-chunk template skeletons. Read at the start of any CHUNKS-mode generation.
- `chunking.md` — canonical chunk map, naming convention, merge rules.
- `modes.md` — chunks vs combined behavioural details.
- `architecture-questionnaire.md`: the step 3b questionnaire. When it runs, the eight questions (drivers and decisions), the recommendation rules by profile (MVP, first production release, platform at scale), the effect of each style on the SDD (modules vs services, in-process port contracts), and how the outcome is recorded. Read before step 3b.
- `parts-mode.md`: the generation option. The three parts, what each settles and what the user reviews, the checkpoint (stop and wait), the exit checklists, the back-fill of earlier parts, ID stability, the progress record in `[project-slug]-sdd-master.md`, and resuming. Read at the start of every CHUNKS-mode generation.
- `decision-log.md`: the companion decision register. What belongs there (ecosystem selection record, clarification Q&A, choices, dates, rationales when no ADR carries them, superseded history, walkthrough and delegation notes, part-handoff records), its canonical structure, how it relates to ADRs, the companion-file rules (created on first use, linked from `[project-slug]-sdd-master.md`, never merged), and the rule that content chunks carry only the settled design. Read whenever a decision is raised, taken, or applied.
- `transform-detection.md` — rules for deciding generate / transform / derive-from-BRD.
- `source-transformation.md` — how to map SoW or existing-SDD content into this template.
- `brd-to-sdd.md` — explicit BRD→SDD field mapping (read this when the source is a BRD; covers the business-language BRD shape: UC chunks, Users & Use Cases Matrix, parked technical inputs, legacy Specs handling) and the use-case traceability rules (UC link format, where each use case is cited, §7.3, its checks).
- `sdd-quality.md` — what makes a substantive section vs a thin one (analogous to `use-case-quality.md` in brd-unifier).
- `mermaid-diagrams.md` — inline Mermaid conventions per diagram type, plus the Miro-on-demand flow.

---

## Output conventions

- **Project slug**: kebab-case, lowercased, derived from project name.
- **Chunked output folder**: `./sdd-[project-slug]/`.
- **Chunked filenames**: `NN-short-title.md` (two-digit prefix, optional letter for service splits like `13a`, `13b`). See `chunking.md`.
- **Contract identifiers**: `API-NN` (chunk 11), `OI-NN` (chunk 18), `ADR-NN`, `AP-NN`, `INT-NN`. Stable once seen; never renumbered.
- **BRD keys**: one short capital key per source BRD (`REFUNDS`, `WALLET`), registered in chunk 00 § Document Lineage; stable once seen. Every BRD ID the SDD cites carries it (`REFUNDS/UC-04`, `REFUNDS/NFR-02`).
- **UC links** (derive-from-BRD): `[KEY/UC-NN](<relative path to the BRD file holding the heading>#<anchor of that heading>)`, e.g. `[REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)`. Parts of a use case follow the link: `step 5`, `A1`, `E1`, `BR-2`, `AC-3`. Rules: `brd-to-sdd.md` § Use-case traceability.
- **Combined output filename**: `SDD-[ProjectName]-v[X.X].md` (PascalCase project name).
- **Merged-from-chunks filename**: `SDD-[ProjectName]-v[X.X]-MERGED.md`, written inside `./sdd-[project-slug]/` alongside the chunks.
- **Decision register**: `decision-log.md`, the companion decision register, in `./sdd-[project-slug]/` next to `[project-slug]-sdd-master.md` (in COMBINED mode the folder is created for it). Created on first use, linked from `[project-slug]-sdd-master.md`, never merged into merged or combined output. Structure and rules: the `decision-log.md` reference in this skill folder.
- **Encoding**: UTF-8, LF line endings.
- **Tables**: pipe-table format, no hard line wrap.

---

## Things this skill never does

- Never emits `.docx`, `.pdf`, `.xlsx`, or any non-Markdown output unless the user explicitly asks.
- Never creates a Miro board unless the user explicitly asks. Inline Mermaid is the authoritative diagram medium; Miro links are additive.
- Never fills the §6 Ecosystem Overview silently — the ecosystem selection flow (step 3c) always runs.
- Never assumes microservices (or any style) when deriving from a BRD: the architecture questionnaire (step 3b) runs, and its recommendation cites the BRD drivers. Never recommends microservices only because it is the house default.
- Never authors a `Specs` chunk — Specs (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and synthesised from this SDD.
- Never generates or refreshes chunk 19 (End-to-End System Design), not even as a draft, preview, or outline, in a file or in the chat, while any e2e gate condition (E1-E4) is not met. `Deferred` open items count as open. There is no override.
- Never invents an external system's API contract (URI, headers, body, responses, error codes, auth scheme). Without the provider's documentation or the user's explicit answer, the fields stay `TBD` and the contract stays `TBD - external`.
- Never leaves a synchronous integration without an `API-NN` contract in chunk 11, and never restates a contract's headers, body, or error codes in a `13x` chunk.
- Never lets per-service event tables drift from chunk 10. A topic/event/payload divergence is fixed or flagged (chunk 10 §14.8), never left silently inconsistent.
- Never invents performance targets, version pins, technology choices, or capacity numbers to fill a table. Missing target → `[NEEDS CLARIFICATION: ...]`.
- Never produces a "here's a summary, let me know if you want the full version" preview. Generate the actual deliverable.
- Never silently drops template sections. Empty sections keep their heading and write `Not applicable for this release.` (with a clarification flag if surprising).
- Never modifies the embedded templates (`TEMPLATE-COMBINED.md` or `chunks/*.md`) during a generation run — they are read-only references.
- Never starts the next part in `parts` without the user's go-ahead, never skips a part or changes their order, and never rewrites a completed part on a resume (only the back-fill touches it).
- Never merges `decision-log.md` into the merged or combined SDD, and never leaves decision-process narration ("resolved on <date>", option letters, "the user chose", walkthrough, delegation, or progress notes) in the content chunks: the chunks state the settled design, the register tells the story.
- Never renumbers or reuses a service chunk letter, ADR-NN, AP-NN, OI-NN, topic name, event name, role name, or permission token the user has already seen.
- Never creates, renumbers, or re-titles a BRD use case, never cites a BRD ID without its BRD key, and never hands off a UC link whose file or anchor does not resolve. Behaviour no BRD use case covers is an open item, not a new `UC-NN`.
- Never resolves a conflict between two source BRDs silently (a persona, term, quality measure, or technical mandate that differs): it is asked, recorded as an ADR, or flagged. Never merges use cases from different BRDs.
- Never writes into a child LLD, and never deletes a Child LLDs row: a row whose LLD is gone or out of date is flagged.
- Never writes a per-service detailed spec from the BRD alone. The BRD doesn't have enough technical specificity; per-service detailed specs (DB Modeling, API list, Event Model) need architect input or are flagged.
