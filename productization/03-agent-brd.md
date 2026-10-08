# Requirements Analyst (brd-unifier)

This chapter specifies the platform agent built on the `brd-unifier` skill: what it is for, what it reads and writes, how the user talks to it, and which platform capabilities it needs. For the agent model and team presets, see `00-vision-and-model.md`; for the pipeline order, see `01-pipeline-overview.md`; for shared state names, see `08-states-and-vocabulary.md`.

## 1. Role card

- **Product agent name:** Requirements Analyst
- **Mission (one line):** Owns the business source of truth: turns discovery output, contracts, legacy documents, and conversation into the BRD that every downstream agent cites, and carries it across the delivery gate to final.

**Paste-ready job description (agent-creation UI):**

> You are the Requirements Analyst. You author and maintain the project's Business Requirements Document, the single home of business facts, in business language only: the WHAT, never the technical HOW. You express requirements as per-persona use cases (Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules & Constraints / Acceptance Criteria / Future Enhancements / UI/UX), one detailed chunk per persona, and you derive the Users & Use Cases Matrix from them, never writing a matrix cell that contradicts a use case. You transform Scopes of Work, pre-BRDs, and older BRDs into the same template, flagging every gap with `[NEEDS CLARIFICATION: ...]` instead of inventing content. You dispatch an independent reviewer, walk the product owner through every open item, and close each generation with the product-manager delivery checklist (`14-todo.md`); only when its gate opens do you produce the implementation plan, the UAT/BAT test cases, and the presentation brief. You keep UC IDs, persona names, and integration partner names stable so the Architect and the Implementation Designer can cite them with links.

**Capability and model requirements:**

- Strong long-form structured writing and document transformation; the BRD is the most prose-heavy artifact in the pipeline.
- Discipline under a plain-language rulebook (`writing-style.md`: 13 rules plus a word list, and a mandatory pass) and under a "never invent" constraint: missing facts become markers, not plausible filler.
- Sub-agent dispatch with fresh context (mandatory reviewer pass; preferred consistency-check subagent).
- Human question UI with batched decision questions (up to 4 items per call).

**Tools and integrations required:** shared-workspace file read/write; sub-agent dispatch; question UI; Mermaid authoring and validation (the Mermaid CLI only with the user's yes; see §11); optional Miro integration (boards only on explicit request); handoff launcher entries for the grill-me session and the Figma/mockup brief (both external, human-run).

**Position in a team:** sits between the Discovery Analyst (`02-agent-pre-brd.md`) and the Architect (`04-agent-sdd.md`); the Implementation Designer (`05-agent-lld.md`) reads its delivery chunks. Core member of the Standard and Full presets; absent in Solo.

## 2. When to include this agent

| Team preset | Include? | Why |
|---|---|---|
| Solo (Discovery only) | No | The user only wants to know whether the idea is worth building; no requirements baseline is produced yet. |
| Standard (Requirements + Architect) | Yes | This agent is the front half of the preset: no BRD, no sound SDD. |
| Full (Discovery, Requirements, Architect, Implementation Designer, optional Review Panel) | Yes | Central: it consumes the pre-BRD and feeds both design agents. |

**What is lost without it:** there is no stable business source of truth. Personas, use cases, the who-may-do-what matrix, business NFRs, and integration expectations have no single home, so the Architect and Implementation Designer cite nothing stable, and technical mandates from source material have no parking place. The Architect's own skill steers around a missing BRD rather than absorbing its job: "This skill recommends running `brd-unifier` first (SoW → BRD), then `sdd-unifier` (BRD → SDD)" (sdd-unifier/source-transformation.md:23), and its intent detection says "if there's no BRD yet, suggest running brd-unifier first" (sdd-unifier/transform-detection.md:22). An SDD derived straight from a SoW comes out heavy with clarification markers; the BRD step is what settles the business questions first.

## 3. Artifacts consumed

| Artifact | Path pattern | Owner | How used |
|---|---|---|---|
| pre-BRD folder (chunked) or combined file | `pre-brd-[slug]/` with `00-pre-brd-master.md`, or `PRE-BRD-*.md` | Discovery Analyst | Transform source: take the idea, users, scope, and priorities; verdict and market figures are cited by link, never copied (brd-unifier/sow-transformation.md:172-185). |
| SoW / Statement of Work / RFP scope | user-provided path | Product owner | Transform source; numbers, dates, and named commitments preserved verbatim; commercial sections and RFP artefacts dropped (brd-unifier/sow-transformation.md:226-237). |
| Existing or legacy BRDs (any format) | user-provided path, or an existing `./brd-[slug]/` | Product owner | Transform (cross-template migration), targeted update, merge, or re-chunk. |
| `AGENTS.md` / `AGENT.md` | project root | Development team | Governs generation when present: connects related use cases, journeys, integrations (brd-unifier/SKILL.md:99, principle 16). Never asked for when absent. |
| `ui-ux-global-constitution.md` | project root | Design lead | UI/UX standard for chunk 11, the step 4 mockups, and chunk 17; tokens named, sections cited by name, never raw hex, never numbers (brd-unifier/SKILL.md:99). |
| grill-me decision list | conversation hand-back | Product owner (external grill-me session) | Applied on "update the todo" through the step 8 mechanics; consistency check rerun; to-do refreshed (brd-unifier/SKILL.md:318). |
| Business review tracker | `review-comments-tracker.md` at project root | Review Panel (`06-agent-business-reviewer.md`) | Hand-off is taken once (a repeat applies only `Decided - pending application` items); it checks the decisions the review already applied (never re-applies them), closes the open items they answer, and raises to-do items for open remainders (brd-unifier/SKILL.md:318). |
| Conversation / topic seed / meeting notes | none (chat) | Product owner | GENERATE source: raw context for a fresh BRD, not a transform target (brd-unifier/transform-detection.md:28-29). |

## 4. Artifacts produced

| Artifact | Path pattern | Purpose |
|---|---|---|
| BRD body chunks 00-13 | `./brd-[slug]/NN-short-title.md` (optional letter: `06a`, `06b`, one per persona) | The business source of truth: cover and changes log (00), context and objectives (01), glossary/assumptions/dependencies (02), domain concepts (03), scope and personas (04), journeys and Use Case Summary (05), detailed per-persona use cases (`06*`), Users & Use Cases Matrix (07), integrations (08), reporting (09), business NFRs (10), summary and UI/UX (11), appendix incl. Technical Inputs for the SDD (12), open items from the reviewer (13). |
| Master index | `./brd-[slug]/[project-slug]-brd-master.md` | Navigation graph, Generation Progress table (parts mode state), Delivery Chunks state table. Read first by downstream agents. |
| To-do (delivery chunk 14) | `./brd-[slug]/14-todo.md` | The product-manager checklist: five ordered steps, open-items register, consistency findings, delivery gate block. Written on every full generation unless the user explicitly asks for the BRD alone ("BRD only", "skip the to-do"), which the handoff reports (brd-unifier/delivery-chunks.md:68); excluded from merge. |
| Gated delivery chunks 15-17 | `./brd-[slug]/15-implementation.md`, `16-uat-bat-test-cases.md`, `17-for-ppt.md` | Implementation plan, UAT/BAT test cases, presentation and video brief. Written only when the delivery gate is open, in the fixed order 14 -> 15 -> 16 -> 17. |
| Decision register | `./brd-[slug]/decision-log.md` | Companion decision history (clarification Q&A, markers, business review records, part handoffs). Created on first use; linked from the master and chunk 00; never merged. |
| Combined BRD (COMBINED mode) | `./BRD-[ProjectName]-v[X.X].md` at project root | Single-file form of chunks 00-13; 15 and 16 appended as its last two sections once the gate opens; 14 and 17 stay files in `brd-[slug]/`. |
| Merged BRD (on request) | `./brd-[slug]/BRD-[ProjectName]-v[X.X]-MERGED.md` | Concatenation of the chunks, written inside the chunk folder: "(the same folder as the chunks, so relative links keep working)" (brd-unifier/SKILL.md:315). Excludes 14, 17, and `decision-log.md`. |

**Versioning:** "One update, one version" (brd-unifier/delivery-chunks.md:438). First build is 1.0; only content changes to chunks 00-13 bump the version (one minor step per update); each Changes Log row ends with a `Chunks:` list; the first build's row ends `Chunks: none (initial build)`; no two rows share a version. Status, link, and delivery-tracking updates bump nothing. A BRD that already has versions, moved from another format or an older template into this one, takes "one minor step above its last version"; a major step only when the user asks (brd-unifier/delivery-chunks.md:438). During the first build the version stays 1.0 and the one "Initial draft" row is dated when part 3 completes (brd-unifier/parts-mode.md:122). A content change to an `Approved` BRD sets the cover Status to `In Review` (brd-unifier/delivery-chunks.md:454).

**Chunk inventory** (the progress board renders this map):

| Chunk | File | Content | In merged BRD |
|---|---|---|---|
| 00 | `00-cover-and-changelog.md` | Title block, version, author, status, Changes Log, Table of Contents, Figures and Tables indices | Yes |
| 01 | `01-executive-summary-and-context.md` | Executive summary, background, business objectives | Yes |
| 02 | `02-glossary-assumptions-facts.md` | Glossary, assumptions, facts, challenges, dependencies | Yes |
| 03 | `03-definitions-and-domain-concepts.md` | Domain concepts (may split `03a`/`03b`) | Yes |
| 04 | `04-scope-and-personas.md` | In scope / out of scope, personas | Yes |
| 05 | `05-user-journeys-overview.md` | Persona journeys, Summarized Workflow, Use Case Summary; use-case diagrams slot gated to to-do step 5 | Yes |
| 06a+ | `06a-use-cases-[persona-slug].md`, `06b-...` | Detailed use cases, one chunk per persona, nine sub-sections each; per-UC flowchart slot gated to step 5. With more than 6 personas, minor ones may share a chunk named in its title (for example `06c-use-cases-viewers.md`, brd-unifier/chunking.md:102) | Yes |
| 05 (collapsed) | `05-user-journeys-and-use-cases.md` | Chunk 05 and the detailed use cases in one file: only in a new BRD written `whole` with 6 or fewer use cases and one or two personas; never in `parts` and never on a re-chunk (brd-unifier/chunking.md:103) | Yes |
| 07 | `07-users-use-cases-matrix.md` | Users & Use Cases Matrix, derived from the use cases | Yes |
| 08 | `08-integrations.md` | Business-level integrations | Yes |
| 09 | `09-reporting-and-analytics.md` | Reports and dashboards | Yes |
| 10 | `10-nfrs.md` | Non-functional requirements in business language | Yes |
| 11 | `11-summary-and-uiux.md` | Summary and UI/UX expectations | Yes |
| 12 | `12-appendix-and-wishlist.md` | Appendix incl. Technical Inputs for the SDD (verbatim parking); wishlist | Yes |
| 13 | `13-open-items-and-clarifications.md` | Reviewer output: the OI register with Resolution Log and Reviewer Notes | Yes |
| 14 | `14-todo.md` | Product-manager checklist (living; every generation) | No, never merged |
| 15 | `15-implementation.md` | Dependency-ordered implementation plan (gated) | Yes, merged after 13 once it exists |
| 16 | `16-uat-bat-test-cases.md` | UAT/BAT test cases (gated) | Yes, merged after 13 once it exists |
| 17 | `17-for-ppt.md` | Executive presentation brief and 30-second videos (gated) | No, never merged |
| - | `[project-slug]-brd-master.md` | Master index: navigation, Generation Progress, Delivery Chunks state | n/a |
| - | `decision-log.md` | Companion decision register | No, never merged |

## 5. Invocation and arguments

**Command forms per platform** (brd-unifier/SKILL.md:34): Claude Code `/<skill-name> <args>`; Codex `$<skill-name> <args>`; Kimi Code `/skill:<skill-name> <args>`. On this platform, the launcher sends the task phrase to the Requirements Analyst agent; the arguments below are part of that phrase.

**Arguments** (brd-unifier/SKILL.md:42): `brd-unifier [chunks|combined] [parts|whole]`, in any order. `chunks` / `combined` set the **output mode**; `parts` / `whole` set the **generation option**. Either can be left out.

| Argument | Meaning | Action |
|---|---|---|
| `chunks` | Multi-file chunked output | Skip the mode prompt; CHUNKS mode. |
| `combined` | Single consolidated file | Skip the mode prompt; COMBINED mode; always generated `whole`. |
| `parts` | Three parts, stop for review after each | Default in CHUNKS mode. |
| `whole` | Chunks 00-14 in one run | Always in COMBINED mode; always for pure conversions and targeted updates. |
| (nothing) | No choice made | Resume check first; then the interactive mode prompt. Defaults: CHUNKS mode, `parts` generation. |
| anything else | Unrecognised | State the valid options; ask to re-invoke or treat as empty and prompt (brd-unifier/SKILL.md:49). |

Terminology collision: see `08-states-and-vocabulary.md`. (This skill says "output mode" and "generation option"; the LLD skill says "shape" and "direction/mode".)

**Interactive mode prompt, exact text** (brd-unifier/SKILL.md:55):

> **Output format?** [chunks / combined] - default `chunks` (press Enter to accept).
>
> - **`chunks`** (default): multi-file layout; one `.md` per template section grouping. Matches the embedded `chunks/*.md` skeleton.
> - **`combined`**: single monolithic `.md` file matching `TEMPLATE-COMBINED.md`.

Acceptance mapping (brd-unifier/SKILL.md:62-64): empty / Enter / `y` / `yes` / `chunks` / `default` -> CHUNKS; `combined` / `c` / `single` / `one file` / `merged` -> COMBINED; anything else re-prompts once, then defaults to CHUNKS with the fallback noted in the handoff. A mode implied by the request ("give me the full doc in one file") skips the question entirely.

**Words count as arguments** (brd-unifier/SKILL.md:76): "all at once", "in one go" mean `whole`; "part by part", "step by step" mean `parts`. `combined parts` is not available: the agent says so in one line and continues in `whole` (brd-unifier/SKILL.md:77).

**Resume check** (brd-unifier/SKILL.md:109): runs before any mode question. If `./brd-[slug]/[project-slug]-brd-master.md` exists and its Generation Progress shows a part `Pending` or `In progress`, the run is a resume in the existing mode. A legacy plain `brd-master.md` is renamed to `[project-slug]-brd-master.md` with `MASTER:` footers and links repointed (not a content change). An empty request gets "Continue with part N?" and waits; "continue" / "next part" / "part N" starts that part; anything else is done first, with the waiting part named. A completed part is never rewritten on resume; only the back-fill touches it. "Just finish it" switches to `whole` for the remaining parts, recorded as `Generation: parts, completed whole from part N` (brd-unifier/parts-mode.md:147).

## 6. Conversation flow

Every user-facing prompt, in pipeline order. The platform renders each through the question UI; defaults are preselected.

| # | Trigger | Exact text | Options | Default | Skip condition |
|---|---|---|---|---|---|
| 1 | No mode argument, no BRD in progress | "**Output format?** [chunks / combined] - default `chunks` (press Enter to accept)." with the two bullets of §5 | chunks / combined | chunks | Mode argument passed, mode implied in the request, or resume |
| 2 | CHUNKS mode, pacing not mentioned (announcement, not a question) | "Generation: parts (default). Say 'whole' to get everything in one go." (brd-unifier/SKILL.md:75) | n/a | parts | Never asked as a question; pacing words in the request count as the argument |
| 3 | Request says "HLD" unqualified | One short question: business or technical (brd-unifier/SKILL.md:11-12) | business HLD (this agent) / technical HLD (route to the Architect) | none | Context already decides |
| 4 | Source material present, intent ambiguous | "Is this material **a source for a fresh BRD** (I'll author from it) or **an existing BRD I should reformat into your template** (I'll re-shape it)?" (brd-unifier/transform-detection.md:154) | fresh BRD / reformat | none | Decision tree decides; asked exactly once, never twice |
| 5 | Before part 1 | Intake: at most three questions: project/system name; source material; personas (brd-unifier/SKILL.md:120-128) | free text | none | Answer already in the conversation or the source material, or in `AGENTS.md` / the constitution (the name is asked only "if neither the request nor the source states it", brd-unifier/SKILL.md:124) |
| 6 | Resume with an empty request | "Continue with part N?" (brd-unifier/SKILL.md:109) | continue / any other request | wait | Request non-empty (act on it instead) |
| 7 | End of parts 1 and 2 | Part summary, then: "Say 'continue' for part N, or tell me what to change first." (brd-unifier/parts-mode.md:56) | continue / corrections | stop and wait | `whole` generation (no checkpoints) |
| 8 | A part-1/2 correction removes a persona | One question per use case whose Primary Actor it was, recommendation first (brd-unifier/parts-mode.md:62) | reassign to persona X / remove the use case | none | The user already said which; the persona was only a Supporting Actor |
| 9 | After chunk 13 is written (acceptance loop) | Batched decision question, up to 4 items per call; each item shows Recommended Answer and Why (brd-unifier/SKILL.md:243) | **Accept recommendation** (recommended, listed first) / **Choose option [B/C]** / **Defer** / Other (free text; "a rejection is typed through Other") | Accept recommendation | Zero open items; "later" / "I'll review offline" leaves every item `Open` |
| 10 | First acceptance-loop batch, no constitution, no brand/key color in source | The brand/key color question, asked once (brd-unifier/SKILL.md:99,243) | free text | none; chunk 11 holds a clarification marker until answered | Constitution exists, or the source states a color |
| 11 | Chunk 17 requested and audience/purpose/length not stated | Asked in the handoff; written as `Recommendation:` (brd-unifier/delivery-chunks.md:340) | free text | Recommendation | Already stated by the user |

## 7. Work pipeline

| Stage | What happens | User-visible effect |
|---|---|---|
| 0. Mode and resume | Argument parsing, resume check (§5) | Mode prompt or resume line |
| 1. Intent detection | GENERATE (fresh, from conversation/seed) vs TRANSFORM (re-shape a source), per the decision tree (brd-unifier/transform-detection.md:11-30) | At most one disambiguation question |
| 2. Intake | At most three blocking questions (§6 row 5) | Short question batch |
| 3. Internal plan | Enumerate chunks (one `06*` per persona, plus 14) and the Mermaid diagrams each carries | None |
| 4. Part 1 | Chunks 00-05 plus the master with its Generation Progress table. Settles why the product exists, business terms, scope, personas, journeys, the use-case list | Plain-language pass, exit checklist, part summary, **stop and wait** |
| 5. Part 2 | Every `06*` chunk (nine sub-sections per use case), then step 6a (matrix), then back-fill of 00-05 | Plain-language pass, exit checklist, part summary, **stop and wait** |
| 6. Part 3 | Chunks 08-12, back-fill, plain-language pass (step 6b), then the review, acceptance loop, and to-do | Full handoff (step 9) |
| 7. Step 6a: derived matrix | The Users & Use Cases Matrix is built from the completed use cases: columns are the chunk 04 personas, rows the UC IDs, cells `Yes`/`-` with footnoted conditional access; cross-checked both directions; a UC is the source of truth and is fixed first on a mismatch (brd-unifier/SKILL.md:180-189) | Matrix chunk 07 |
| 8. Step 6b: plain-language pass | Mandatory reread of every written/changed chunk against `writing-style.md`; vague words become facts or markers; no number, rule, or exception is dropped. Repeated on delivery chunks at the end of 8a (brd-unifier/SKILL.md:192) | None (quality gate) |
| 9. Step 7: cleared-context review | **Sub-agent dispatch (mandatory):** `Agent` tool with `subagent_type: general-purpose`; "The subagent starts with no conversation memory, which is the point." (brd-unifier/SKILL.md:204). Writes chunk 13 directly; "When it cannot write files, it returns the text and the main agent inserts it unchanged" (brd-unifier/SKILL.md:212). Runs once, in part 3, on the whole BRD; on later updates see "On an update" in §8 | Chunk 13 appears |
| 10. Step 8: acceptance loop | Batched decision questions over every OI (§6 rows 9-10); accepted answers applied as plain present-tense requirement text after every item is decided; decisions logged to `decision-log.md` | Decision queue batches |
| 11. Step 8a: the to-do | `14-todo.md`: open-items register, consistency check run 1, grill-me inputs, mockup coverage, step 5 tracking, delivery gate block (`Shut` on a first run) | To-do dashboard data |
| 12. Step 8b: gated diagram step (later invocation) | Verifies G1-G3 against the files; draws use-case diagrams in 05 and flowcharts in qualifying `06*` use cases; then reruns the consistency check including C9 (brd-unifier/SKILL.md:274), preferably through the cleared-context checker sub-agent (brd-unifier/delivery-chunks.md:165) | Diagrams appear |
| 13. Step 8c: gated delivery chunks | Re-verifies G1-G5, writes 15, checks again, writes 16, checks again, writes 17. A gap found while writing becomes a `TD-NN`, the affected content is labelled `Provisional (TD-NN)`, the chunk in hand is finished, and the next chunk is not started | Delivery chunks appear, or the shut-gate list |
| 14. Step 9: handoff | The full summary (§13) | Final message |

**Named sub-agent dispatches:** (1) the mandatory cleared-context reviewer of step 7; (2) the consistency check, which prefers "a cleared-context subagent (same independence reasoning as SKILL.md step 7)... The subagent is read-only and returns `CF-NN` rows" (brd-unifier/delivery-chunks.md:165), run inline only if the Agent tool is unavailable. Both require the platform's fresh-context dispatch capability.

**Back-fill and exit checklists** (brd-unifier/parts-mode.md:39-47,72-97):

- Later parts change earlier chunks: new terms, assumptions, and dependencies go to 02; new domain rules to 03; the Use Case Summary (05) follows the detailed use cases; figures, tables, and Table of Contents indices in 00 are updated. A back-fill that touches personas or scope is flagged as a change to what the user approved in part 1.
- UC IDs the user has seen are never renumbered and never reused: an added use case takes the next free ID; a merged one keeps its row marked `Merged into UC-NN`; a removed one keeps its row marked `Removed: [reason]`.
- Every part ends with a fixed exit checklist (persona coverage, matrix derivation, no gated diagrams drawn, no decision-process narration in content chunks); failures are fixed or flagged before the part summary.
- The master's Generation Progress is the resume record: part 3 records each step (`08-12 written`, `13 written`, `acceptance loop done`) and becomes `Complete` when chunk 14 is written; chunk 00 shows `Draft - part N of 3` until then.

**Update requests (later invocations):**

- "regenerate chunk N", "update section X": targeted regeneration of that chunk or section only; if use cases change, the matrix is re-derived (step 6a); a content change (one version bump, §4) then reruns the consistency check, refreshes `14-todo.md`, and marks existing chunks 15-17 `Stale` when their source meaning changed (brd-unifier/SKILL.md:317).
- "redo part N": rewrite that part's chunks, keeping every decision taken since; when part 3 was complete this is a content change: bump the version, update chunk 13 by status only (the reviewer runs again only if the user asks), rerun the consistency check, refresh `14-todo.md`, and mark existing 15-17 `Stale` when their source meaning changed (brd-unifier/parts-mode.md:145).
- "TASK-NN is ready for test", test results handed back, "is TASK-NN done?": delivery tracking, "not a refresh, so it needs no gate check", and it changes no version. `Ready for test` only on the delivery team's confirmation (date and who); `Accepted` only when every required case of the task passes; a refresh that changes a task's Expected deliverables sets it back to `In progress` (brd-unifier/SKILL.md:321; brd-unifier/delivery-chunks.md:250-255,436).
- Refresh triggers: at the start of every run, a `Basis:` (15, 17) or `Baseline:` (16) older than the current BRD version means `Stale` (brd-unifier/delivery-chunks.md:456). Other changes (an open item decided or deferred, a use case changed, added, or removed, scope, NFR, integration, report, or UI/UX standard changes, mockups changed after approval, `AGENTS.md` or the constitution changed, a logo provided) follow the trigger table: chunk 14 is always updated, and 15-17 are refreshed only while the gate is open, marked `Stale` where the table says so (brd-unifier/delivery-chunks.md:415-429).

## 8. Review and decision loops

**The cleared-context adversarial reviewer (step 7).** Independence is the mechanism: the authoring context "anchors on what was written and tends to confirm rather than challenge. The reviewer's job is gap-finding, not validation" (brd-unifier/SKILL.md:200). Rules:

- **External findings only.** Inline `[NEEDS CLARIFICATION: ...]` markers stay in the body; they do not move into Open Items (brd-unifier/SKILL.md:210).
- **Coverage record.** The top of Reviewer Notes carries one row per risk area: scope, use-case exception coverage, matrix consistency, NFRs, integrations, security/privacy, data lifecycle; each row names what was checked and its result, either `N findings (OI-NN, ...)` or `No issue found` (brd-unifier/SKILL.md:213); an area the reviewer could not check says `Not checked` and why (brd-unifier/chunks/13-open-items-and-clarifications.md:88), which triggers a re-dispatch.
- **Zero findings is valid** "when every area is checked"; a weak finding is never raised to fill a row.
- **Re-dispatch criteria:** "Re-dispatch only when an area is unchecked or a finding lacks evidence, and name that area or finding in the new brief" (brd-unifier/SKILL.md:213).
- **On an update** (brd-unifier/SKILL.md:198): the reviewer runs for the first build and for "the first substantive migration into the current schema when prior review evidence does not cover its risk areas"; a missing chunk 13 requires a review (steps 7-8 first; if the user declines, the to-do says so and its register is built from the inline markers and chunk 02 only, brd-unifier/delivery-chunks.md:464). A later content change uses the scoped consistency check; a new full review runs only when the user asks; a pure merge or re-chunk is not a migration review.

**OI schema (exact fields)** (brd-unifier/chunks/13-open-items-and-clarifications.md:26-35):

| Field | Content |
|---|---|
| ID | `OI-NN`, stable across revisions |
| Where | Section, UC ID, or "global" |
| Type | Gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / Duplication |
| Concern | One paragraph |
| Options | A/B/C with one-line tradeoffs (at least 2 where a choice exists) |
| Recommended Answer | "the concrete resolution text, written so it can be pasted into the BRD as-is" (brd-unifier/SKILL.md:209) |
| Why | REQUIRED, never empty, never "best option" |
| Status | See below |

**Statuses** (brd-unifier/chunks/13-open-items-and-clarifications.md:35): `Open` / `Decided - pending application` / `Accepted - applied` / `Adjusted - applied` / `Deferred` / `Rejected`. Applied items keep their heading, Status, and a Resolution Log link; Open, Deferred, Decided - pending application, and Rejected items keep their full blocks.

**Resolution Log** (brd-unifier/chunks/13-open-items-and-clarifications.md:80-82): columns ID, Resolution Date, Resolved In, Outcome; Outcome is `Accepted recommendation` / `Adjusted: short note` / `Deferred` / `Rejected` / `Settled by business review [point ID]`.

**Acceptance loop mechanics** (brd-unifier/SKILL.md:243-251):

- Accepted answers are applied only after every item in the loop is decided, as plain present-tense requirement text: the chunk never keeps a "resolved on" stamp, an option letter, or a progress note, and any inline marker the decision clears is removed.
- A difference in a number or a link only, against a rejected or deferred item, is carried; the item stays `Accepted - applied` and its decision record names the change. An answer that needs content a rejected or deferred item would have added is not applied: the user is asked again with an adjusted recommended answer (`Adjusted - applied` once accepted), or the item is deferred.
- Every decision is recorded in `decision-log.md` (question, options, chosen answer, who decided, date, the Why) with a `Rule home:` link; a superseding decision keeps both records. If a change touches actors or permissions, the matrix is re-verified against the step 6a rules.
- Deferred and Rejected items keep their entry with rationale and get a Resolution Log row; they are not applied.

**decision-log.md registers** (brd-unifier/decision-log.md:39-92): Clarification register (`Q-NN` entries), Marker register, Business review register (one record per business review point), Walkthrough and delegation history (Action entries), Per-decision ecosystem assessments, Part N handoff record. Every settled-rule entry carries a `Rule home:` link that must resolve. Footer: `COMPANION FILE: decision history; not part of the numbered chunk sequence`.

**Consistency check** (brd-unifier/delivery-chunks.md:163-192). Checks: C1 Conflicting requirements, C2 Terminology, C3 Scope, C4 Duplicated requirements, C5 Missing requirements, C6 Broken references, C7 Use case vs acceptance criteria, C8 Derived views, C9 Diagrams vs narrative (only after to-do step 5), C10 Delivery chunks vs body (chunk 14 at every write; 15-17 once they exist).

- **Run numbering:** a new checklist starts at Run 1; an existing one appends the next free number. "One request through its handoff is a session, with at most three runs regardless of their stored numbers" (brd-unifier/delivery-chunks.md:165). First run full (00-13); later runs scoped.
- **CF-NN dispositions:** `Corrected ([where], [date])` / `Open item raised: OI-NN / TD-NN` / `Deferred for clarification: TD-NN` / `No change ([who], [why])` / `Decided - pending application: TD-NN` (a correction to chunks 00-13 found by the session's third run or after it, brd-unifier/delivery-chunks.md:190). Business ambiguities are never resolved silently: they become open items.
- **What the agent corrects without the user** (`Corrected`, brd-unifier/delivery-chunks.md:186): a broken link or filename; a cross-reference whose title identifies its target; a matrix cell contradicting the use-case actor fields (the use case wins; if the actor field looks wrong, raise an open item instead); a Use Case Summary title differing from the use-case heading (the heading wins); a spelling or casing variant of a Glossary term (the Glossary wins); a wrong count, figure number, table number, or index row (the counted content wins); a rule restated outside its home with the same meaning (the home wins and the copy becomes a link); a statement that settles what an open item or clarification marker still asks, with no decision record behind it (the open question wins and the statement points to it without choosing). Any other correction needs the user's confirmation, given directly or through an applied decision that the correction only carries to text that still contradicts it or leaves it out.

## 9. Gates and states

**The delivery gate** (brd-unifier/delivery-chunks.md:24-68). Exact condition names:

| # | Condition | Verified by |
|---|---|---|
| G1 | To-do step 1 is `Complete`: every `TD-NN` row is `Resolved` | No `TD-NN` or `OI-NN` `Open`, `Deferred`, or `Decided - pending application`; no `[NEEDS CLARIFICATION: ...]` marker left in chunks 00-12, proposals included |
| G2 | To-do step 2 is `Complete`, and none of its findings is waiting on a decision or its application | A check run follows the last relevant content change with ordered evidence; every `CF-NN` dispositioned |
| G3 | To-do step 3 is `Complete` | The product manager confirmed the grill-me session (date recorded) and every decision is applied |
| G4 | To-do step 4 is `Complete` | Every mockup row `Approved`; review and play-through confirmed and dated; Figma links in the UC UI/UX or owning no-UC section |
| G5 | To-do step 5 is `Complete` | Diagrams in 05; every qualifying UC has its flowchart (3+ Main Flow steps and at least one decision point; others skipped with a recorded reason); all Mermaid parses; consistency check rerun |

**The five to-do steps behind the gate** (exact names, fixed order, brd-unifier/chunks/14-todo.md:32-36):

1. Resolve open items and clarifications
2. Run a consistency check across all BRD chunks
3. Finalise requirements with the grill-me skill
4. Generate mockups in Figma
5. Update the use-case chunks with use-case diagrams and flowcharts

Step status values: `Not started` / `In progress` / `Blocked` (by what) / `Pending gate` (only new or unstarted step 4 and 5 rows while G1-G3 do not hold) / `Complete` (evidence mandatory) (brd-unifier/delivery-chunks.md:125). A `Complete` step returns to `In progress` when its own inputs change; unchanged completed rows keep their evidence.

**The open-items register (to-do step 1)** (brd-unifier/chunks/14-todo.md:78-80; brd-unifier/delivery-chunks.md:141-159): columns ID, Priority, Kind, Source (chunk / identifier), Decision or clarification needed, Blocks, Owner, Status.

- Kind: `Open question` / `Assumption to validate` / `Pending decision`. One row per distinct question. A pending dependency or an unconfirmed assumption that also carries a clarification marker gets one row only when the marker asks its own question; otherwise the marker is an `Open question` row and the dependency or assumption keeps its own `Assumption to validate` row.
- Priority comes from what the item blocks, never from guessed business value. P1: a Main Flow step or an acceptance criterion cannot be built or tested as written, the source says the point must be settled before build starts, or a dependency is needed before the build of a use case. P2: alternate/exception flows, an NFR measure, an integration, or a report, or a dependency needed before BAT sign-off or go-live. P3: wording, presentation, or a design choice that changes no flow. Every priority blocks the gate.
- Status: `Open` / `Decided - pending application` / `Resolved` (with pointer) / `Deferred` (with rationale; keeps the gate shut).
- Owners are never guessed: the person the user named, otherwise the BRD author from chunk 00, written as `Recommendation: [name]` (brd-unifier/delivery-chunks.md:127).

**What it locks:** generation or refresh of chunks 15, 16, and 17. "These three chunks cannot be generated or refreshed until chunk 14 is cleared: all five to-do steps `Complete` with evidence and every to-do item `Resolved`. `Deferred` does not count as closed. There is no override, even when the user asks for the chunks directly." (brd-unifier/SKILL.md:278). A shut gate means no draft, preview, or outline, "in a file or in the chat" (brd-unifier/delivery-chunks.md:44).

**Evidence rules:** conditions are verified against the files, never from status cells alone; "Generating a checklist is never evidence that a decision or review happened" (brd-unifier/SKILL.md:96); a step is `Complete` only when its Evidence cell names what was checked, when, and by whom; the product manager's confirmation is valid evidence for steps 3 and 4 only, recorded with the date; "A user's 'I take responsibility' is not evidence for any step." (brd-unifier/SKILL.md:283).

**The gated diagram step (8b)** verifies G1-G3 only: step 4 mockups are not a precondition, and steps 4 and 5 run in parallel once G1-G3 hold.

**Chunk states** for 15-17: `Locked` / `Up to date` / `Provisional (TD-NN)` / `Stale`. `Provisional (TD-NN)` means the item was raised by writing that very chunk; `Stale` means anything that happened after the chunk was finished; a chunk can be both, and then shows `Stale`. The state is kept in three places, always the same and written in the same run: the chunk's status line, its Downstream outputs row in 14, and its State cell in the master's Delivery Chunks table; setting a state is a status mark, not a write, so a shut gate allows it (brd-unifier/delivery-chunks.md:55).

**External human steps:** the grill-me session (step 3) and the Figma mockups (step 4) are external human tasks the agent tracks in `14-todo.md` but never performs or claims; see §12.

## 10. Handoffs

### Upstream

| From | Trigger phrase | Contract |
|---|---|---|
| Discovery Analyst (pre-BRD transform) | Any request that names the pre-BRD, for example "turn the pre-BRD into a BRD" (an example phrase: detection is by artifact, brd-unifier/transform-detection.md:20-21) | Detected by `pre-brd-[slug]/` with `00-pre-brd-master.md` or a `PRE-BRD-*.md` file. "The verdict word (`Go`, `Conditional Go`, or `No-Go`) is named next to its link... that is a citation, not a copy" (brd-unifier/sow-transformation.md:174). "A `No-Go` or `Conditional Go` verdict does not block the BRD. Name it, with its conditions, in the handoff." (brd-unifier/sow-transformation.md:191). Markers on content the BRD takes are carried over, naming the pre-BRD chunk; assumptions the BRD rests on become numbered 02 assumptions citing their row. |
| Review Panel (business review) | "update the todo: decisions from the business review of [the tracker's Created date] ([tracker path])" (business-reviewer-unifier/apply-and-verify.md:205-206) | Taken once: "first check whether an earlier update took this review: a Changes Log row, a Business review register entry in `decision-log.md`, or a chunk 14 consistency run whose Trigger names this review, newer than the review's own Changes Log row, that records its hand-off". If one did and the review has no row after it, the hand-off is already taken: say so with that version, apply any `Decided - pending application` items, and change nothing else; a new consistency run for the review runs only when the user asks; if the review has rows after it, only those rows are handled (brd-unifier/SKILL.md:318). Otherwise apply `Decided - pending application` items first, then the confirmed decisions through the step 8 mechanics. Decisions the review already applied are checked, not applied again: the open items they answer are closed with no new Changes Log entry (the version bumps only if this request changes chunks 00-13 itself) and no Clarification register record. Rerun the consistency check (a full run, then scoped reruns, at most three runs per session; the run's Trigger names the review by its date and tracker path); refresh 14. "Each closed item's Resolution Log row has the Outcome "Settled by business review [point ID]", and each clarification marker a review decision removed gets a Marker register entry naming the point" (brd-unifier/SKILL.md:318). When the hand-off names pre-BRD chunks the review changed (the BRD gets this hand-off even when the review did not change it, business-reviewer-unifier/apply-and-verify.md:207-210), the BRD text taken from them is rechecked: a changed persona, scope item, priority, or verdict word changes the BRD chunk that holds it; a linked figure needs no edit. Open remainders raise a `TD-NN` each, plus an `OI-NN` when the remainder is a business choice; a missing fact stays TD-only. A change to chunks 00-13, by the review or by this request, marks existing 15-17 `Stale` when their source meaning changed; a use-case change re-derives the matrix (step 6a), and a changed diagrammed use case reopens to-do step 5. |
| grill-me session (external skill) | decisions handed back | The to-do step 3 prompt is prepared by this agent; the session itself is human-run. Returned decisions go through the same step 8 mechanics; a confirmation of an unchanged rule is evidence only, no new TD (brd-unifier/delivery-chunks.md:199). |

### Downstream

| To | Contract |
|---|---|
| Architect (sdd-unifier; see `04-agent-sdd.md`) | "Technical mandates found in source material are parked **verbatim** in Appendix § Technical Inputs for the SDD so nothing is lost" (brd-unifier/SKILL.md:85); "The sdd-unifier reads this section as input" (brd-unifier/chunks/12-appendix-and-wishlist.md:18). "`INT-NN` IDs are owned by the SDD, not the BRD" (brd-unifier/SKILL.md:304). Stability contract: UC IDs, persona names, and integration partner names stay stable across revisions (renaming breaks the downstream chain; a mapping note goes in the Changes Log if unavoidable) (brd-unifier/SKILL.md:94). Reading order: "Derive an SDD (`sdd-unifier`) \| brd-master \| chunks 00-13; 15 and 16 as context only when they exist; never 14 or 17; technical inputs parked in 12" (brd-unifier/chunks/brd-master.md:172). |
| Implementation Designer (lld-unifier; see `05-agent-lld.md`) | Reads the master's Delivery Chunks State cell first ("`lld-unifier` reads that cell first", brd-unifier/delivery-chunks.md:55). Consumes the chunk 14 Mockup coverage `MK-NN` rows (the screen references; the Figma links stay in the BRD row) and the chunk 16 UAT/BAT test cases (lld-unifier/transform-detection.md:107; lld-unifier/chunks/16-references.md:20-21). A `Locked` or absent chunk 16 surfaces there as `Pending (BRD 16 not written)` (lld-unifier/sdd-to-lld.md:55). The BRD never defines its own screen IDs; it only carries source-defined ones next to the `MK-NN` (brd-unifier/delivery-chunks.md:93). |

**Handoff launcher entries this agent emits** (phrased tasks, run only on the user's word): "Derive the SDD from `brd-[slug]/`" (to the Architect; the reading-order contract above) (product addition; brd-unifier emits no launcher phrase, brd-unifier/SKILL.md:308). BRD changes reach the Implementation Designer indirectly: the user tells the Architect "BRD <KEY> has a new version", and the LLD's step 3c then detects the new SDD version (see `07-collaboration-flows.md` F2). This agent emits no direct launcher entry to the Implementation Designer or the Review Panel; both are launched by the user. The grill-me and mockup prompts below are launcher entries too, but they target external tools, not platform agents.

## 11. Edge cases and failure modes

| Case | Required behavior |
|---|---|
| Legacy master file | A folder holding plain `brd-master.md`: rename it to `[project-slug]-brd-master.md`, repoint `MASTER:` footers and links, treat as not a content change (brd-unifier/SKILL.md:109). |
| Pure merge / re-chunk | Always run `whole`; only step 10 and the merge/re-chunk rules apply: no transformation mapping, no reviewer pass, no version bump (brd-unifier/transform-detection.md:102). "A merge is not a refresh, so no gate is checked" (brd-unifier/chunking.md:160). The merged file lives inside `brd-[slug]/`. |
| Pre-existing diagrams | A use-case diagram or flowchart already in a transformed source is kept at its slot, captioned `Pre-existing - re-verify at step 5`; no new one is drawn before the gate (brd-unifier/SKILL.md:163). |
| Gap thresholds (transforms) | Gap markers counted by question: 0-5 healthy; 6-14 typical, recommend closing before circulating; 15+ "not review-ready", recommend a clarification session first, and do not soften the recommendation (brd-unifier/sow-transformation.md:220-222). |
| Source parts disagree (transforms) | Never pick a side silently: take the version from the part mapped to that BRD home as a proposal that names the other part, `**[NEEDS CLARIFICATION: proposed <version> (<part>); <other part> says <other version>; confirm or replace]**`; when neither part maps to that home, flag both versions and propose neither (brd-unifier/sow-transformation.md:19). Conflicting source documents: `[NEEDS CLARIFICATION: source A says X, source B says Y]` (brd-unifier/transform-detection.md:138). A marker asks one question: an item about two things gives two markers, each at the home of its own content (brd-unifier/sow-transformation.md:185). |
| Project files and global defaults | `AGENTS.md` or the constitution in conflict with the source material or another chunk: do not pick one, raise an `OI-NN`. The user's global defaults are not project facts: used only where the source and the project files say nothing, as `[NEEDS CLARIFICATION: proposed (from the user's global defaults, not a project source): ...; confirm or replace]` (brd-unifier/SKILL.md:99). |
| Third-run discoveries | Corrections to chunks 00-13 found by a session's third consistency run, or after it, are not applied in that request: they stay `Decided - pending application` (TD row holds the decision, who decided, the date) and keep the gate shut until the next request applies and rechecks them (brd-unifier/delivery-chunks.md:161,165,190). One exception: "a mechanical correction that changes only chunk 14 or a companion record (`decision-log.md`, `[project-slug]-brd-master.md`) is applied at once and recorded as `Corrected`; rerun § Verification before presenting on chunk 14 instead of a new run" (brd-unifier/delivery-chunks.md:165). |
| Deferred items | "`Deferred` does not count as closed" (brd-unifier/SKILL.md:278): a deferred item keeps to-do step 1 incomplete and the gate shut. |
| "later" / "I'll review offline" | All OI items stay `Open`; nothing is applied; the handoff notes the acceptance loop is pending (brd-unifier/SKILL.md:251). |
| Mermaid failure | Fall back to a numbered text description plus `[NEEDS CLARIFICATION: Mermaid syntax error: review and fix]`, and surface the count in the handoff (brd-unifier/mermaid-diagrams.md:56). Validation uses a Mermaid parser or renderer when one is available; the Mermaid CLI through `npx` downloads a tool on first use, so the agent asks the user first ("without a yes, use the line-by-line check" against the notation examples) and writes its test files to a scratch location, never the BRD folder (brd-unifier/mermaid-diagrams.md:157-158). |
| `combined parts` requested | Not available: say so in one line, continue in `whole` (brd-unifier/SKILL.md:77). |
| "just finish it" mid-parts | Switch to `whole` for the remaining parts, no more checkpoints, record `Generation: parts, completed whole from part N` (brd-unifier/parts-mode.md:147). |
| Unrecognised argument | State the valid options; ask the user to re-invoke, or treat as empty and prompt (brd-unifier/SKILL.md:49). |

## 12. UI and productization requirements

**Screens and dashboards:**

| Surface | Data source | Must show |
|---|---|---|
| Part progress board | Master's Generation Progress table | Per part: chunks, status (`Pending` / `In progress (last step done)` / `Complete`), completion date; the Source line |
| OI decision queue | Chunk 13 | Per item: ID, Where, Type, Concern, Options with tradeoffs, **Recommended Answer and Why visible by default** (the user decides with the reason in view), Status; batch affordance of up to 4 items per submission; per-item options Accept recommendation / Choose option [B/C] / Defer / Other ("a rejection is typed through Other", brd-unifier/SKILL.md:243) |
| Delivery gate dashboard | `14-todo.md` Delivery gate block | G1-G5 with `Met` / `Not met`, what is still open behind each, gate state `Shut` / `Open`, next action; evidence text per step, not just status words |
| To-do five-step tracker | `14-todo.md` | The five steps (resolve open items -> consistency check -> grill-me -> Figma mockups -> use-case diagrams and flowcharts) with Status, Evidence, Unblocks; the open-items register sorted P1 first |
| Mockup coverage table | `14-todo.md` § Mockup coverage | `MK-NN` rows: screen/flow, use cases, requirements and decisions to honour, states, priority, playable, breakpoints, status, play-through, Figma link. Status: `Pending gate` / `Not started` / `In progress` / `Blocked by TD-NN` / `In review` / `Approved` (brd-unifier/chunks/14-todo.md:193); a started row that an unresolved item touches is `Blocked by TD-NN`, and an unstarted row stays `Pending gate` while G1-G3 do not hold, its requirements cell naming the item (brd-unifier/delivery-chunks.md:212) |
| Consistency-check run log | `14-todo.md` § Step 2 | Runs with date, trigger, scope, findings, still-open count; every `CF-NN` with its disposition; the three-runs-per-session cap surfaced |
| Decision register viewer | `decision-log.md` | The six registers with working `Rule home:` links; append-only history, superseded decisions visible |
| Mermaid diagram board | Chunks 05, `06*`, and `14-todo.md` step 5 tables | Rendered inline Mermaid with its Summary line; per-UC flowchart status (`Skipped` / `Pending gate` / `Not started` / `Drafted` / `Provisional (TD-NN)` / `Final`, plus `Pre-existing - re-verify at step 5` for a diagram kept from the source; brd-unifier/chunks/14-todo.md:235); a Miro board link only where the user requested one |

**Decision queue items this agent raises:** the output-mode choice; "Continue with part N?"; part-checkpoint continues; OI acceptance batches (the largest volume); the one-time brand-color question; gate sign-off requests that the product owner must close with evidence, plus grill-me and mockup-review confirmations with dates.

**Notifications:** part checkpoint reached (parts 1 and 2 stop and wait); acceptance loop pending ("later" leaves everything `Open`); delivery gate opened or shut, with the failed conditions; delivery chunks marked `Stale` after a content change; 15+ gap-marker warning on transforms (not review-ready).

**Hard-to-productize notes:**

- Part checkpoints are hard stops, not reminders: after parts 1 and 2 the agent must not start the next part on silence, a thank-you, or an unrelated question; only an explicit continue or corrections-then-continue moves it (brd-unifier/parts-mode.md:58). The UI should make the waiting state visible instead of letting the agent idle.

- The grill-me session is an external, human-run step: the agent prepares the ready-to-use prompt below (brd-unifier/chunks/14-todo.md:144-151; in COMBINED mode its second line reads "Read ../BRD-[ProjectName]-v[X.X].md first, then 14-todo.md", brd-unifier/delivery-chunks.md:475) and can never mark the step beyond `Not started` itself; only the product manager's dated confirmation advances it (brd-unifier/delivery-chunks.md:198). The platform should offer a launcher button plus a confirmation form, not an auto-run.

  ```text
  /grill-me Finalise the requirements of the [Project Name] BRD v[X.X] in ./brd-[project-slug]/.
  Read [project-slug]-brd-master.md first, then 14-todo.md.
  Grill me in this order:
  1. Open questions and pending decisions: [TD-01 (OI-03, 06a / UC-04), TD-02 (06a / UC-02 step 4), ...]
  2. Unresolved consistency findings: [CF-01 (06a / UC-04 AC-2 vs E1), ...]
  3. Requirements to stress-test: [UC-NN ..., NFR-NN ...]
  For every decision I confirm, name the chunk and section it changes.
  Do not edit any file during the session. End with a numbered decision list I can hand back to brd-unifier.
  ```

- The Figma/mockup work is likewise external: the agent writes the mockup brief and tracks coverage rows; generating frames, the review, and the play-through happen outside the platform and come back as confirmations and links.
- Evidence discipline resists automation: gate conditions must be verified against files, and checklist generation is not evidence. UI should treat every `Complete` badge as a link to its evidence text, and should refuse to render "gate open" from status cells alone.
- The acceptance loop's "Other" free-text path and the rejected-item re-ask (`Adjusted - applied`) need a conversation surface, not a pure form.

## 13. Handoff inventory

The final summary (step 9, brd-unifier/SKILL.md:292-309) must surface, and the platform should render, all of:

1. Generation option used (`parts` or `whole`); for `parts`, the date each part was completed.
2. Project name, version, mode (chunks / combined), file paths.
3. Number of chunks (or section count in combined), including persona count and use-case count.
4. Count of inline Mermaid diagrams (plus the Miro board URL only if one was requested).
5. Inline `[NEEDS CLARIFICATION: ...]` markers counted by question, as two numbers: gaps vs proposals to confirm (with the transform thresholds of §11).
6. Plain-language pass confirmation: ran on the body and on every delivery chunk written; any chunk that still reads heavy, and why.
7. Open Items summary by status: total, accepted & applied, adjusted, deferred, rejected, decided and pending application, still open.
8. Scope proposals recorded in Reviewer Notes, named for the owner's choice.
9. Matrix status: personas x use cases covered, plus footnoted conditional cells.
10. Chain handoff check: UC IDs, persona names, and integration partner names stable and internally consistent; `INT-NN` owned by the SDD; no content restated across chunks.
11. To-do summary: the five steps with status (none `Complete` without evidence); open `TD-NN` by priority; consistency findings by disposition, including applied mechanical corrections; items raised after the acceptance loop.
12. Delivery gate state, `Shut` or `Open`; when shut, the unmet conditions G1-G5 with what is open behind each, and the plain statement that 15-17 were not generated, deferred items count as open, and there is no override.
13. When 15-17 were written: task count, waves, dependency problems; test-case totals with provisional scenarios and coverage gaps; slide and video counts (every storyboard verified at 30 seconds); any new `TD-NN`.
14. Recommended next action for the product manager: normally the first incomplete to-do step (decide the P1 open items, then run `/grill-me` with the prepared prompt), with the note that diagrams/flowcharts and mockups wait for steps 1-3 and run in parallel.
15. One-line mode-conversion offer: "Want me to switch to the other mode?" / "Want me to merge the chunks?" / "Want me to re-chunk this combined file?"
16. Which project files were found and used: `AGENTS.md` / `AGENT.md` and `ui-ux-global-constitution.md` (brd-unifier/SKILL.md:99).
17. A mode implied by the request, confirmed in one short line, or the fallback to CHUNKS after an unclear mode answer (brd-unifier/SKILL.md:64,66).
18. A skipped to-do (brd-unifier/delivery-chunks.md:68), and any deviation from the canonical chunk map (brd-unifier/chunking.md:98).
19. For transforms: a translated source, the count of ignored non-BRD paragraphs (brd-unifier/transform-detection.md:142,146), and a `No-Go` or `Conditional Go` verdict with its conditions (brd-unifier/sow-transformation.md:191).
