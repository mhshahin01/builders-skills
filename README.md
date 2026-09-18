# Product Documentation Skill Suite

A set of five reusable skills that cover the full product documentation lifecycle, from idea validation through to implementation-ready design, plus a cross-document review panel. Four authoring skills each own one stage; a fifth reviews the chain. Used in order, they take a raw idea and carry it to a buildable specification with consistent structure, numbering, and diagramming conventions across every stage.

```text
Idea  ->  pre-BRD  ->  BRD  ->  SDD  ->  LLD  ->  Build
          validate     what     how-      how-       code
                       /why     overall   detailed

          \_____________ business-reviewer (any stage) ____________/
```

| Stage              | Skill                       | Question it answers                      | Primary output                                                 |
| ------------------ | --------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| 1. Discovery       | `pre-brd-unifier`           | Is this worth building?                  | 22 frameworks, go / no-go scoreboard, investor assessment      |
| 2. Requirements    | `brd-unifier`               | What are we building, and why?           | Business-language BRD: journeys, UC-NN use cases, NFRs         |
| 3. Solution design | `sdd-unifier`               | How does the system fit together?        | Architecture, services, event hub, roles, cross-cutting design |
| 4. Detailed design | `lld-unifier`               | How is each service built?               | Schemas, APIs, events, sequences, Specs for SpecKit            |
| Review             | `business-reviewer-unifier` | Does the document chain hold up?         | Persistent review tracker driven to resolution                 |

---

## Shared conventions

All skills follow the same house style, so output is interchangeable and tool-friendly across stages.

- **Markdown only.** No `.docx` or `.pdf` unless explicitly requested. The one exception is the pre-BRD `.xlsx` export, produced only on demand after the Markdown is approved.
- **No em dash characters.** Use commas, colons, parentheses, or sentence breaks instead.
- **Chunks or combined.** Every authoring skill takes a mode argument: `chunks` (one `.md` file per logical section grouping, the default) or `combined` (one monolithic file).
- **Stable two-digit numbering.** Files use the `NN-kebab-name.md` pattern so ordering is deterministic and cross-references stay valid. Each chunked set has a master file (`*-master.md`) that indexes the chunks.
- **What vs how split.** The BRD is business language only (the WHAT). The SDD owns every technical decision (the HOW). The LLD owns the constitution-grade Specs section (Mission, Tech Stack, Roadmap, Project Type) that feeds SpecKit `/constitution`.
- **Cleared-context reviewer pass.** Every full generation ends with an independent reviewer subagent that writes an `Open Items & Clarifications` chunk. Each item carries a concrete Recommended Answer, and the skill walks the user through accept, adjust, or defer, then applies accepted answers to the body.
- **Diagrams as inline Mermaid by default.** Each diagram has a short prose summary so the document reads without a renderer. Miro boards are created via the Miro MCP only when explicitly requested, and the board link is additive (`> Miro: <url>` under the Mermaid block), never a replacement.
- **Tech defaults (SDD and LLD only).** Java 21, Spring Boot 3.5+, PostgreSQL 17+, Kafka, Angular 17+ with Tailwind and PrimeNG, UUIDv7 primary keys, BIGINT minor units for money, UTC for all timestamps.

---

## 1. pre-BRD (`pre-brd-unifier`)

**Purpose:** the discovery layer that runs before any requirements are written. It validates that an idea is worth building before effort is spent on a full BRD. It performs the analysis (market sizing, competitor scan, macro and internal factors) through multi-agent web research, rather than only templating it.

**Usage:** `pre-brd-unifier [chunks|combined]` (chunks is the default).

**Structure:** a master index (`00-pre-brd-master.md`) plus 24 chunks.

1. Idea definition: Concept Sheet, Product Charter, Lean Canvas, Value Proposition Canvas, Empathy Map.
2. Market and competition: Market Comparison, Market Sizing, PESTLE, Porter's Five Forces, EFAS, IFAS, SWOT.
3. Prioritization: RICE, MoSCoW.
4. Strategy and planning: OKRs, BCG Matrix, Ansoff Matrix, VRIO, Product Strategy Canvas, Product Lifecycle, Roadmap and Project Plan.
5. Synthesis: Executive Summary Scoreboard with a composite score and go / no-go thresholds.
6. Chunk 23, Investor Assessment: an independent investor-style Go vs No-Go verdict, including go-to-market strategy.
7. Chunk 24, Open Items and Assumptions Log: the reviewer's output plus every material assumption with its basis and risk.

**Key behaviors:**

- Compute, do not hardcode: Porter's averages, EFAS and IFAS weighted scores, RICE, BCG, VRIO, Ansoff, TAM to SAM to SOM with a top-down vs bottom-up cross-check, and the Tier-5 composite all come from formulas in `frameworks.md`.
- Market figures are sourced and reconciled across chunks (`research-orchestration.md`); the reviewer flags any figure cited differently in two places.
- **Excel export:** after the user approves the Markdown, `scripts/export_xlsx.py` clones the reference workbook `reference/PRE-BRD-v1.1.xlsx` (fonts, settings, sample columns, live formulas) using `reference/cell-map.json`. See `xlsx-export.md`. Tests live in `scripts/tests/`.

**Feeds into:** the BRD. A validated pre-BRD supplies the problem statement, target users, market context, and prioritized scope.

---

## 2. BRD (`brd-unifier`)

**Purpose:** generate, or transform an existing document (SoW, old-format BRD, loose notes) into, a Business Requirements Document in the house template. The BRD is business language only and written in plain language (`writing-style.md`): short sentences, common words, every number and rule kept.

**Usage:** `brd-unifier [chunks|combined] [parts|whole]`.

- `parts` (default in chunks mode): the BRD is written in three parts, stopping for the user's review after parts 1 and 2 (`parts-mode.md`). Part 1 settles scope, personas, and the use case list; part 2 writes the detailed use cases; part 3 writes the rest and runs the review.
- `whole`: everything in one go. Combined mode is always `whole`.

**Chunk map:**

| Chunks | Content |
| ------ | ------- |
| 00-04 | Cover and changelog, executive summary, glossary and assumptions, domain concepts, scope and personas |
| 05, 06a, 07 | User journeys with use-case diagrams, detailed UC-NN use cases, Users and Use Cases permission matrix |
| 08-12 | Business-level integrations, reporting, NFRs as business expectations, summary and UI/UX, appendix and wishlist |
| 13 | Open Items and Clarifications (reviewer output) |
| 14 | Product-manager to-do: resolve open items, consistency check, grill-me session, Figma mockups, use-case diagrams and flowcharts |
| 15-17 | Implementation plan, UAT/BAT test cases, presentation and video brief |

**Delivery gate:** chunks 15, 16, and 17 are locked until every step in `14-todo.md` is closed (gate conditions G1 to G5 in `delivery-chunks.md`). There is no override.

**Reference files:** `chunking.md`, `modes.md`, `parts-mode.md`, `transform-detection.md`, `sow-transformation.md`, `mermaid-diagrams.md`, `use-case-quality.md`, `writing-style.md`, `delivery-chunks.md`, `TEMPLATE-COMBINED.md`.

**Feeds into:** the SDD. Technical mandates found in a source document are parked verbatim in the BRD Appendix under Technical Inputs for the SDD, never in the business body.

---

## 3. SDD (`sdd-unifier`)

**Purpose:** the Solution Design Document. Owns the entire HOW. It can generate from scratch, transform an existing SDD, or derive an SDD from a BRD (chunked folder or single file, see `brd-to-sdd.md`).

**Usage:** `sdd-unifier [chunks|combined]` (chunks is the default).

**Key behaviors:**

- Project Type (greenfield or brownfield) is asked at intake and gates the whole generation.
- The Ecosystem Overview is never filled silently: the skill offers the proposed ecosystem for a one-shot accept-all, or walks the user through each item with BRD-informed recommendations.
- Falls back to CLAUDE.md defaults plus the platform doctrine (EDA, DDD, hexagonal) when the BRD is silent.

**Chunk map:** cover, executive summary and risks, ecosystem overview, users and use cases, architecture style and diagrams, workflows and sequences, principles and decisions, cross-cutting concerns, integrations, services summary, per-service detailed specs (`10a`), performance and capacity, environments, operations runbook, appendix and wishlist, and three platform-level catalogues:

- **Centralized Event Hub** (chunk 10): the contract registry for topic names, event names, and payload contracts. Every per-service chunk must match it verbatim.
- **Centralized User Roles and Authorities** (chunk 11).
- **End-to-End System Design** (chunk 16), authored last.

Chunk 17 holds the Open Items and Clarifications from the reviewer pass.

**Feeds into:** the LLD. Each service bounded in the SDD becomes the subject of its own LLD.

---

## 4. LLD (`lld-unifier`)

**Purpose:** the Low-Level Design. Specifies a single service or component to an implementation-ready level any AI agent or developer can execute against.

**Usage:** `lld-unifier [chunks|combined]` (chunks is the default). The skill always asks for the mode first:

- **from-sdd:** greenfield, author the LLD before code exists (`sdd-to-lld.md`).
- **from-code:** reverse-engineer an LLD from an existing codebase (`code-extraction.md`).
- **hybrid:** compare an SDD against existing code and produce a unified LLD with drift markers (`hybrid-drift.md`).

**Chunk map:** metadata, purpose and scope, context, architecture, implementation, data model, API contracts, event contracts, state and rules, cross-cutting, operations, security, performance, testing, frontend, open questions, references, Specs (chunk 17), and Open Items and Clarifications (chunk 18).

**Key behaviors:**

- Orchestrates two specialist agents: `feature-dev:code-explorer` for structural discovery and `code-documentation:docs-architect` for narrative synthesis (`agent-orchestration.md`).
- Owns the Specs section (Mission, Tech Stack, Roadmap, Project Type), synthesised after the LLD body as the direct input for SpecKit `/constitution`. Legacy Specs in an SDD or BRD are read as input only.
- Confidence and pattern rules (`confidence-rules.md`, `pattern-rules.md`) govern how inferred facts are marked and which patterns apply.

**Feeds into:** implementation, including SpecKit-driven and Claude Code-assisted builds.

---

## 5. Business Reviewer (`business-reviewer-unifier`)

**Purpose:** a multi-angle adversarial review panel over business and design documents (pure-business docs, domain identification, service boundaries, project preparation, BRDs, SDDs), driven to resolution. This is the cross-document panel review; it is separate from the single-agent reviewer pass built into each authoring skill.

**Usage:** `business-reviewer-unifier [panel|walkthrough|apply|verify]`. With no argument, the phase is detected from the tracker state.

- `panel`: dispatches the reviewer personas and builds `review-comments-tracker.md` in the project root.
- `walkthrough`: resumes point-by-point resolution with the user.
- `apply`: applies decided points across the whole document chain.
- `verify`: cleared-context consistency re-review and versioning.

**Reference files:** `reviewer-personas.md`, `panel-orchestration.md`, `tracker-schema.md`, `walkthrough-protocol.md`, `apply-and-verify.md`.

---

## Installation and usage

These skills follow the open Agent Skills format (`SKILL.md` folders) and run in Claude (claude.ai and Claude Code), OpenAI Codex, and Kimi Code. Each `SKILL.md` has a "Running outside Claude Code" section that maps Claude-only tools to plain fallbacks.

### claude.ai (web or desktop)

Upload each skill through Settings, under Capabilities or Customize, then Skills. Each skill must be a folder containing its `SKILL.md` (plus any reference files), zipped and uploaded individually, then toggled on. Custom skills are private to your account; on Team or Enterprise plans an owner can optionally share them org-wide.

Note the 1024-character cap on the `description` frontmatter field. All descriptions are kept under it and written as YAML block scalars (`description: >-`) so strict parsers accept them; keep both rules when editing.

### Claude Code (CLI)

Install at user scope by extracting the skill into:

```text
C:\Users\<username>\.claude\skills\<skill-name>\
```

List installed skills with `/skills` inside a session, or this command in PowerShell outside one:

```powershell
dir $env:USERPROFILE\.claude\skills
```

Common failure causes if a skill does not appear: the session was not reloaded, Windows extraction created a double-nested folder, or the `SKILL.md` frontmatter is invalid. Two caveats for CLI use: the Miro MCP must be configured separately via `claude mcp add`, and the pre-BRD Excel export needs Python with `openpyxl` installed.

### Codex and Kimi Code

Both scan `~/.agents/skills` for user-level skills (Kimi also reads `~/.kimi-code/skills`; Codex also reads `.agents/skills` in a repo). Keep this repo as the single source and link each skill in with a junction, so edits here apply everywhere:

```powershell
$src = "$env:USERPROFILE\.claude\skills"; $dst = "$env:USERPROFILE\.agents\skills"
foreach ($s in 'pre-brd-unifier','brd-unifier','sdd-unifier','lld-unifier','business-reviewer-unifier') {
  New-Item -ItemType Junction -Path "$dst\$s" -Target "$src\$s"
}
```

| Agent | List skills | Invoke explicitly | Automatic |
| ----- | ----------- | ----------------- | --------- |
| Claude Code | `/skills` | `/brd-unifier chunks parts` | Yes, from the description |
| Codex (CLI, IDE, app) | `/skills` | `$brd-unifier chunks parts` | Yes, from the description |
| Kimi Code | ask "which skills do you have" | `/skill:brd-unifier chunks parts` | Yes, from the description |

Differences outside Claude Code: agents without sub-agents run the reviewer pass in the same context (weaker than Claude's fresh-context review), and questions are asked in chat instead of through a question tool. The pre-BRD Excel export needs Python with `openpyxl` in every runtime.

### How to use each skill

Call a skill by name with its arguments, or just describe the task in plain words and the agent picks the skill from its description. The prefix depends on the agent: `/` in Claude Code, `$` in Codex, `/skill:` in Kimi Code.

| Skill | Arguments | Claude Code | Codex | Kimi Code | Plain-words example |
| ----- | --------- | ----------- | ----- | --------- | ------------------- |
| pre-BRD | `[chunks\|combined]` | `/pre-brd-unifier chunks` | `$pre-brd-unifier chunks` | `/skill:pre-brd-unifier chunks` | "Validate this idea with a pre-BRD" |
| BRD | `[chunks\|combined] [parts\|whole]` | `/brd-unifier chunks parts` | `$brd-unifier chunks parts` | `/skill:brd-unifier chunks parts` | "Turn this SoW into a BRD" |
| SDD | `[chunks\|combined]` | `/sdd-unifier chunks` | `$sdd-unifier chunks` | `/skill:sdd-unifier chunks` | "Derive an SDD from the BRD in ./brd-acme" |
| LLD | `[chunks\|combined]` | `/lld-unifier chunks` | `$lld-unifier chunks` | `/skill:lld-unifier chunks` | "Write the LLD for the wallet service from the SDD" |
| Business reviewer | `[panel\|walkthrough\|apply\|verify]` | `/business-reviewer-unifier panel` | `$business-reviewer-unifier panel` | `/skill:business-reviewer-unifier panel` | "Review the BRD and SDD from different angles" |

Tips:

- Run from the project folder where the documents should be written; each skill writes its chunks there.
- Point the skill at its input: an idea or notes for pre-BRD, a SoW or old BRD for BRD, the BRD folder for SDD, the SDD folder or a code path for LLD.
- In `parts` mode the BRD stops after parts 1 and 2; reply "continue" to go on.
- Say "export to Excel" after approving a pre-BRD to get the `.xlsx`.

---

## Suggested workflow

1. Run **pre-BRD** to validate the idea and produce a go / no-go verdict.
2. If go, run the **BRD** skill to convert the validated concept (or an inbound SoW) into business requirements. Clear the to-do in chunk 14 to unlock the implementation plan, UAT/BAT cases, and presentation brief.
3. Run **SDD** to design the system architecture against those requirements.
4. Run **LLD** per service to reach implementation-ready detail and produce the Specs.
5. Run **business-reviewer** at any point to challenge the document chain from several angles.
6. Hand the LLD and its Specs to SpecKit and Claude Code for the build.
