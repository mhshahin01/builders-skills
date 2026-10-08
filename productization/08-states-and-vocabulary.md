# 08. States and vocabulary

The shared reference for every status string, gate, marker, ID, and interaction pattern the platform must render or parse. Everything is quoted as the skills write it. Where siblings collide, the collision is marked and forwarded to `09-open-decisions.md`.

## 1. Terminology per agent

| Concept | Discovery | Requirements | Architect | Impl. Designer | Review Panel |
|---|---|---|---|---|---|
| chunks vs combined | output mode (also "output shape") | **output mode** | **output mode** | **output shape** | n/a |
| parts vs whole | not present | **generation option** | **generation option** | not present | not present |
| from-code / from-sdd / hybrid | n/a | n/a | n/a | **direction** (prompt), recorded as the **Mode** field | n/a |
| generate vs transform | intent | intent | intent (GENERATE / TRANSFORM / DERIVE-FROM-BRD) | direction + transform-detection | scope |
| reviewer recommendation field | Recommended Answer | **Recommended Answer** | **Recommended Answer** | **Recommendation** | Recommendation |
| decision register | chunk 24 only | `decision-log.md` | `decision-log.md` | chunk 15 §18.4 + Resolution Log | the tracker |
| the checklist artifact | n/a | Product Manager To-Do (chunk 14) | n/a | chunk 15 (flag index) | the tracker |

Terminology collision (D1 in `09-open-decisions.md`): "mode" means output mode (BRD/SDD), output shape context (LLD), and direction (LLD Mode field) depending on the file. The product UI should use its own fixed words and map them: **format** (chunks/combined), **generation** (parts/whole), **direction** (from-code/from-sdd/hybrid), **stage** (named pipeline stage).

## 2. Status enums

### 2.1 Open item / decision statuses

| Agent | Enum (verbatim) |
|---|---|
| Requirements | `Open` / `Decided - pending application` / `Accepted - applied` / `Adjusted - applied` / `Deferred` / `Rejected` |
| Architect | same six as Requirements |
| Discovery (chunk 24) | `Open` / `Accepted - applied (with pointer)` / `Adjusted - applied` / `Deferred (with rationale)` / `Rejected` |
| Impl. Designer (chunk 18) | `Open` / `Resolved (link to LLD update)` / `Deferred (with rationale)` |
| Review Panel (points) | `Pending` / `Decided` / `Applied` / `Partially applied` / `Rejected` / `Deferred` |
| Resolution Log Outcome (Discovery 24, Requirements 13) | `Accepted recommendation` / `Adjusted: short note` / `Deferred` / `Rejected`; Requirements adds `Settled by business review [point ID]` (pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:67; brd-unifier/chunks/13-open-items-and-clarifications.md:82) |

Document agents' open items: `Deferred` never counts as closed and keeps their gates shut. Review Panel points: `Deferred` counts as closed for phase detection and lets the session close, and is set only on the user's word (business-reviewer-unifier/SKILL.md:49, 213-214). No open item, business choice, or review point is applied without an explicit human decision; mechanical consistency corrections with a fixed source of truth are applied and logged as `Corrected` (brd-unifier/delivery-chunks.md:186).

### 2.2 Gate and chunk states

| Where | Enum (verbatim) | Meaning |
|---|---|---|
| BRD delivery chunks 15-17 | `Locked` / `Up to date` / `Provisional (TD-NN)` / `Stale` | Kept identical in three places: the chunk's status line, its 14-todo Downstream outputs row, the master's Delivery Chunks State cell |
| BRD step-5 tracking rows (per use case) | `Skipped` / `Pending gate` / `Not started` / `Drafted` / `Provisional (TD-NN)` / `Final`; a kept source diagram reads `Pre-existing - re-verify at step 5` | Gated diagram and flowchart step (brd-unifier/chunks/14-todo.md:235) |
| BRD mockup coverage rows (MK-NN) | `Pending gate` / `Not started` / `In progress` / `Blocked by TD-NN` / `In review` / `Approved` | A started row that an unresolved item touches is `Blocked by TD-NN`; an unstarted row stays `Pending gate` while G1-G3 do not hold (brd-unifier/chunks/14-todo.md:193; delivery-chunks.md:212) |
| SDD e2e gate line | `Locked` / `Open - Up to date` / `Stale` | Handoff shorthand: `Shut` covers `Locked` and `Stale`; `Open` is `Open - Up to date` (sdd-unifier/SKILL.md:350) |
| SDD contract rows (§15.2) | `Defined` / `TBD - external` / `Flagged` | External contracts stay `TBD - external` until provider documentation |
| SDD divergence registers (§14.8, §15.5, §16.12) | `Open` / `Fixed in vX.X` | Anything not `Fixed in vX.X` counts as Open for the gate |
| SDD events hub (chunk 10) | `committed` / `candidate` / `Analytics-only` / `Pn` (phase) | Status legend (sdd-unifier/chunks/10-events-hub.md:144) |
| SDD services (chunk 09) | Type `service` / `module`; Status `Active` / `Merged into [service]` / `Removed: [reason]` | A merged or removed row stays in place and has no 13x chunk (sdd-unifier/chunks/09-services-summary.md:12) |
| SDD §7.3 trace rows | `Active` / `Merged into KEY/UC-NN` / `Removed` | Taken from the BRD's Use Case Summary marker (sdd-unifier/brd-to-sdd.md:121) |
| SDD ADRs (chunk 06) | `Proposed` / `Accepted` / `Superseded` / `Deprecated` | sdd-unifier/chunks/06-principles-and-decisions.md:40 |
| Review hand-off rows | `To run` / `Done` | Flipped on the user's word or owner-side evidence |
| Discovery lifecycle | in-progress -> presented (step 7) -> approved -> exported (optional) | Informal; no status field exists |
| Document cover Status | `Approved` / `In Review` / (draft states per template) | Reviewed/Approved By stays empty until the user names the approver; the review sets `In Review` when an Approved BRD changes |

### 2.3 Flags, markers, and task states

| Marker | Used by | Meaning |
|---|---|---|
| `[NEEDS CLARIFICATION: <question>]` | Discovery, Requirements, Architect | Open question in the body; bold and plain forms are the same marker. Proposal variants (Requirements only): `[NEEDS CLARIFICATION: proposed <behaviour>; confirm or replace]`, and, when two source parts disagree, `[NEEDS CLARIFICATION: proposed <version> (<part>); <other part> says <other version>; confirm or replace]` (brd-unifier/sow-transformation.md:19) |
| `[TBD - EXTERNAL: ...]` | Architect | Provider-owned contract field awaiting documentation |
| `> Confirm: [reason]` | Impl. Designer | Medium-confidence inference |
| `> TODO: <best-guess> - verify` | Impl. Designer | Low-confidence inference (also carries SDD `[NEEDS CLARIFICATION]` markers downstream, and an SDD item still `Decided - pending application`, with the decided option as its best guess, lld-unifier/sdd-to-lld.md:347) |
| `⚠ drift`, `🆕 code-only`, `⛔ sdd-only` + `> Drift note:` | Impl. Designer (hybrid) | SDD-vs-code divergence; text fallbacks `[DRIFT]` etc. allowed |
| `⚠ policy` | Impl. Designer | CLAUDE.md anti-pattern finding, not drift |
| `Pre-existing - re-verify at step 5` | Requirements | Source diagram kept at its slot pending the gated diagram step |
| `Pending (part N)`, `Pending (part 2)` | Requirements, Architect | Master/section placeholder while parts are unfinished |
| `Pending (BRD 16 not written)` | Impl. Designer | BRD UAT/BAT chunk absent or Locked |
| `Provisional (TD-NN)`, `Blocked` | Requirements | Delivery content waiting on a decision |
| `Decided - pending application` | Requirements, Architect | Decision collected, applied by the next content-changing update; the Impl. Designer reads an SDD item in this state as a `> TODO:` until sdd-unifier applies it |
| `Merged into UC-NN`, `Removed: [reason]`, `(Retired)` | Requirements | Retired IDs kept, never reused |
| `Settled by business review [point ID]` | Requirements (+ Architect variants `Settled by` / `Superseded by` / `Reopened by [source]`; Impl. Designer `Settled by` / `Superseded by` / `Reopened by SDD v[X.X]` or `[KEY] v[X.X]`, lld-unifier/sdd-to-lld.md:204) | Resolution Log outcome |
| `Not applicable for this release.` / `Not applicable for this service.` / `Not applicable - no source BRD.` / `None yet` / `None - generated without a BRD` | all doc agents | Empty-section and registry placeholder texts |
| `Not applicable - no source SDD` / `Not applicable - no source BRD` / `None - BRD coverage gap` / `Not applicable - no UI` / `None - platform page` / `None - no BRD screen ([link])` / `None - no BRD use case ([link])` / `Not in this LLD - owner: [service]` / `Not built yet - [service]` / `Not in this SDD (older SDD) - see [SDD 09](...)` / `No BRD use case - realises [link]` / `Not automated:` / `Not applicable - reverse-engineered LLD.` | Impl. Designer | Trace and coverage placeholders the trace views must parse (lld-unifier/sdd-to-lld.md:27, 31, 119-124, 134, 154, 171, 175; lld-unifier/SKILL.md:241) |
| `> Inlined from SDD §X for standalone distribution` | Impl. Designer | Explicitly requested export inlining |
| `> Miro: <url>` | Requirements, Architect, Impl. Designer | Additive board link under the authoritative inline Mermaid |
| `Active lens: [Venture-return \| Business-case]` | Discovery | Investor lens in chunk 23 |
| BRD task milestones | `Ready for test` (delivery team confirmed), `Accepted` (every required case passes) | Requirements chunk 15 |
| BRD test-case states | `(Provisional)`, `Pending TD-NN`, `Cannot be finalised - pending TD-NN` | Requirements chunk 16 |

## 3. Gates inventory

| Gate | Agent | Conditions | Locks | Evidence rule |
|---|---|---|---|---|
| Approval | Discovery | Step 7 presentation accepted | Excel export (a hand-off lock to Requirements is a product addition; the skill has none) | Explicit approval; the skill's phrases "export excel" / "looks good, generate the sheet" trigger the export (pre-brd-unifier/SKILL.md:83) |
| Delivery gate | Requirements | G1 every TD-NN Resolved (no Open/Deferred/pending items, no live markers in 00-12); G2 consistency check Complete with ordered evidence, every CF-NN dispositioned; G3 grill-me confirmed by the PM and decisions applied; G4 every mockup row Approved with links and dated review/play-through; G5 diagrams and flowcharts done, Mermaid parses, check rerun | Chunks 15, 16, 17 (no draft, preview, or outline) | Verified against the files, never status cells; PM confirmation valid for steps 3 and 4 only; "I take responsibility" is not evidence; no override |
| E2E gate | Architect | E1 open items cleared; E2 no open contract divergence (§14.8/§15.5/§16.12); E3 no unresolved value required by E2E claims (semantic marker inventory, external-placeholder exception); E4 reconciled after the final relevant change (ordered Reconciled entry) | Chunk 19 (no draft, preview, or outline) | Verified against the files, never from memory; "just do it" does not open it; no override |
| Phase gates | Review Panel | No close with unresolved `Pending` points (Deferred requires the user's word); hand-offs run only on the user's word | Close, hand-offs | The user's word, or per-owner done evidence: BRD consistency run after the review; SDD Reconciled entry with order evidence; LLD 16 §19.1 naming the new SDD version (business-reviewer-unifier/apply-and-verify.md:247-252) |
| (none) | Impl. Designer | Stops only when the SDD is unfinished (step 3b). A `Locked` or `Stale` E2E gate does not stop it: the gate state is named in 16 §19.1 and the handoff (lld-unifier/SKILL.md:152) | n/a | n/a |

## 4. ID registry

One fact, one home: every ID is owned by exactly one document, cited everywhere else, never renumbered or reused after the user has seen it.

| ID | Owning document | Home | Notes |
|---|---|---|---|
| `UC-NN` | BRD | chunks 05, 06* | Sequential across the BRD; retired rows kept as `Merged into UC-NN` / `Removed: [reason]` |
| `NFR-NN` | BRD | chunk 10 | Cited downstream as `KEY/NFR-NN` |
| `OI-NN` | each doc | Discovery chunk 24, BRD 13, SDD 18, LLD 18 | Per-document sequences, stable across revisions |
| `Q-NN` | BRD decision-log | Clarification register | |
| `TD-NN` | BRD | chunk 14 | To-do register rows |
| `CF-NN` | BRD | chunk 14 | Consistency findings |
| `MK-NN` | BRD | chunk 14 Mockup coverage | The BRD never defines its own screen IDs, only carries source-defined ones next to it |
| `TASK-NN`, `DP-NN` | BRD | chunk 15 | Tasks and dependency problems |
| `TC-[AREA]-NN` | BRD | chunk 16 | `[AREA]` is a 3-letter code |
| `SL-NN`, `V-NN` / `V-NN-Cn` | BRD | chunk 17 | Slides, videos, clips |
| `A-NN` | Discovery chunk 24 (also LLD chunk 01, separate sequence) | Assumptions | BRD cites them as `pre-BRD 24, A-NN` |
| `API-NN` | SDD | chunk 11 | One per synchronous domain/provider integration |
| `ADR-NN` | SDD | chunk 06 §10 | ADR-01 reserved for the architecture style |
| `AP-NN` | SDD | chunk 06 §9 | Template ships AP-01..AP-12 |
| `INT-NN` | SDD | chunk 08 | The BRD never defines these |
| `R-NN` | SDD | §4 | Risks |
| BRD keys | SDD | chunk 00 Source BRDs register | Short capitals (`REFUNDS`); every BRD reference downstream carries the key |
| Service chunk letters (`13a`, `13b`) | SDD | chunk 09 order | Gaps kept for merged/removed services |
| Topic, event, role names, permission tokens | SDD | chunks 10, 12 | Matched character-for-character downstream |
| `OQ-NN` | LLD | chunk 15 §18.4 | Decisions Pending |
| `SAGA-NN` | LLD | 04-implementation files | |
| `RB-NN` | LLD | chunk 10, 16 §19.5 | Runbooks |
| `<ROLE>-NN` | review tracker | Points (BO, SME, PM, PA, DC; optional SEC, FL, UX) | Merged findings referenced as "merged with X-NN" |
| Remnant lines | review tracker | Verification pass block | Numbered `1. <remnant> (<point ID>): <fix, hand-off, gated-chunk note, or reason rejected>`; the skill assigns no severity (business-reviewer-unifier/tracker-schema.md:39-40) |

Citation grammar across documents: `KEY/UC-NN` as a Markdown link (file + GitHub anchor); UC parts cited positionally (`step 5`, `A1`, `E1`, `BR-2`, `AC-3`, the last two always with a short label); `TI-NN` cited with its chunk reference (`REFUNDS 12 TI-01`); test cases cited `[REFUNDS 16](...) REFUNDS/TC-DEC-09`.

## 5. Interaction patterns

| Pattern | Where | Rule |
|---|---|---|
| Format prompt | all four doc agents | One question, default `chunks`, Enter/empty/y accepts; skipped when implied (Requirements and Architect also skip it on resume; the Impl. Designer skips it on an existing LLD, which keeps its own shape, lld-unifier/SKILL.md:74; Discovery states no resume skip). Exact texts differ only in "Output format?" vs "Output shape?" |
| Intent detection | Discovery, Requirements, Architect | Detected, never asked twice; at most one disambiguation question |
| HLD disambiguation | Requirements, Architect | An unqualified "HLD" gets one short question: business or technical |
| Intake | all | At most 3 questions (4 for Discovery), skipping anything already in context |
| Generation announcement | Requirements, Architect | "Generation: parts (default). Say 'whole' to get everything in one go." Never asked |
| Parts checkpoints | Requirements, Architect | Hard stop after parts 1 and 2: "Say 'continue' for part N, or tell me what to change first." Resume asks "Continue with part N?" on an empty request |
| Accept-all vs walkthrough | Architect (questionnaire, ecosystem) | One question. Questionnaire: walkthrough recommended when a driver is missing or two conflict (sdd-unifier/architecture-questionnaire.md:30). Ecosystem: `Accept all` is always the recommended option (sdd-unifier/SKILL.md:166) |
| Direction prompt | Impl. Designer | Always asked, even with obvious inputs; smart defaults only preselect |
| OI decision batches | Requirements, Architect | Up to 4 items per question call; options: Accept recommendation (first) / Choose option [B/C] / Defer / Other (free text; a rejection is typed through Other) (brd-unifier/SKILL.md:243; sdd-unifier/SKILL.md:301) |
| Point walkthrough | Review Panel | One point at a time, full prose, then a request for acceptance (worked example: "Accept, or adjust?"); the order choice is offered once at walkthrough start; points are decided all first only when the user asks (business-reviewer-unifier/walkthrough-protocol.md:10-11; SKILL.md:52-53) |
| Refresh offers | Impl. Designer | One bundled offer per upstream change set; never refresh silently. The Architect makes no refresh offer: its handoff adds a one-line suggestion to refresh an out-of-date child LLD through lld-unifier (sdd-unifier/SKILL.md:335) |
| Approval moments | Discovery (step 7), all (hand-offs) | Explicit phrases required; hand-offs run only on the user's word |

## 6. Review and check limits

| Agent | Limit |
|---|---|
| Requirements | Consistency check: at most three runs per session (first full, then scoped). Third-run corrections to chunks 00-13 wait as `Decided - pending application`; a mechanical correction that changes only chunk 14 or a companion record is applied at once as `Corrected`, with the chunk 14 verification list rerun instead of a new run (brd-unifier/delivery-chunks.md:165) |
| Architect | At most three review passes per request: one baseline (full, delta, or the application check of applied pending items; an update that also runs a delta review covers those items in it) and up to two scoped application passes (sdd-unifier/SKILL.md:255, 259) |
| Impl. Designer | At most two review passes per request: the full or delta review, and one application check; a coverage re-dispatch of an unchecked row is not a new pass (lld-unifier/SKILL.md:256) |
| Review Panel | Zero-findings reviewer re-dispatched once; verify is one remnant hunt with no second pass (a suspect zero on a major-decision session re-dispatches once) |

Every reviewer is a cleared-context sub-agent by design. A zero-finding review is a valid result everywhere except Discovery (rejected, re-dispatched with stronger framing) and the Review Panel per-persona (re-dispatched once, then recorded).

## 7. Versioning rules

| Rule | Discovery | Requirements | Architect | Impl. Designer | Review Panel |
|---|---|---|---|---|---|
| Model | fixed template version (v1.1), regenerate by pass | one update, one version | one update, one version | one update, one version | one bump per document per session, at its first change |
| First build | n/a | 1.0, row ends `Chunks: none (initial build)` | same | same | n/a |
| Bump step | n/a | one minor step per update; major only on request | same | same | one minor step per the owning skill's rule |
| Per-chunk versions | n/a | master + chunk 00 current; others keep last-changed | same (+ chunk 19 keeps the version of its last content-changing write) | master + 00-metadata current; others keep last-changed | every changed chunk takes the new version; gated chunks keep theirs |
| Bumps nothing | n/a | per `delivery-chunks.md` | Reconciled/E2E/basis lines, E3 inventory, Stale marks, links, Child LLDs rows, coverage-only rows | links, footers, index rows, flag-follow locations, its own Child LLDs row | status/link/Stale-only changes |
| Merged output location | project root (`PRE-BRD-[ProjectName]-v1.1-MERGED.md`, pre-brd-unifier/modes.md:31) | inside the chunk folder | inside the chunk folder | project root, links rebased | n/a |

## 8. Stage names for the product UI

Step numbers collide across skills (step 6a means three different things; step 8 is the acceptance loop in two skills and the presentation in another). The platform should use these canonical stage names, mapped to skill steps in each agent chapter:

- **Discovery:** Setup, Intake, Research, Frameworks, Investor assessment, Review, Present and approve, Export
- **Requirements:** Setup, Intake, Part 1: foundations, Part 2: use cases, Part 3: completion, Review, Decisions, To-do, Diagrams (gated), Delivery (gated), Present
- **Architecture:** Setup, Intake, Project Type, Architecture questionnaire, Ecosystem selection, Part 1: foundations, Part 2: services and contracts, Reconciliation, Part 3: operations, Review, Decisions, E2E (gated), Present
- **Implementation:** Setup, Direction, Input checks, Generation, Trace reconciliation, Specs, Lineage registration, Review, Answers, Present
- **Review:** Intake, Panel, Merge, Walkthrough, Apply, Verify, Close, Hand-offs
