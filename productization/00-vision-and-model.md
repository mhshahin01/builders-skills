# 00. Vision and agent model

## 1. The product model

The platform works like Band: a user creates an agent, assigns it a model, gives it a role and job description, and adds it to a team. Team members collaborate toward a goal the user sets. The user stays the decider: agents propose, recommend, and produce; the human approves, adjusts, defers, or rejects at defined decision points.

The unifier skills become the platform's first predefined agents. Each skill folder is already an agent definition package: a role contract (what it owns and never does), a conversation flow (what it asks, when, with which options), an artifact contract (what it reads and writes, where, with which IDs), and collaboration rules (handoffs it accepts and emits). This guide re-expresses those packages in product terms.

## 2. From skill folder to agent definition

One skill folder maps to one agent definition:

| Skill element | Platform equivalent |
|---|---|
| `SKILL.md` frontmatter (name, description, triggers) | Agent card: name, mission, when to include in a team |
| Core principles and "Things this skill never does" | The agent's standing instructions (non-negotiable policy) |
| Workflow steps and prompt texts | The agent's conversation and work pipeline, surfaced as stages in the run view |
| `chunks/*.md`, `TEMPLATE-COMBINED.md` templates | The artifact templates the agent fills (read-only to the agent at run time) |
| `Agent` tool dispatches (reviewer, researcher, code-explorer) | Sub-agent jobs: fresh-context workers the platform spawns and tracks |
| `AskUserQuestion` batches | Items in the human decision queue |
| Handoff phrases ("BRD <KEY> has a new version", "the SDD has a new version") | Confirmed task launches on other agents, gated on the user's word |
| Output conventions (folders, masters, versions) | The workspace layout contract all agents share |

Platform primitives the skills assume, which the platform must provide:

1. **Sub-agent dispatch with cleared context.** Every agent spawns fresh-context workers (reviewers, researchers, code explorers) that must not share the parent's conversation memory. This is a quality mechanism, not an optimization.
2. **A human question UI.** Structured questions with 2-4 options, a recommended option first, free-text fallback, and batching (up to 4 related questions per prompt).
3. **Workspace file access.** Agents read and write Markdown artifacts under the project root, with the layout in § 5.2.
4. **A decision queue and a handoff launcher** (§ 5.3, § 5.4).
5. **Integrations:** a web research backend, required by Discovery for chunks 06-11 (the skill defines no fallback mode); optional: codebase indexing (Implementation Designer), Mermaid validation, Miro, Excel export, Figma (external).

## 3. The five predefined agents

| Agent | Skill | Stage | Owns | Never does (headline) |
|---|---|---|---|---|
| Discovery Analyst | `pre-brd-unifier` | Discovery | `pre-brd-[slug]/` chunks 00-24, verdicts | Never invents market figures; never exports before approval |
| Requirements Analyst | `brd-unifier` | Requirements | `brd-[slug]/` chunks 00-17, `decision-log.md`, UC/persona/NFR IDs | Never writes technical HOW in the body; never opens the delivery gate without evidence |
| Solution Architect | `sdd-unifier` | Architecture | `sdd-[slug]/` chunks 00-19, `decision-log.md`, API-NN/ADR-NN/INT-NN IDs, BRD keys | Never assumes an architecture style; never invents external contracts; never writes a Specs chunk |
| Implementation Designer | `lld-unifier` | Implementation design | `lld-[slug]/` chunks 00-18, the Specs chunk, OQ-NN/SAGA-NN/RB-NN IDs | Never invents code facts (confidence-flag instead); never creates upstream IDs; writes outside its folder only its Child LLDs row |
| Review Panel | `business-reviewer-unifier` | Cross-cutting | `review-comments-tracker.md`, `review-panel-findings.md`, point IDs <ROLE>-NN | Never reviews or edits LLDs; never edits a gated chunk's content; never auto-runs hand-offs |

## 4. Team presets by product complexity

Users compose teams from the five agents based on what they are building. Presets are starting points, not restrictions.

| Preset | Team | Fits | Chain covered |
|---|---|---|---|
| Solo validation | Discovery Analyst | Idea stage, no commitment to build | pre-BRD with verdicts; stops there |
| Standard | Requirements Analyst + Solution Architect | MVP or feature with a clear scope (SoW or brief in hand) | BRD -> SDD; LLD deferred or skipped |
| Full chain | Discovery + Requirements + Architect + Implementation Designer | New platform or product line, greenfield | pre-BRD -> BRD -> SDD -> LLD, ready for Developer agents |
| Review add-on | + Review Panel | Any preset, before sign-off or at milestones | Cross-document adversarial sweep and resolution |

Entry points other than the chain start are first-class: an existing SoW can enter at Requirements, an existing BRD at Architecture, an existing codebase at Implementation Designer (from-code direction), an existing SDD at Implementation Designer (from-sdd). See `01-pipeline-overview.md` § 5.

## 5. Shared platform concepts

### 5.1 The workspace is shared memory

Agents do not pass documents to each other. They read and write a shared workspace (the project root) with a fixed layout. Everything an agent produces is a file another agent, or the human, can open.

### 5.2 Workspace layout and artifact boundaries

```
<project root>/
├── pre-brd-[slug]/            Discovery Analyst writes here
│   ├── 00-pre-brd-master.md
│   └── NN-*.md (01-24)
├── brd-[slug]/                Requirements Analyst writes here
│   ├── [slug]-brd-master.md
│   ├── NN-*.md (00-17)
│   └── decision-log.md
├── sdd-[slug]/                Solution Architect writes here
│   ├── [slug]-sdd-master.md
│   ├── NN-*.md (00-19)
│   └── decision-log.md
├── lld-[slug]/                Implementation Designer writes here
│   ├── [slug]-lld-master.md
│   ├── NN-*.md (00-18)
│   └── 04-implementation/<service>.md
├── PRE-BRD-[Name]-v1.1.md     combined variants, at root
├── BRD-[Name]-v[X.X].md       (merged variants: BRD/SDD inside their folder,
├── SDD-[Name]-v[X.X].md        pre-BRD and LLD at root; see 09-open-decisions.md D6)
├── LLD-[Name]-v[X.X].md
├── review-comments-tracker.md  Review Panel writes here
├── review-panel-findings.md
├── AGENTS.md                   optional project guidance, read by all agents
├── CLAUDE.md                   optional user stack defaults, read by Architect and Implementation Designer
└── ui-ux-global-constitution.md optional UI/UX standard, read by Requirements Analyst
```

Write-boundary rule: each agent writes only inside its own artifact area. Two contractual exceptions, both required by the chain:

1. Implementation Designer writes exactly one row (its own) in the SDD's Child LLDs table, `sdd-[slug]/00-cover-and-changelog.md`. That row is the only thing it writes into another document; outside `lld-[slug]/` it also writes its own root-level `LLD-[ProjectName]-v[X.X].md` (combined shape) and `LLD-[ProjectName]-v[X.X]-MERGED.md` (merge) (lld-unifier/SKILL.md:188, 317). The Architect writes in the same table: it adds a missing row for a sibling LLD that links this SDD, and marks a row whose SDD version is older as out of date; the LLD's next build or accepted refresh clears the mark (sdd-unifier/brd-to-sdd.md:45; lld-unifier/sdd-to-lld.md:220).
2. Review Panel edits content in the documents it reviews, inside each owner's template structure (pre-BRD: Answer cells and the derived values they change, never chunk 23). It also writes their Changes Log rows, decision-log § Business review register records, version bumps, renames with citation updates, the `In Review` cover status of a changed `Approved` BRD, and Stale marks (BRD 15-17 in their three places; the SDD master's E2E gate line). It never writes template structure (chunk files and headers, columns, ID schemes, status values, gate conditions, lineage tables, contract registries, the Changes Log format), lineage rows, the owner's `OI-NN`/`TD-NN` items, the BRD's use-case diagrams and flowcharts, a gated chunk's content, or any LLD (business-reviewer-unifier/apply-and-verify.md:31-71).

The platform should enforce these boundaries as permissions, not rely on agent discipline alone.

### 5.3 The decision queue

Every agent produces structured decisions for the human, with a recommendation and its reason always visible. Queue item types across the suite:

| Type | Produced by | Form |
|---|---|---|
| Open item (OI-NN) | All four doc agents' reviewers | Concern + at least 2 options with tradeoffs (no cap) + Recommended Answer (LLD: Recommendation) + Why |
| Consistency finding (CF-NN) | Requirements Analyst | Finding + disposition options |
| Review point (<ROLE>-NN) | Review Panel | Full-prose issue + options table + Recommendation, one at a time |
| Gate status (shown, not decided) | Requirements (G1-G5), Architect (E1-E4) | Verified against the files: Met / Not met per condition, what is still open, owner and next action; no sign-off and no override (sdd-unifier/SKILL.md:316, 318) |
| PM confirmation | Requirements (to-do steps 3 and 4) | The product manager's dated confirmation of the grill-me session and of the mockup review; valid for those two steps only |
| Approval | Discovery (step 7) | Explicit approval of the Markdown deliverable, no conditions; it unlocks the Excel export (pre-brd-unifier/SKILL.md:82-83) |
| Refresh offer | Implementation Designer (step 3c) | One bundled offer per upstream change set. The Architect makes no refresh offer: its handoff adds a one-line suggestion to refresh an out-of-date child LLD through lld-unifier (sdd-unifier/SKILL.md:335) |
| Hand-off launch | Review Panel, all doc agents | Named request on another agent + expected evidence |
| Free-standing questions | Intake, direction, Project Type, brand color, roadmap grouping | One-off structured question |

Rules inherited from the skills: no open item, business choice, or review point is applied without an explicit human decision (mechanical consistency corrections with a fixed source of truth are applied and logged as `Corrected`, brd-unifier/delivery-chunks.md:186). For the document agents' open items, "Deferred" never counts as resolved and keeps their gates shut; a Review Panel point set to `Deferred` on the user's word counts as closed (business-reviewer-unifier/SKILL.md:49, 213-214).

### 5.4 The handoff launcher

Agent-to-agent requests are phrased tasks in a shared vocabulary. The platform models them as launchable tasks with confirmation, never as automatic triggers. Known phrases:

| Phrase | From -> To | Effect |
|---|---|---|
| "derive an SDD from this BRD" | user -> Architect | DERIVE-FROM-BRD run |
| "BRD <KEY> has a new version" | user or Review Panel -> Architect | Targeted SDD update + reconciliation. From the Review Panel the phrase reads "BRD [KEY] has a new version, after the business review of [date] ([tracker path])" and is taken once |
| "the business review changed this SDD" | Review Panel -> Architect | Review hand-off update, when no source BRD changed; taken once: a repeat applies pending items and runs the Child LLDs check only (sdd-unifier/SKILL.md:373) |
| "update the todo: decisions from the business review of [the tracker's Created date] ([tracker path])" | Review Panel -> Requirements | Close answered items, raise remainders; taken once: a repeat applies pending items only, with no consistency run unless asked (brd-unifier/SKILL.md:318) |
| "the SDD has a new version" | user or Review Panel -> Implementation Designer | Refresh offer (step 3c) |
| "run step 5" / "add the use-case diagrams" | user -> Requirements | Gated diagram step (G1-G3 verified) |
| "generate the implementation plan / test cases / ppt" | user -> Requirements | Gated delivery chunks (G1-G5 verified) |
| "generate the e2e design" | user -> Architect | Gated chunk 19 (E1-E4 verified) |

Done evidence is defined per hand-off. A row turns `Done` on the user's word, or when the owner's own record shows it: BRD, a consistency run in chunk 14 after the review; SDD, a Reconciled entry after the review with its step 6a order evidence; LLD, 16 §19.1 naming the new SDD version (business-reviewer-unifier/apply-and-verify.md:247-252). An owner that finds a review hand-off already taken says so, with the version that took it, and the launcher counts that answer as `Done` (`09-open-decisions.md` D12, decided 2026-10-08).

### 5.5 Sub-agent jobs as a first-class primitive

Cleared-context dispatch is the suite's core quality mechanism: the reviewer must not remember authoring the document. The platform should model each dispatch as a job with inputs (files, brief), outputs (files written or rows returned), and a status.

| Job | Parent agent | Count per full run | Writes |
|---|---|---|---|
| Research agents | Discovery | 6, parallel | research bundle (notes only) |
| Investor assessor | Discovery | 1 | chunk 23 |
| Adversarial reviewer | each doc agent | 1 per review pass | the open-items chunk (24 / 13 / 18 / 18); the BRD, SDD, and LLD reviewers return the text for the parent to insert unchanged when they cannot write files |
| Consistency checker | Requirements | up to 3 runs per session | CF-NN rows |
| Faithfulness checker | Architect | 1 per chunk-19 write | verdict + mismatch list (no file writes) |
| Code explorer | Implementation Designer | 1 (from-code/hybrid) | structured notes with file:line citations |
| Docs architect | Implementation Designer | 1 (from-code/hybrid) | per-service narratives |
| Persona reviewers | Review Panel | 5, parallel | findings lists |
| Remnant hunter | Review Panel | 1 | verification report |

### 5.6 Capability matrix per agent

| Capability | Discovery | Requirements | Architect | Impl. Designer | Review Panel |
|---|---|---|---|---|---|
| Sub-agent dispatch | yes | yes | yes | yes | yes |
| Human question UI | yes | yes | yes | yes | yes |
| Web research | required for chunks 06-11 (no skill-defined degraded mode) | no | no | no | no |
| Codebase read access | no | no | optional (brownfield) | required (from-code/hybrid) | no |
| Mermaid validation | no (no diagrams) | yes | yes | yes | no |
| Miro integration | no | optional | optional | optional | no |
| Excel export | optional | no | no | no | no |
| Long-context reads (whole documents) | yes | yes | yes | yes | yes |

## 6. The human in the loop

The user is the product owner. Every agent recommends; the human decides. Some human tasks happen outside the platform today, and the agents track them as evidence-bearing checklist items rather than pretending they ran:

| External task | Tracked where | Evidence accepted |
|---|---|---|
| grill-me stress-test session on the BRD | BRD `14-todo.md` step 3 | The product manager's dated confirmation (a grill-me agent is a natural future addition) |
| Figma mockups + review + play-through | BRD `14-todo.md` step 4 | Mockup coverage rows Approved, Figma links, dated confirmation |
| External provider API documentation | SDD chunk 11, `TBD - external` contracts | The provider document, cited as Source document |
| SME domain confirmation | Review Panel tracker header | User confirmation of the inferred domain |
| Approver sign-off | Document cover blocks | The user naming the approver |

## 7. Extension points for future role agents

The platform will add Developer, DevOps, Engineering Manager, Tester, and other role agents. The suite already defines their handoff surface:

1. **The Implementation Designer is the bridge.** Its output is written to be consumed directly by an AI implementer: per-service files with class signatures, method-level pseudocode, pattern rationale, and workflow blocks per use case.
2. **The Specs chunk is the constitution.** `lld-[slug]/17-specs.md` (Mission, Tech Stack, Roadmap, Project Type) is designed to be read verbatim by speckit `/constitution`. Any code-generation agent should treat it as binding.
3. **The runtime `use_case` convention is the observability contract.** Entry points carry `@UseCase("KEY/UC-NN")`, a `use_case` MDC log field and span attribute, and route data (`data.screen`, `data.useCases`). Developer agents must honor it so the § 19.9 index stays true in production.
4. **The task and test registries are ready for Tester and DevOps.** BRD chunk 15 (TASK-NN with `Ready for test` and `Accepted` milestones) and chunk 16 (TC-[AREA]-NN with per-case `Needs`) define the delivery-tracking contract; LLD § 16.8 defines the e2e spec tagging contract.
5. **New agents should follow the same contract pattern:** declared artifacts consumed and produced, stable IDs owned by one document, handoffs as confirmed phrases, decisions always routed to the human with a recommendation and a Why.

A Developer agent, when added, consumes `lld-[slug]/` and `17-specs.md`, writes `source/`, and answers to the use-case trace; the fixtures already exercise a read-only `source/` tree with this shape.
