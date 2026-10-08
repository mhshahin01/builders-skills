# Discovery Analyst (pre-brd-unifier)

Stage 1 (Discovery) of the documentation pipeline described in [01-pipeline-overview.md](01-pipeline-overview.md): the agent that answers "is this worth building?" before any requirements are written (pre-brd-unifier/README.md:3). Built on the `pre-brd-unifier` skill: 22 analysis frameworks across five tiers, a mechanical go/no-go Scoreboard (chunk 22), an independent Investor Assessment (chunk 23), and a reviewer-authored Open Items and Assumptions Log (chunk 24).

## 1. Role card

| Field | Value |
|---|---|
| Product name | Discovery Analyst |
| Underlying skill | `pre-brd-unifier` |
| Mission | Turn an idea, notes, a brief, or a SoW into a sourced, computed, adversarially reviewed pre-BRD with two reconciled go/no-go verdicts, ready to feed the Requirements agent. |

**Job description (paste-ready for the agent-creation UI):**

> You are the Discovery Analyst, the first agent in the product documentation chain. Your job is to answer "is this worth building?" before any requirements are written: you take an idea, notes, a concept brief, or a Scope of Work and produce a pre-BRD covering 22 analysis frameworks across five tiers, ending in a go/no-go Scoreboard and an independent Investor Assessment. You run multi-agent web research so every market figure carries a source; unverifiable values become [NEEDS CLARIFICATION: <question>], never invented numbers. You compute every derived value (RICE, TAM/SAM/SOM, EFAS/IFAS weighted scores, Porter's averages, composites) from stated formulas and never hardcode them. You fill only the Answer slots of the template; guidance and sample content are read-only. You dispatch a skeptical investor subagent and a cleared-context reviewer subagent, then present the Markdown deliverable and stop: you produce Excel only after the user explicitly approves the Markdown. You state each shared fact once in its home chunk and link to it elsewhere (01: problem, target segment, UVP, key features, business model, success metrics; 02: vision; 03: channels and cost structure; 21: phase roadmap). You never use em dashes, and you write UTF-8 with LF line endings and unwrapped pipe tables.

Job-description sources for the one-home rule, the em-dash rule, and the output conventions: (pre-brd-unifier/SKILL.md:69-70, 107).

**Capability and model requirements:**

| Capability | Requirement |
|---|---|
| Sub-agent dispatch with fresh context | Required. Up to eight dispatches per run: six research agents in a GENERATE run (pre-brd-unifier/research-orchestration.md:7; a TRANSFORM run researches only the 06-11 frameworks its source leaves empty, pre-brd-unifier/transform-detection.md:13), one investor agent (`subagent_type: startup-business-analyst:startup-analyst`), one cleared-context reviewer (`subagent_type: general-purpose`) (pre-brd-unifier/SKILL.md:92, 98), plus reviewer re-dispatches (Section 8). The investor type is an agent of the separate startup-business-analyst plugin; where the platform lacks it, the skill's fallback is to "take on the role its brief describes" (pre-brd-unifier/SKILL.md:30), so ship an equivalent skeptical early-stage investor persona. |
| Human question UI | Required for intake, mode, lens, and approvals: "numbered questions, each with options, tradeoffs, and your recommendation first" (pre-brd-unifier/SKILL.md:31). |
| Web research backend | Required for chunks 06-11. The skill defines no fallback mode: without a web backend, every figure the agent cannot source becomes `[NEEDS CLARIFICATION: <question>]` (pre-brd-unifier/SKILL.md:65; pre-brd-unifier/research-orchestration.md:20). A degraded-mode banner is a product addition (Section 11). |
| Mermaid validation | Not required; this agent emits no diagrams. |
| Miro | Not used by this skill. |
| Excel integration | Optional. Python 3 with `openpyxl` for the on-demand export (pre-brd-unifier/xlsx-export.md:10). |
| Workspace file access | Read/write to the shared project root; the skill bundle (`chunks/`, `reference/`) stays read-only (pre-brd-unifier/SKILL.md:116). |
| Model assignment (product recommendation; the skill sets no model tiers) | Assign a strong reasoning model to the main context: figure reconciliation and go/no-go coherence are judgment-heavy. The six research subagents tolerate a cheaper model. Keep the investor and reviewer on fresh contexts: a reviewer pass run in the same context is "weaker than Claude's fresh-context review" (README.md:522). |

**Position in a team:** chain start. Sole member of the Solo preset (Discovery only); holds the Discovery seat in the Full preset (Discovery, Requirements, Architect, Implementation Designer, optional Review Panel). Hands off to the Requirements agent ([03-agent-brd.md](03-agent-brd.md)) through the handoff launcher; see [07-collaboration-flows.md](07-collaboration-flows.md).

## 2. When to include this agent

| Preset | Discovery Analyst seated? | Consequence |
|---|---|---|
| Solo (Discovery only) | Yes, it is the whole team | Deliverable is the pre-BRD and its verdicts; nothing downstream runs. |
| Standard (Requirements + Architect) | No | Viable because "a BRD can also start straight from a SoW, spec, or old BRD" (README.md:30). |
| Full | Yes | Discovery feeds Requirements; the Review Panel may later challenge the pre-BRD ([06-agent-business-reviewer.md](06-agent-business-reviewer.md)). |

Seat the Discovery Analyst when the real question is "should we build this": new product ideas without a committed scope, new-market entries, portfolio triage, sponsor or investor material. Skip it when scope is already committed (a signed SoW, a won RFP, an internal mandate) or when a validated pre-BRD already exists in the workspace.

What is lost without it:

- No sourced market sizing or competitor scan; the BRD's market-context paragraph has nothing to cite.
- No mechanical go/no-go and no independent investor challenge before requirements effort is spent.
- No MoSCoW/RICE priorities to decide BRD scope and wishlist (brd-unifier/sow-transformation.md:181).
- No A-NN assumption register for the BRD to cite as `pre-BRD 24, A-NN` (brd-unifier/sow-transformation.md:185).
- No upstream open-items register; risks surface later, inside requirements, where they cost more to resolve.

## 3. Artifacts consumed

Inputs are light: an idea or topic seed and optional source documents for a transform.

| Artifact | Path pattern | Owner | How used |
|---|---|---|---|
| Idea / topic seed | Conversation context | User | Drives intake and the default GENERATE run (pre-brd-unifier/transform-detection.md:6). |
| Transform source (notes, concept brief, SoW, older pre-BRD) | User-supplied path or pasted document | User | Read fully and mapped to the 22 frameworks; verbatim numbers, dates, and named commitments preserved; research fills only what the source leaves empty (pre-brd-unifier/transform-detection.md:10-14). |
| Intake answers | Conversation | User | Product idea, target segment, geography, currency, hard constraints; the internal facts behind IFAS (11) (pre-brd-unifier/SKILL.md:77). |
| Project instruction file | `AGENTS.md` or `CLAUDE.md` at project root | Workspace | Not read by this skill: pre-brd-unifier names no project-file default. Its "`CLAUDE.md` defaults" row (pre-brd-unifier/SKILL.md:29) is the generic portability mapping and applies only where a skill names such a default. |
| Web sources | External (Statista, Gartner, IBISWorld, Crunchbase/PitchBook, Google Trends, government statistics portals, vendor sites) | Research subagents | Sourced figures for chunks 06-11, each cited inline with its year (pre-brd-unifier/research-orchestration.md:19-22). |
| Template skeletons | `pre-brd-unifier/chunks/*.md` | Skill bundle (read-only) | Authoritative section skeletons; never renamed, never modified during a run (pre-brd-unifier/SKILL.md:19, 62, 116). |
| Reference workbook and cell map | `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx`, `reference/cell-map.json` | Skill bundle (read-only) | Styling and formula source plus the writable-cell whitelist for the export (pre-brd-unifier/xlsx-export.md:6). |

## 4. Artifacts produced

| Artifact | Path pattern | Purpose |
|---|---|---|
| Chunked folder (default) | `./pre-brd-[project-slug]/` (slug is "kebab-case from the project name", pre-brd-unifier/SKILL.md:104) | The deliverable: master index plus one file per framework. |
| Master index | `./pre-brd-[project-slug]/00-pre-brd-master.md` | Index of all 24 chunks; an index only, it tracks no progress ("the pre-BRD and LLD masters are indexes", README.md:49). |
| Framework chunks 01-21 | `NN-short-title.md` (pre-brd-unifier/SKILL.md:105), each saved "under the same filename" as its skeleton (pre-brd-unifier/modes.md:9) | Tier 1 idea definition (01-05), Tier 2 market and competition (06-12), Tier 3 prioritization (13-15), Tier 4 strategy and planning (16-21). |
| Scoreboard | `22-executive-summary-scoreboard.md` | Mechanical go/no-go composite (Section 9). |
| Investor Assessment | `23-investor-assessment.md` | Independent skeptical-investor verdict with the lens line on top. |
| Open Items and Assumptions Log | `24-open-items-and-assumptions-log.md` | Reviewer output (the export step also records VRIO overflow here, Section 7): OI-NN register, A-NN Assumptions Log, Resolution Log, Reviewer Notes. The only companion register; there is no Changes Log and no decision register. |
| Combined file | `./PRE-BRD-[ProjectName]-v1.1.md` | Single-file variant with a table of contents; the Investor Assessment and Open Items become sections; no chunk comment blocks (pre-brd-unifier/modes.md:25). |
| Conversion output | `./PRE-BRD-[ProjectName]-v1.1-MERGED.md` | Chunks-to-combined conversion; originals kept (pre-brd-unifier/modes.md:31). |
| Excel export (on approval only) | `./PRE-BRD-[ProjectName]-v1.1.xlsx` | Clone of the reference workbook (77 formula cells, whitelisted writable cells), produced only after Markdown approval (pre-brd-unifier/xlsx-export.md:3, 6). |

**Chunk comment block:** every chunk file keeps its skeleton's comment block, which opens with `PRE-BRD CHUNK: NN`, `TITLE:`, and `TIER:`; the output adds a `PROJECT:` line and sets `PART OF:` to `PRE-BRD - [Project Name]` (pre-brd-unifier/modes.md:9-19). The Requirements agent detects a pre-BRD by these blocks and the `00-pre-brd-master.md` index (brd-unifier/transform-detection.md:51-52).

**Versioning rules (deliberately minimal):** the `v1.1` in the filenames is a fixed template version, not a revision counter. There is no version-bump rule and no document status field. Updates are regeneration by pass: "Update any source chunk and re-run the investor pass" (pre-brd-unifier/chunks/23-investor-assessment.md:62) and "Update any source file and regenerate this scoreboard" (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:63). Stability lives in the IDs: OI-NN is "Stable across revisions" (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:22), and the Resolution Log records each item's resolution date, location, and outcome. Effective states: `in-progress -> presented (step 7) -> approved -> exported (optional)`.

## 5. Invocation and arguments

CLI forms (pre-brd-unifier/README.md:50): `/pre-brd-unifier chunks` (Claude Code), `$pre-brd-unifier chunks` (Codex), `/skill:pre-brd-unifier chunks` (Kimi Code). Plain-language triggers also work ("validate this idea with a pre-BRD", README.md:530). In the product, expose the arguments as run-configuration fields (output shape, optional source document), not as a raw command line.

| Argument | Action (pre-brd-unifier/SKILL.md:43-48) |
|---|---|
| `chunks` | CHUNKS mode, skip the prompt. This is the default. |
| `combined` | COMBINED mode, skip the prompt. |
| (empty) | Run the interactive output-format prompt (Section 6, row 1). |
| anything else | State valid options; treat as empty and prompt. |

Behavior rules:

- "Excel is NOT a mode." (pre-brd-unifier/SKILL.md:56). No argument, flag, or UI toggle may schedule the xlsx at run start; export is a post-approval action (Section 9).
- An implied output shape skips the prompt: "If the user already implied a shape, do not ask." (pre-brd-unifier/SKILL.md:54)
- Cross-mode conversion runs on request in both directions, keeping originals (pre-brd-unifier/modes.md:29-32).
- Mid-run mode change: "If nothing is written yet, switch silently. If some output exists, finish the current file, then offer the conversion; never silently delete produced output." (pre-brd-unifier/modes.md:36)
- Resume (product behavior; the skill defines no resume): the master is an index, not a progress tracker, so an interrupted run resumes by re-running the pass over the same folder. Present re-runs in the UI as regeneration, not as a new version. The mid-run mode-change rule above applies only when the user changes the output shape mid-run.

## 6. Conversation flow

Every user-facing prompt, in order. Where the skill fixes the wording, the text is quoted verbatim; where it fixes only the topic, the product renders a labeled field and the table says so.

| # | Trigger | Exact text / topic | Options | Default | Skip condition |
|---|---|---|---|---|---|
| 1 | Run starts with no mode argument | "**Output format?** [chunks / combined] - default `chunks` (press Enter to accept)." (pre-brd-unifier/SKILL.md:52) | `chunks`; `combined` (aliases: `c`, `single`, `one file`; empty, Enter, and `y` also select chunks) | `chunks` | Argument supplied, or shape already implied (pre-brd-unifier/SKILL.md:54). |
| 2 | Intent ambiguous between generate and transform | "Generate a fresh pre-BRD from the idea, or transform an existing document you'll provide?" (pre-brd-unifier/transform-detection.md:19) | Generate; Transform | Generate | A file or pasted document is present (lean transform), or only an idea is present (generate) (pre-brd-unifier/transform-detection.md:17-18). |
| 3 | Intake, at most 4 questions (pre-brd-unifier/SKILL.md:77) | Topics only: "product idea/concept; target segment/customer; geography/market footprint; currency + hard constraints". Render as four labeled fields. | Free text per field | None | Each question is skipped when its answer is already in context. |
| 4 | Investor lens ambiguous | Topic only: venture-return vs business-case lens. The skill infers it "from intake (no external raise, internal sponsor/budget, B2B/internal user base) or ask if ambiguous" (pre-brd-unifier/SKILL.md:94). Render as a two-option selector. | Venture-return; Business-case | Venture-return | Intake makes the lens unambiguous. |
| 5 | Step 7: deliverable presented | Present the Markdown with its inventory (Section 13), then: "Stop. Do not produce Excel." (pre-brd-unifier/SKILL.md:82). Render as an approval checkpoint (Section 12). | Approve; Request changes; (after approval) Export Excel | Wait for the user | Never skipped. |
| 6 | Export request after approval | Approval phrases: "export excel" / "looks good, generate the sheet" (pre-brd-unifier/SKILL.md:83). | Run export; Stay in Markdown | No export | Locked until explicit approval; the UI must not suggest export before the Markdown is approved. |

Product note: rows 1, 2, and 4 map to decision-queue items with recommended defaults; row 3 maps to an intake form; rows 5 and 6 map to gates (Section 9).

## 7. Work pipeline

| Stage | Actor | Sub-agent dispatches | Fresh context? | Outputs |
|---|---|---|---|---|
| 1. Resolve mode and intent | Main context | None | n/a | Mode (chunks/combined), intent (generate/transform) |
| 2. Intake | Main context + user | None | n/a | Intake answers feeding tiers 1, 3, 4 and the internal facts of IFAS (11) |
| 3. Research fan-out | Six research subagents, one per chunk 06-11, "parallel, dispatched in a single message" (pre-brd-unifier/research-orchestration.md:3), each owning exactly one chunk and blind to the others | Up to 6 | Yes, one independent context each | Sourced research bundle: Answer slots with `value`, `source`, `year`, `assumption`, every magnitude carrying an explicit scope label and year (pre-brd-unifier/research-orchestration.md:25-27) |
| 4. Synthesis and fill | Main context, single-threaded by design: "This step runs in the main context, not as an agent, so cross-chunk coherence is preserved" (pre-brd-unifier/research-orchestration.md:30) | None | n/a | Chunks 01-22: shared figures reconciled to canonical values (07 Canonical figures table), chunks 06-11 written, derived totals computed, SWOT (12) derived from EFAS/IFAS (never researched), tiers 1/3/4 authored from intake plus bundle, Scoreboard (22) computed |
| 5. Investor pass | Dedicated subagent `startup-business-analyst:startup-analyst`, framed as "a skeptical early-stage investor", read access to chunks 01-22 (pre-brd-unifier/SKILL.md:92) | 1 | Yes | `23-investor-assessment.md`; "The investor never edits chunks 01-22; it only authors chunk 23." (pre-brd-unifier/SKILL.md:92) |
| 6. Reviewer pass | Subagent `general-purpose` with "no authoring memory", reviewing chunks 01-23 (pre-brd-unifier/SKILL.md:98) | 1, plus re-dispatches (Section 8) | Yes, cleared | `24-open-items-and-assumptions-log.md`; the reviewer never edits chunks 01-23 |
| 7. Present and stop | Main context | None | n/a | Inventory summary (Section 13). "Stop. Do not produce Excel." (pre-brd-unifier/SKILL.md:82) |
| 8. Export (optional) | Main context + Python engine | None | n/a | `PRE-BRD-[ProjectName]-v1.1.xlsx`; VRIO overflow recorded in the Open Items log, chunk 24 (pre-brd-unifier/xlsx-export.md:56) |

Total: up to 8 sub-agent dispatches per run (fewer research agents in TRANSFORM, Section 1), more when the reviewer is re-dispatched. Chunk 12 (SWOT) and chunk 22 (Scoreboard) are never agents; they are derived in synthesis (pre-brd-unifier/research-orchestration.md:5). The step 7 stop is a hard product gate: no auto-continuation into export or handoff, even on a Go verdict.

**Research briefs (stage 3).** "Each agent's prompt must name its single target chunk and return only that chunk's Answer slots." (pre-brd-unifier/research-orchestration.md:16)

| Agent | Brief and limits (pre-brd-unifier/research-orchestration.md:9-14) |
|---|---|
| 06 Market Comparison | The top 5 competing products, each with provider, best-for, key features, pricing model, weaknesses, positioning, and tech stack; plus a feature comparison matrix marking each feature `Available` / `Not available` per competitor. |
| 07 Market Sizing | TAM/SAM/SOM sized top-down (global market, region share, % relevant) and bottom-up (addressable customers x ARPU); every figure with a source and its assumption. |
| 08 PESTLE | Political, Economic, Social, Technological, Legal, and Environmental factors, each with a sourced rationale. |
| 09 Porter's Five Forces | Each force scored 1 to 3 with a one-line rationale. |
| 10 EFAS | Exactly 5 external factors, at least one opportunity; weights from 0 to 1 summing to 1.0; ratings from 1 to 5. |
| 11 IFAS | Exactly 4 internal factors, at least one strength; same scales. Internal facts (team, budget, assets, capabilities) come from the intake; research covers only the benchmarks that rate them. |

The Workflow-tool accelerator runs only "when the user explicitly opts into multi-agent orchestration" (pre-brd-unifier/research-orchestration.md:40). Stage 4 fill rules: fixed rows, variable rows (06, 07 Canonical figures, 13, 15, 16, 18, 21), and per-persona blocks (04, 05) (pre-brd-unifier/frameworks.md:13-17).

## 8. Review and decision loops

**The chunk 24 reviewer pass.** A cleared-context reviewer hunts "unsourced/shaky market numbers, competitor coverage gaps, cross-chunk figure inconsistencies ..., cross-tier incoherence ..., and weak go/no-go logic" (pre-brd-unifier/SKILL.md:98). Every finding follows the chunk 24 schema: Where, Type, Concern, Options (at least 2 with tradeoffs), Recommended Answer (required, ready to apply), Why (required; "Never empty, never \"best option\"", pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:28), Status: Open.

**Zero findings are rejected.** "If it returns zero findings, re-dispatch with stronger adversarial framing." (pre-brd-unifier/SKILL.md:98). The skill leaves the loop open-ended; the platform must cap it (recommended: two re-dispatches) and then escalate to the decision queue. Tracked in [09-open-decisions.md](09-open-decisions.md).

**Registers.**

| Register | ID scheme | Notes |
|---|---|---|
| Open Items | OI-NN, "Stable across revisions" (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:22) | Type enum: "Unsourced figure / Figure inconsistency / Coverage gap / Cross-tier incoherence / Weak verdict logic / Ambiguity / Risk" (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:24). Owner: the cleared-context reviewer. |
| Assumptions Log | A-NN | Every material assumption with its basis and the risk if wrong; the BRD cites rows as `pre-BRD 24, A-NN`. |
| Resolution Log | References OI-XX | Resolution date, resolved-in location, outcome per item. |
| Reviewer Notes | None | Free-form. |

Open-item Status enum: "Open / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected" (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:29). Reuse these exact strings in the decision queue (see [08-states-and-vocabulary.md](08-states-and-vocabulary.md)). The Resolution Log uses a different Outcome enum: "Accepted recommendation | Adjusted: short note | Deferred | Rejected" (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:67).

**No in-skill resolution walkthrough, by design.** Unlike the BRD and SDD agents, this agent never walks the user through its open items: "the pre-BRD leaves the items for you and your team to decide" (README.md:54), and the reviewer "authors this chunk only - it never edits chunks 01-23" (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:7). Decisions happen downstream (the Requirements agent carries each open item as a `[NEEDS CLARIFICATION: ...]` marker at the BRD homes that took its content, and each A-NN that BRD content rests on as a numbered 02 assumption, brd-unifier/sow-transformation.md:185) or on later update runs. The platform therefore owns the loop: surface chunk 24 items as decision-queue batches, record the user's Status transitions, and feed resolutions into the next regeneration pass or the BRD handoff. Never auto-apply a Recommended Answer.

## 9. Gates and states

**Scoreboard (chunk 22), mechanical.** Five signals, each scored 1-5, weight 0.2, composite equals the sum of score times weight, rounded to two decimals (pre-brd-unifier/frameworks.md:24):

| Signal | Source | Mapping |
|---|---|---|
| Market Attractiveness | SAM value from 07, in USD | USD 500M or more = 5; USD 100M or more = 4; USD 25M or more = 3; USD 5M or more = 2; below USD 5M = 1 (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:26) |
| Problem / Solution Fit | EFAS (10) opportunity rows | Weighted average rating of the opportunity rows (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:27) |
| Feasibility | IFAS (11) strength rows | Weighted average rating of the strength rows (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:28) |
| Competitive Risk | Porter's (09), inverted | 7 - 2 x Porter's average threat (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:31) |
| Strategic Fit | EFAS (10) and IFAS (11) totals | (EFAS total + IFAS total) / 2 (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:32) |

Thresholds: "4.0 and above = Go; 3.0 to 3.99 = Conditional Go; below 3.0 = No-Go" (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:34). A one-line sensitivity check is mandatory: "state whether a single ±1 notch on any one signal would flip the verdict band" (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:34).

Round each signal score to one decimal (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:24). A SAM in another currency is converted to USD at the canonical exchange rate, which the Canonical figures table in 07 holds (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:26; pre-brd-unifier/chunks/07-market-sizing-analysis.md:22). Chunk 22 ends with prioritized "Conditions to resolve before full commitment": "Condition 1 is always the lowest-scoring signal (the first in table order on a tie)" (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:53-55).

Scoring gates: the dependency table is verified before scoring; a missing or flagged source makes the corresponding signal inherit a `[NEEDS CLARIFICATION]`; EFAS opportunity-row weights or IFAS strength-row weights that sum to zero produce "[NEEDS CLARIFICATION: the selected factors have zero total weight]" and block both that score and the composite (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:30; pre-brd-unifier/frameworks.md:36).

**Investor Assessment (chunk 23), judgment.** Seven aspects scored 0 to 10: Market opportunity & timing (0.20), Problem / solution fit & differentiation (0.15), Competitive moat & defensibility (0.15), Business model & unit economics (0.15), Go-to-market & traction potential (0.10), Team & execution capability (0.10), Financial viability & return potential (0.15) (pre-brd-unifier/chunks/23-investor-assessment.md:35-41). "Per-aspect scores are judgment; the composite is computed, not hardcoded." (pre-brd-unifier/SKILL.md:92). Bands: "Go ≥ 7.0, Conditional Go 5.0 to 6.9, No-Go < 5.0" (pre-brd-unifier/chunks/23-investor-assessment.md:16).

**Reconciliation requirement.** The investor "must reconcile its verdict with the mechanical Scoreboard (22): agree and reinforce, or disagree and explain" (pre-brd-unifier/SKILL.md:92), recorded in the "[Agree / Disagree]" field (pre-brd-unifier/chunks/23-investor-assessment.md:58). "Chunks 22 and 23 must not contradict chunks 01-21." (pre-brd-unifier/SKILL.md:68). Render the two verdicts side by side and flag an unreconciled Disagree as a decision-queue item.

**Approval gates.**

| Gate | Rule |
|---|---|
| Presentation stop | Step 7 presents and halts: "Stop. Do not produce Excel." (pre-brd-unifier/SKILL.md:82) |
| Excel lock | Export runs only on explicit approval phrases; "Never emits Excel from the argument or before the user approves the Markdown." (pre-brd-unifier/SKILL.md:113) |
| Handoff lock (product addition; the skill locks only the Excel export, pre-brd-unifier/SKILL.md:82-83) | The handoff launcher to the Requirements agent unlocks at Markdown approval and fires only on the user's word (Section 10). brd-unifier itself accepts any pre-BRD as a TRANSFORM source (brd-unifier/transform-detection.md:47-55). |
| Scoreboard gate | Chunk 22 is generated only after its dependencies are filled (pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:10). A missing or flagged source makes its signal inherit a `[NEEDS CLARIFICATION]` marker; the signal's score and the composite are withheld only while the EFAS opportunity or IFAS strength weights sum to zero (pre-brd-unifier/frameworks.md:36). |
| Review gate | Zero-finding reviews are rejected and re-dispatched (pre-brd-unifier/SKILL.md:98). |

**Other state vocabulary:** lens marker "Active lens: [Venture-return | Business-case]" (pre-brd-unifier/chunks/23-investor-assessment.md:12); roadmap row Status, for example "Not started, In progress, Done, At risk" (pre-brd-unifier/chunks/21-roadmap-project-plan.md:14); gap markers `[NEEDS CLARIFICATION: <question>]`, which stay inline in chunks 01-23 rather than being copied into chunk 24 (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:14); EFAS and IFAS Type letters `O`/`T` and `S`/`W`, by which the scoreboard selects the opportunity and strength rows (pre-brd-unifier/chunks/10-efas.md:14; pre-brd-unifier/chunks/11-ifas.md:14; pre-brd-unifier/xlsx-export.md:40).

## 10. Handoffs

**Downstream: the Requirements agent ([03-agent-brd.md](03-agent-brd.md)).** This agent's one-line contract: "Feeds into the BRD: a validated pre-BRD supplies the problem statement, target users, market context, and prioritized scope for `brd-unifier` (stage 2, Requirements)." (pre-brd-unifier/README.md:68). What this agent must guarantee so the contract holds:

| Contract item | Exact rule | Source |
|---|---|---|
| Naming | Keep the `./pre-brd-[slug]/NN-*.md` folder, the skeleton filenames, and each chunk's comment block stable; the BRD links them as `[pre-BRD 07 Market Sizing](../pre-brd-[slug]/07-market-sizing-analysis.md)` and detects a pre-BRD by the `00-pre-brd-master.md` index and the `PRE-BRD CHUNK: NN` comment blocks (Section 4). | brd-unifier/sow-transformation.md:190; brd-unifier/transform-detection.md:51-52 |
| Verdict citation | "Cite the verdict (`Go`, `Conditional Go`, or `No-Go`) with a link; never restate the scores." Chunks 22 and 23 must therefore each carry one unambiguous verdict word. | brd-unifier/sow-transformation.md:184 |
| Non-blocking verdict | "A `No-Go` or `Conditional Go` verdict does not block the BRD. Name it, with its conditions, in the handoff." That handoff is the Requirements agent's own step 9 summary (brd-unifier/SKILL.md:288-290); this agent guarantees the conditions exist: chunk 22 "Conditions to resolve before full commitment" and chunk 23 "Conditions to clear". | brd-unifier/sow-transformation.md:191; pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:53; pre-brd-unifier/chunks/23-investor-assessment.md:57 |
| One fact, one home | "Market figures and scores stay in the pre-BRD: cite them with a link, never copy them (one fact, one home)." | brd-unifier/sow-transformation.md:174 |
| Marker carry-over | "An inline `[NEEDS CLARIFICATION: ...]` marker in pre-BRD chunks 01-23 goes where its content goes." A marker on content the BRD only links (market figures, scores, team) stays in the pre-BRD. | brd-unifier/sow-transformation.md:193 |
| Assumption citation | Keep A-NN IDs stable; the BRD cites them as `pre-BRD 24, A-NN`, and open items become markers at the specific BRD homes that took the concerned content. "A marker asks one question: an item about two things gives two markers, each at the home of its own content." | brd-unifier/sow-transformation.md:185 |
| Consistent chunks | State each shared fact once (Section 1). When two parts of the source disagree on something the BRD takes, the BRD uses "the version from the part this file maps to that BRD home, as a proposal that names the other part", and flags both versions when neither part maps there. | brd-unifier/sow-transformation.md:19 |

Wire this handoff through the handoff launcher: it phrases a task for the Requirements agent naming the pre-BRD folder as its source, and it runs only on the user's word, never auto-triggered. The Requirements agent names a No-Go or Conditional Go verdict, with its conditions, in its own handoff summary (Non-blocking verdict row). Once the Markdown is approved, treat the folder as read-only input to the Requirements agent; the Review Panel may still edit it (below).

**Review Panel ([06-agent-business-reviewer.md](06-agent-business-reviewer.md)).** A business review may change the pre-BRD: a decision "writes Answer cells only, with sourced figures, and recomputes the derived values it affects" (scores, sizes, the Tier 5 composite), and chunk 23 "is not rewritten: the close-out notes that its verdict predates the change" (business-reviewer-unifier/apply-and-verify.md:65-71). The pre-BRD gets no version or changelog; the tracker's Versioning block lists the changed chunks (business-reviewer-unifier/apply-and-verify.md:98-100). The changes reach the Requirements agent through the "update the todo: decisions from the business review of [the tracker's Created date] ([tracker path])" request for the BRD made from this pre-BRD, "the pre-BRD's only hand-off" (business-reviewer-unifier/apply-and-verify.md:205-210); brd-unifier takes a review's hand-off once (brd-unifier/SKILL.md:318).

**Upstream:** none. This agent is the chain start; its only inputs are the idea seed and optional transform sources (Section 3).

## 11. Edge cases and failure modes

| Case | Expected behavior | Product handling |
|---|---|---|
| From-scratch (GENERATE, default) | Full research fan-out; frameworks authored from intake plus the bundle (pre-brd-unifier/transform-detection.md:6). | Default run type. |
| Transform (notes, brief, SoW, older pre-BRD) | Read the source fully; preserve verbatim numbers, dates, named commitments; research only frameworks the source leaves empty (hybrid acceptable); flag every unmapped template requirement (pre-brd-unifier/transform-detection.md:10-14). | Source upload field in the run configuration. |
| No web research backend | The skill defines no separate mode: research-dependent figures it cannot source become `[NEEDS CLARIFICATION]`; "Never invent market numbers." (pre-brd-unifier/SKILL.md:65) | Degraded-mode banner on the run (product addition); expect a higher marker count and show it. |
| Divergent agent figures | Reconcile to one canonical, scope-labeled value stated once in the Canonical figures table in 07: "Divergent numbers for the same pool are a defect the reviewer will flag." (pre-brd-unifier/research-orchestration.md:31) | Surface reconciliation choices in the run log for audit. |
| TAM top-down vs bottom-up over 3x apart | "keep the average and add `[NEEDS CLARIFICATION: <both values and the question that would reconcile them>]`" (pre-brd-unifier/frameworks.md:20). | Show both estimates in the chunk 07 view with the flag. |
| Zero-finding review | Reject and re-dispatch with stronger adversarial framing (pre-brd-unifier/SKILL.md:98). | Cap re-dispatches (recommended 2), then escalate to the decision queue. |
| Enterprise / internal initiative | Swap to the business-case lens with the same aspects, weights, scale, and verdict bands; one-line lens note at the top of chunk 23 (pre-brd-unifier/SKILL.md:94). | Lens selector at intake; lens badge wherever chunk 23 is shown. |
| Partial information | Internal facts the intake does not give get `[NEEDS CLARIFICATION: <question>]`, never web guesses (pre-brd-unifier/research-orchestration.md:14). "Never silently drops a framework; an empty framework keeps its heading with a flagged note." (pre-brd-unifier/SKILL.md:117) | Marker count on the dashboard; the intake form prompts for missing internal facts on update runs. |
| Sub-agent capability missing entirely | The main context runs each pass separately: "run the step yourself as a separate pass: re-read the files from disk, set aside your drafting reasoning, and follow the same brief" (pre-brd-unifier/SKILL.md:30). Research still runs, in the main context. | Feature-detect at agent setup; warn that adversarial-review quality drops without fresh contexts. |

## 12. UI and productization requirements

**Screens and dashboards.**

| Surface | Contents |
|---|---|
| Tier progress board | Chunks 01-24 grouped by the five tiers, per-chunk state (pending / researched / filled / flagged), with live counts of `[NEEDS CLARIFICATION]` markers, open items, and distinct sources. |
| Research fan-out view | Up to eight job cards per run (up to 6 research agents, investor, reviewer): status, target chunk, source count, duration. Reviewer re-dispatches appear as new cards. |
| Dual scoreboard gauges | Chunk 22: five-signal table with weights, composite, band thresholds (4.0 / 3.0), and the sensitivity-check line. Chunk 23: seven-aspect scorecard with composite, bands (7.0 / 5.0), the Why, and the [Agree / Disagree] reconciliation line. Flag an unreconciled Disagree, and a chunk 23 verdict that predates a Review Panel change (Section 10). |
| Approval checkpoint | The step 7 gate: inventory (Section 13), the verdict pair, Approve and Request-changes actions. Unlocks the Excel export and the handoff button (the handoff lock is a product addition; the skill locks only the Excel export, pre-brd-unifier/SKILL.md:82-83). |
| Excel export action | Post-approval only; runs the Python engine; reports the output path and reminds the user to open the file in Excel so formulas recompute (pre-brd-unifier/xlsx-export.md:16). The payload maps all 22 framework chunks, because the engine blanks every whitelisted answer cell before writing (pre-brd-unifier/xlsx-export.md:44-45). Content beyond a sheet's capacity is overflow: fill the most material rows and note the rest, "never silently truncate" (pre-brd-unifier/xlsx-export.md:57); RICE holds one initiative in Excel (pre-brd-unifier/frameworks.md:41). |
| Run log | Reconciliation decisions, re-dispatches, and gate transitions, for audit of a nondeterministic pipeline. |

**Decision queue items** (vocabulary per [08-states-and-vocabulary.md](08-states-and-vocabulary.md)):

- Intake answers (a batch of at most 4 fields).
- Output-format and lens selections when ambiguous, each with a recommended default.
- Chunk 24 open items in batches, each showing the reviewer's Recommended Answer and Why; transitions limited to the Status enum; nothing auto-applied.
- Markdown approval (the gate sign-off) and, after it, the optional Excel export approval.
- Handoff launch to the Requirements agent; fires only on the user's word.

**Hard to productize.**

- External research dependency: figures come from Statista, Gartner, IBISWorld, Crunchbase/PitchBook, Google Trends, government portals, and vendor sites (pre-brd-unifier/research-orchestration.md:19). Runs are long and nondeterministic. Ship a degraded-mode banner (product addition; the skill has no separate no-research mode) and make the resulting marker counts visible so the quality loss is legible.
- Judgment-heavy reconciliation: canonical-figure selection and Tier-5 coherence run in the main context by design (pre-brd-unifier/research-orchestration.md:30); they are not checklist-automatable. Log every reconciliation decision.
- Two verdict engines that must stay reconciled; per-aspect investor scores are judgment, only the composite is computed (pre-brd-unifier/SKILL.md:92).
- The zero-finding re-dispatch loop is open-ended in the skill; the platform must bound it (Section 8).
- Excel export covers only the 22 frameworks: the Investor Assessment (23), the Go-To-Market section of 21, and the Canonical figures table of 07 have no sheet and stay Markdown-only (pre-brd-unifier/xlsx-export.md:46). Set that expectation in the export UI.

## 13. Handoff inventory

The step 7 presentation (pre-brd-unifier/SKILL.md:82) is this agent's completion contract. The final summary, and the run-complete screen, must surface:

| Field | Source |
|---|---|
| Chunks/sections produced, with the folder or combined-file path | "chunks/sections" (pre-brd-unifier/SKILL.md:82) |
| `[NEEDS CLARIFICATION]` count | inventory item (pre-brd-unifier/SKILL.md:82) |
| Open-items count (size of the OI-NN register) | "open-items count" (pre-brd-unifier/SKILL.md:82) |
| Source count | "source count (distinct source links cited across the chunks)" (pre-brd-unifier/SKILL.md:82) |
| Investor verdict | "the investor verdict (Go / Conditional / No-Go + composite)" (pre-brd-unifier/SKILL.md:82) |
| Scoreboard composite and band (product addition) | chunk 22 Result table |
| Active lens (product addition) | chunk 23 lens line |
| Handoff button state (product addition) | Locked until Markdown approval (Section 9). |

After presentation the run halts: "Stop. Do not produce Excel." (pre-brd-unifier/SKILL.md:82). Once approved, the folder stands as read-only input to the Requirements agent; the Review Panel may still edit its Answer cells (Section 10).
