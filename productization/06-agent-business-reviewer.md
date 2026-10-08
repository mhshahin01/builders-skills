# Review Panel (business-reviewer-unifier)

The Review Panel is the platform's cross-document adversarial review agent, built on the `business-reviewer-unifier` skill. It runs after documents exist, challenges them from five persona angles at once, drives every finding to a recorded decision, applies decisions across the whole chain with version control, verifies the result, and hands each changed document back to its owning agent. It is the only agent that edits the content of documents it does not own, and every content edit it makes traces to a decision the user made (verify fixes ride on their point's decision).

## 1. Role card

| Field | Value |
|---|---|
| Product agent name | Review Panel |
| Mission | Run an adversarial multi-persona review over the business document chain and drive every finding to resolution, with an auditable decision and sign-off trail. |
| Team position | Cross-cutting. Runs after documents exist; optional fifth seat in the Full preset (see [00-vision-and-model.md](00-vision-and-model.md), [07-collaboration-flows.md](07-collaboration-flows.md)). |
| Upstream trigger | The product owner only. Never auto-triggered by another agent. |

Paste-ready job description for the agent-creation UI:

> Run an adversarial, multi-persona review across the project's business document chain: numbered business docs, the pre-BRD when there is one, BRDs, and SDDs. Dispatch five persona sub-agents (Business Owner, Domain SME, Product Manager, Principal Architect, Document Consistency) in parallel with cleared context, merge their findings into one persistent tracker, and walk the product owner through every point with full context: the issue and its exact location, why it matters, options with trade-offs, and a recommendation. Apply each decision chain-wide immediately after it is made, editing content only inside the owning skill's template structure, bumping each changed document's version once, and recording the story in each document's decision log. Never edit an LLD or a gated chunk's content; set the gated chunk's Stale mark instead. After all points are closed, dispatch a fresh verification sub-agent to hunt stale remnants and score chain consistency out of 10, then close the session and hand each changed document back to its owning agent, one launchable request per document, each running only on the product owner's word.

Capability and model requirements:

| Requirement | Why |
|---|---|
| Sub-agent dispatch with fresh context (meta-agent) | The agent orchestrates five parallel persona sub-agents in one message, plus later re-dispatches and the verification sub-agent. "Cleared context is the point: reviewers must not inherit authoring or conversation memory" (business-reviewer-unifier/panel-orchestration.md:5-7). |
| Assignable models | Orchestrator: strong reasoning model (the merge is semantic judgment). Per-persona model overrides for the sub-agents; the SME persona benefits from domain-knowledgeable models. Verification sub-agent: independent model slot. |
| Human question UI | Structured prompts with options, trade-offs, a recommendation, and free-text answers; walkthrough decisions must never be compressed into terse option labels (business-reviewer-unifier/walkthrough-protocol.md:32-35). |
| Deep links into documents | Every finding and tracker row cites a doc id and section, for example `01 §7` or `02 DOM-04` (business-reviewer-unifier/panel-orchestration.md:24); the UI must map doc ids to files and sections to anchors, and render them as clickable links. |
| Version-aware document writes | Writes span the whole chain: version bumps, file renames with citation updates, Changes Log rows, decision-log registers, cover Status flips, Stale marks. |
| Persistent workspace state | The tracker at project root is the session; resume depends on reading it. |

Tools and integrations: workspace file read/write, sub-agent dispatch API, decision queue, handoff launcher, document deep-link resolver, the other agents' skill templates (read-only, for the verification pass).

Position versus built-in reviews: each document agent runs its own single-reviewer pass on itself; this agent is explicitly separate: "This is the cross-document panel, not the single reviewer pass built into brd-unifier, sdd-unifier, and pre-brd-unifier" (business-reviewer-unifier/SKILL.md:10-11).

## 2. When to include this agent

| Team preset | Include? | Rationale |
|---|---|---|
| Solo (Discovery only) | No | A single pre-BRD has no cross-document chain to sweep. |
| Standard (Requirements + Architect) | Optional | One BRD and one SDD exist; the panel adds the cross-document consistency sweep and persona challenge before sign-off. |
| Full (Discovery, Requirements, Architect, Implementation Designer, optional Review Panel) | Recommended | Multi-BRD chains, gated chunks, and child LLDs make contradictions expensive; the panel is the only independent check across documents. |

What is lost without it:

- No cross-document consistency sweep: contradictions, dangling references, and silent overrides between documents surface only downstream, as rework.
- No SME/persona challenge: no Business Owner, Domain SME, Product Manager, Principal Architect, or Document Consistency angle ever reads the chain cold.
- No independent sign-off trail: no tracker, no per-point decision record, no Business review register entries, no verification score.

Phase model: the agent runs `panel`, `walkthrough`, `apply`, and `verify` as separate invocations, with the close and the hand-offs following `verify` (business-reviewer-unifier/SKILL.md:41-49). The product should expose each phase as its own runnable job, because a review session routinely spans days: "A review session is one tracker, from its first applied point to its close, even when the walkthrough resumes on another day" (business-reviewer-unifier/apply-and-verify.md:3-4).

## 3. Artifacts consumed

| Artifact | Path pattern | Owner | How used |
|---|---|---|---|
| Numbered business docs | `[NN]-*.md` at project root | None (unowned docs) | Reviewed directly; a change bumps the in-document version with a header changelog entry (business-reviewer-unifier/apply-and-verify.md:96-97). |
| pre-BRD folder | `pre-brd-[slug]/` | pre-brd-unifier ([02](02-agent-pre-brd.md)) | Reviewed when present; edits write Answer cells only and recompute derived values (business-reviewer-unifier/apply-and-verify.md:65-69); never mentioned when absent (business-reviewer-unifier/SKILL.md:96-97). |
| BRD chunk folders | `brd-[slug]/` | brd-unifier ([03](03-agent-brd.md)) | Reviewed and edited, content only, inside the owning template structure. |
| SDDs | `sdd-[slug]/` | sdd-unifier ([04](04-agent-sdd.md)) | Reviewed and edited, content only, inside the owning template structure. |
| LLDs | `lld-[slug]/` | lld-unifier ([05](05-agent-lld.md)) | Lineage context only: each LLD's master, `00-metadata.md` (Changes Log), and `16-references.md` § 19.1 go to reviewers marked as context, not for review. "LLD folders are not reviewed" (business-reviewer-unifier/SKILL.md:98-101). Never edited. |
| SME domain | Intake parameter | The user (mandatory confirmation) | Substituted into the SME charter verbatim; recorded in the tracker header. Resolution order: explicit in invocation, inferred from the docs and restated for confirmation, or asked outright (business-reviewer-unifier/SKILL.md:102-107). |
| Prior tracker | `./review-comments-tracker.md` | This agent | Resume: phase detection, point states, footer blocks. |
| Prior findings file | `./review-panel-findings.md` | This agent | Resume: each point's raw findings are read before presenting it (business-reviewer-unifier/walkthrough-protocol.md:19-20). |
| Owning skills' templates | Skill `chunks/` folders, `TEMPLATE-COMBINED.md` | The doc skills (read-only) | Given to the verification sub-agent so template drift is caught (business-reviewer-unifier/apply-and-verify.md:136-139). |

## 4. Artifacts produced

| Artifact | Path pattern | Purpose |
|---|---|---|
| Review comments tracker | `./review-comments-tracker.md` (project root) | The session itself. "Persistent across sessions; updated after every applied point, never batched to session end. One tracker is one review session" (business-reviewer-unifier/tracker-schema.md:3-5). Header lines: Created, Source (the documents with their versions at review time), Reviewers, SME domain, Status values, Panel findings link, and a Panel notes line only when a re-dispatched reviewer still found nothing (business-reviewer-unifier/tracker-schema.md:22-29). Columns: `ID \| Reviewer \| Concern (short) \| Target doc(s) \| Status \| Decision` (business-reviewer-unifier/tracker-schema.md:31). Footer blocks: Progress, Versioning, Verification pass, Hand-offs, Skill changes requested, Major structural decisions (business-reviewer-unifier/tracker-schema.md:35-52). Full template below this table. |
| Panel findings file | `./review-panel-findings.md` (next to the tracker) | Every raw finding under its point heading `## <ID>: <short concern>`, so each reviewer's Why and Direction survive the session. Written at the merge; takes re-dispatch findings the user asks for; never edited after the walkthrough starts (business-reviewer-unifier/tracker-schema.md:9-15). Frozen raw evidence for the point detail pages. |
| Changes Log rows | Each changed document's Changes Log (BRD/SDD `00-cover-and-changelog.md`, a combined file's cover, or a business doc's header) | One row per session "naming the session and the tracker", listing each point ID with the chunks it changed and ending with the owning skill's `Chunks:` list so the next skill down the chain knows what to refresh (business-reviewer-unifier/apply-and-verify.md:87-89, 105-108). Its Reviewed By and Approved By cells stay empty until the document's owner reviews and approves the new version (business-reviewer-unifier/apply-and-verify.md:108-110). |
| Business review register records | Each changed BRD/SDD `decision-log.md`, § Business review register | One record per point: what was decided, what it replaced, the open items and markers it answers, a tracker link, any open remainder, and a `Rule home:` link (business-reviewer-unifier/apply-and-verify.md:15-22). |
| Version bumps and renames | Document versions, file names when the version is in the name | One minor step at a document's first content change per session, never twice in a session; renames propagate citation updates (business-reviewer-unifier/apply-and-verify.md:87-117). |
| Cover Status `In Review` | Changed BRD covers whose Status read `Approved` | Sign-off signal with the change date (business-reviewer-unifier/apply-and-verify.md:93-95). |
| Stale marks | BRD chunks 15-17: the chunk's status line, its Downstream outputs row in chunk 14, and its State cell in the master's Delivery Chunks table; SDD: the E2E gate line in the SDD master (combined SDD: its cover), chunk 19 itself untouched | With the links a file rename repoints, the only writes on a gated chunk; its content is never edited (business-reviewer-unifier/apply-and-verify.md:118-128). |
| Supersession notes | Business docs that no skill owns | A decision that overrides an earlier statement in another document states the supersession on both sides rather than silently editing one (business-reviewer-unifier/apply-and-verify.md:22-24). |
| Rename header note | A renamed combined BRD or SDD | A header note that historical in-text citations to the old version remain valid if section numbering is unchanged (business-reviewer-unifier/apply-and-verify.md:183-186); the owning skills repoint the lineage links at the hand-off (business-reviewer-unifier/apply-and-verify.md:115-116). |

Tracker template, verbatim (business-reviewer-unifier/tracker-schema.md:19-52). The **Created:** date is the date every hand-off request quotes (section 10):

```markdown
# Review Comments Tracker

**Created:** YYYY-MM-DD
**Source:** Multi-agent review of <doc list with versions at review time>
**Reviewers:** Business Owner (BO), <Domain> SME (SME), Product Manager (PM),
Principal Architect (PA), Document Consistency (DC)[, add-ons]
**SME domain:** <confirmed domain, e.g., residential compound and community operations>
**Status values:** Pending | Decided | Applied | Partially applied | Rejected | Deferred
**Panel findings:** [review-panel-findings.md](review-panel-findings.md)
**Panel notes:** <a reviewer whose re-dispatch still returned nothing: the persona, the areas it named clean, and the evidence; omit the line when there is none>

| ID | Reviewer | Concern (short) | Target doc(s) | Status | Decision |
|----|----------|-----------------|---------------|--------|----------|
| BO-01 | Business Owner | <short concern> | 01 §7 | Pending | |

**Progress:** <N of M decision points resolved (R raw comments, K merges)>

**Versioning (YYYY-MM-DD):** <per-doc version bumps (old to new, the Changes Log row), renames, citation updates>

**Verification pass (YYYY-MM-DD):** <score, before the fixes>; <N> remnants: <fixed>, <left for the hand-off>, <rejected>
1. <remnant> (<point ID>): <the fix, the hand-off that takes it, or why it was rejected>

**Hand-offs (YYYY-MM-DD):**
1. <skill>: "<request>" on <document> - To run | Done
(or `None` when no document changed)

**Skill changes requested:**
1. <skill>: <structure and the change a decision needed> (<point ID>)
(or `None`)

**Major structural decisions taken during this session:**
1. <decision>
```

## 5. Invocation and arguments

Command form (business-reviewer-unifier/SKILL.md:41):

```
business-reviewer-unifier [panel|walkthrough|apply|verify]
```

Platform invocation forms:

| Form | Where | Notes |
|---|---|---|
| Chat command | Agent conversation | The skill invocation with its phase argument. |
| Launcher job | Agent page, handoff launcher | Each phase is a separate runnable job with its own run record; the empty-argument form is the resume button. |

Phase argument behavior (business-reviewer-unifier/SKILL.md:43-49):

| Argument | Action |
|---|---|
| `panel` | Dispatch the reviewer panel, merge findings, write the tracker. Stop. |
| `walkthrough` | Resume point-by-point resolution from the existing tracker. |
| `apply` | Apply all Decided-but-unapplied points chain-wide. |
| `verify` | Cleared-context consistency re-review, then the close and the hand-offs to the owning skills. |

Empty argument: detect the phase from tracker state, exactly in this order (business-reviewer-unifier/SKILL.md:49):

1. No `review-comments-tracker.md` means `panel`.
2. Pending points mean `walkthrough`.
3. Decided points not yet applied mean `apply`.
4. Every point closed (Applied, Partially applied, Rejected, Deferred) but no Verification pass means offer `verify`.
5. A Verification pass but no Hand-offs block means the close (step 7).
6. Hand-offs rows still `To run` mean offer the next one.
7. Otherwise report status and ask.

Two resume semantics the product must honor:

- On a fresh project the empty argument runs `panel` then flows into `walkthrough` (the transition is announced); `apply` happens per point during the walkthrough, not as a deferred batch, unless the user asks to decide everything first (business-reviewer-unifier/SKILL.md:51-53).
- Resume is total: the tracker is the session state, so any invocation after a gap re-enters at the detected phase with no loss. Hand-off progress lives only in the Hand-offs rows: each reads `To run` until the user says it ran or the owner's own record shows it, then `Done` (business-reviewer-unifier/tracker-schema.md:79-81). The R3b to R3d close sections in the 2026-10-07 fixture (`_fixtures/chain/run-2026-10-07-review/review-comments-tracker.md:50-75`) are test-harness notes, not skill output; no owning skill writes the tracker.

## 6. Conversation flow

Every user-facing prompt, in order. The product must render each as a decision queue item or a blocking dialog, never as background text.

| # | Trigger | Exact text / required content | Options | Default | Skip condition |
|---|---|---|---|---|---|
| 1 | Intake, panel phase | Detected document chain presented as a checklist (numbered business docs, pre-BRD when present, BRD chunk folders, SDDs; child LLDs shown as lineage context only). Confirm which are in scope. | Confirm whole chain / uncheck documents | The whole chain | Already stated in the invocation. At most three intake questions total, "skipping anything already in context" (business-reviewer-unifier/SKILL.md:92). |
| 2 | Intake, panel phase | SME domain confirm-or-supply. Mandatory. If inferred, the inferred domain is restated for confirmation before dispatch; otherwise asked outright. "The domain is the CUSTOMER'S business (who operates with this product and what they operate), not the product's tech category" (business-reviewer-unifier/SKILL.md:105-106). | Confirm inferred domain / supply domain | None; never defaulted | Never skipped. Product categories are invalid: "PropTech, FinTech, HealthTech and similar labels are product categories and are INVALID SME domains" (business-reviewer-unifier/reviewer-personas.md:53-54). |
| 3 | Intake, panel phase | Panel composition: default five personas, with a one-line offer of the Security, Finance/Legal, and UX add-ons (business-reviewer-unifier/SKILL.md:108-109). | Keep five / add SEC, FL, UX | Five default personas | Add-ons only on explicit request. |
| 4 | After merge | Merge report: total raw findings, merges performed, final point count, per-reviewer counts, and each reviewer's `Left out` line (business-reviewer-unifier/panel-orchestration.md:83-85). Per-reviewer action: ask this reviewer for more (once, for the areas its `Left out` line names). | Proceed to walkthrough / ask a reviewer for more | Proceed | The ask-for-more action expires when the walkthrough starts. |
| 5 | Walkthrough start (offered once) | Required content: the walkthrough order, offered once when the walkthrough starts: tracker order unless the user picks another (business-reviewer-unifier/walkthrough-protocol.md:10-11). Points are applied as each is decided unless the user asks to decide everything first (business-reviewer-unifier/SKILL.md:52-53); offering that choice up front is a product addition. Example wording from a fixture run, not a required string: "Two defaults, unless you want otherwise: (1) the tracker order above; (2) apply each point as soon as it is decided, rather than deciding everything first. Shall I start with Point 1 (BO-03)?" (`_fixtures/notes/step5-logs/walkthrough-log.md:20`) | Tracker order or picked order; apply per point or decide everything first (product addition) | Tracker order, apply per point | Never skipped; asked once per session. |
| 6 | Every point | Full four-block prose (Issue with exact location, Why it matters, options table of 2 to 4 with trade-offs, Recommendation), tracker restated, then the ask for acceptance; the skill's worked example asks "Accept, or adjust?" (business-reviewer-unifier/walkthrough-protocol.md:9-31, 77) | Accept / Adjust (another option) / Reject (one-line reason) / Defer (one-line reason; only on the user's word) / custom free-text decision (business-reviewer-unifier/SKILL.md:165-166, 213-214; business-reviewer-unifier/tracker-schema.md:69) | The recommendation | Never skipped; one point in flight at a time. Security points (the issue or an option touches trust boundaries, authentication or authorization, personal data and its retention, secrets, tenant isolation, or abuse cases) get a first-principles explanation before the options (business-reviewer-unifier/walkthrough-protocol.md:36-40). |
| 7 | Verify, conflicting remnant | A remnant with two possible fixes that would make a document say different things "is put to the user with the options and a recommendation, as in the walkthrough" (business-reviewer-unifier/apply-and-verify.md:169-171). | Option A / Option B / custom | The recommendation | Only when such a remnant exists. |
| 8 | Close attempted with unresolved Pending points | Deferred escape hatch. Closing with Pending points is forbidden; "Deferred is the explicit escape hatch and requires the user's word" (business-reviewer-unifier/SKILL.md:213-214). Each Deferred point carries a one-line reason. | Defer point N (with reason) / return to walkthrough | Return to walkthrough | Only when Pending points remain at close. |
| 9 | After close-out summary; on resume with `To run` rows | Hand-off launch offers: "Offer to start the first hand-off; each runs only on the user's word" (business-reviewer-unifier/SKILL.md:186-187). | Launch hand-off 1 / later | Later | Only when the Hand-offs block has `To run` rows. |
| 10 | Empty-argument resume in a terminal state | "otherwise report status and ask" (business-reviewer-unifier/SKILL.md:49): the session status card with the detected state and the open choices. | State-dependent | None | Only when every point is resolved, verification and close are done, and no hand-off rows remain `To run`. |

## 7. Work pipeline

| Stage | What happens | Key rules the product must enforce |
|---|---|---|
| 1. Intake | Detect the chain, resolve the SME domain, confirm panel composition (section 6, rows 1-3). | Three questions maximum; the confirmed SME domain is recorded in the tracker header (business-reviewer-unifier/SKILL.md:90-110). |
| 2. Panel dispatch | "One subagent per persona, dispatched in parallel in a single message" (business-reviewer-unifier/panel-orchestration.md:5). Each sub-agent gets: absolute paths to every in-scope document, the lineage context, its charter copied verbatim with the SME domain substituted, and the finding schema. Each returns "5 to 12 findings, the most material first" plus one line `Left out: <N> (<areas>)` (business-reviewer-unifier/panel-orchestration.md:49-52). | Fresh context per sub-agent, no exceptions. Final messages are raw structured data for the orchestrator, not prose for the user. |
| 3. Zero-findings re-dispatch | A reviewer returning zero findings (or only confirmatory remarks) is re-dispatched once with stronger adversarial framing (business-reviewer-unifier/panel-orchestration.md:57-64). | Once only. A still-clean reviewer is recorded in the tracker's Panel notes line with the areas and the evidence; "never invent findings to fill the gap" (business-reviewer-unifier/panel-orchestration.md:63-64). |
| 4. Merge | Orchestrator-only: "Merging is YOUR job, not an agent's" (business-reviewer-unifier/SKILL.md:135). Dedupe across personas under one surviving ID, assign `<ROLE>-NN` IDs, order by reviewer then sequence, write the tracker and the findings file, present the merge report. | "Two findings merge when they would be resolved by the same decision" (business-reviewer-unifier/panel-orchestration.md:69-70). Absorbed findings survive only as "merged with X-NN" references; partial overlaps noted as "<part> part: see X-NN". Weak citations rejected here (section 8). |
| 5. Walkthrough | One point at a time, titled `Point N (ID): <full concern description>`, tracker restated at each step, full four-block prose, then the ask (section 6, row 6). | Never a bare number; never terse option labels in place of the prose; the point's raw findings in `review-panel-findings.md` are read before presenting (business-reviewer-unifier/walkthrough-protocol.md:9-35). |
| 6. Apply | Immediately after each decision, chain-wide in the same step: enumerate every affected document (whatever restates, cites, counts, or depends on the changed content), edit all of them, write the decision-log register record, bump the version at the document's first change in the session, update the tracker row at once (business-reviewer-unifier/apply-and-verify.md:8-29, 87-89). | Content only, inside the owning skill's template structure. The tracker is never batch-updated at session end. |
| 7. Verify | One fresh cleared-context sub-agent hunts stale remnants (counts, batch numbers, references, superseded phrasing, citations to renamed files, template drift, lineage rows that disagree) and scores chain consistency out of 10 (business-reviewer-unifier/apply-and-verify.md:130-162). | The score is recorded "before the fixes; there is no second hunt" (business-reviewer-unifier/apply-and-verify.md:172-173). Confirmed remnants fixed under the Apply rules; lineage and owner items go to the hand-off; gated chunks keep their Stale mark and a close-out note. Fixture result: 8/10 pre-fix, 26 remnants (1 High, 5 Medium, 20 Low; those severity labels are that run's own, the skill's brief asks for none), 25 confirmed and fixed, 2 rejected (`_fixtures/chain/run-2026-10-01-review/review-comments-tracker.md:53`). |
| 8. Close | Verify fixes join each document's Changes Log row for the session; renames get citation checks; the Versioning block is completed; the Hand-offs block is written in chain order; the close-out summary is presented (business-reviewer-unifier/apply-and-verify.md:179-191). | The close checklist is all-or-nothing; no close with unresolved Pending points (section 9). |
| 9. Hand-offs | One row per request in chain order (BRDs, SDDs, LLDs), skipping unchanged documents. | Each runs only on the user's word, "as that skill's own request with its own stops" (business-reviewer-unifier/apply-and-verify.md:254-255). |

## 8. Review and decision loops

The five default personas (business-reviewer-unifier/SKILL.md:117-130, business-reviewer-unifier/reviewer-personas.md):

| ID | Persona | Angle (one line) |
|---|---|---|
| BO | Business Owner | Revenue model, GTM risk, moats and churn, phasing versus value tensions, legally gating items. |
| SME | Domain SME | Operational realism of the confirmed domain, regional and regulatory specifics, day-one integration expectations. |
| PM | Product Manager | KPIs, milestone-value sequencing, narrative versus feature-map drift, persona capability gaps. |
| PA | Principal Architect | Saga and compensation ownership, consistency contracts, boundary violations, event taxonomy. |
| DC | Document Consistency | Cross-doc contradictions, dangling references, citation hygiene, silent overrides. |

Optional add-ons, only on user request (business-reviewer-unifier/reviewer-personas.md:108-115): Security (SEC): trust boundaries, authN/authZ, PII, secrets, tenant isolation, abuse cases. Finance/Legal (FL): billing correctness, money movement, tax, liability, compliance. UX (UX): journey friction, state coverage, accessibility, i18n/RTL.

Finding schema, per finding (business-reviewer-unifier/panel-orchestration.md:21-27):

```
Reviewer: <BO|SME|PM|PA|DC|...>
Concern: <one short line, tracker-cell ready>
Where: <doc id + section, e.g., "01 §7" or "02 DOM-04">
Why: <one paragraph: the risk or gap and its consequence>
Direction: <one or two suggested resolution directions, one line each>
```

Citation discipline: no finding without a `Where`; "A finding without a precise location is rejected at merge time" (business-reviewer-unifier/reviewer-personas.md:5-7). "Somewhere in the BRD" is not a finding (business-reviewer-unifier/SKILL.md:62-63). Direction lines are seeds for the walkthrough options, never decisions.

Every persona charter shares three universal rules (business-reviewer-unifier/reviewer-personas.md:3-13): the evidence rule (every finding cites the exact document and section), the prohibitions (no confirmation, no echo, no praise, no summaries of what the documents already say), and the output schema above. The SME charter is the only one with a substituted parameter: the confirmed domain.

ID conventions: point IDs are `<ROLE>-NN`, assigned at merge in each reviewer's own sequence (BO-01, BO-02, SME-01, ...), and the tracker is ordered by reviewer then sequence; that order is stable even when the walkthrough order differs (business-reviewer-unifier/panel-orchestration.md:76-80). Merged-away findings keep their ID only as a reference inside the surviving row's Concern cell ("merged with PA-05"); a partial overlap adds "<part> part: see X-NN". IDs inside owned documents keep the owner's schemes (`OI-NN`, `TD-NN`, gate rows, Changes Log versions): the review's decision record names the owner's item it answers, and the owning skill raises or closes its own items at hand-off (business-reviewer-unifier/apply-and-verify.md:58-63).

Point status enum, exactly six values (business-reviewer-unifier/SKILL.md:198-199):

| Status | Meaning |
|---|---|
| Pending | Not yet presented or not yet decided. |
| Decided | The user chose; edits are not yet made. |
| Applied | Every affected document the review may edit reflects the decision; the rest is named in a hand-off. |
| Partially applied | Accepted parts applied; the Decision cell names the declined parts or the part recorded under Skill changes requested. |
| Rejected | One-line reason in the Decision cell. |
| Deferred | One-line reason in the Decision cell; set only on the user's word, at any point's decision (business-reviewer-unifier/SKILL.md:213-214, business-reviewer-unifier/tracker-schema.md:69). |

Semantics per business-reviewer-unifier/tracker-schema.md:62-69.

Decision mechanics per point: the user accepts the recommendation, adjusts to another tabled option, or dictates a custom free-text decision. The Decision cell records what was actually decided, which may exceed or fall short of the recommendation (business-reviewer-unifier/walkthrough-protocol.md:41-43). Nothing is applied without an explicit decision: a recommendation is not an approval (business-reviewer-unifier/SKILL.md:67-69).

Open remainders: a question a decision leaves for the document's owner is stated as the open remainder in the decision record, and the hand-off asks the owner to record it under its own rules: an open item in an SDD or LLD; in a BRD, a to-do item with its owner and source, plus an open item when it needs a business choice; for a pre-BRD point, the tracker's Decision cell states it and the BRD hand-off records it (business-reviewer-unifier/apply-and-verify.md:78-86). The review writes the register records; the owning skills raise and close their own `OI-NN` and `TD-NN` items (see [08-states-and-vocabulary.md](08-states-and-vocabulary.md)).

## 9. Gates and states

| Gate | Rule | Evidence |
|---|---|---|
| Close gate | No closing with unresolved Pending points. Deferred is the explicit escape hatch and requires the user's word (business-reviewer-unifier/SKILL.md:213-214). | Tracker Progress line shows zero Pending. |
| Hand-off launch | Each hand-off row runs only on the user's word, launched as the owning skill's own request. | Hand-offs block row states `To run` / `Done` (business-reviewer-unifier/tracker-schema.md:79-82). |
| Hand-off done evidence, BRD | A consistency check run recorded in chunk 14 after the review. | Chunk 14 run record post-dating the review (business-reviewer-unifier/apply-and-verify.md:249). |
| Hand-off done evidence, SDD | A Reconciled entry after the review, with its step 6a order evidence (a date alone does not prove the order). | An ordered entry, dated after the review, on the `**Reconciled:**` line of the SDD master's Generation Progress (combined SDD: its cover block) (business-reviewer-unifier/apply-and-verify.md:250-251, sdd-unifier/SKILL.md:247). |
| Hand-off done evidence, LLD | `16-references.md` § 19.1 naming the new SDD version. | The LLD's lineage record (business-reviewer-unifier/apply-and-verify.md:252). |
| Gated chunks | BRD 15-17 and SDD 19 are never edited by the review, whether the gate is open or shut; the review only sets the Stale mark (and repoints links on rename). The owner refreshes through its gated step after the hand-off (business-reviewer-unifier/apply-and-verify.md:118-128). | Stale marks visible in chunk status lines, chunk 14 rows, and master tables. |
| Sign-off after a review | The review never adds or changes a gate condition: gate conditions are the owning skill's structure (business-reviewer-unifier/apply-and-verify.md:37). A changed BRD whose cover Status read `Approved` gets Status `In Review` and the change date; the session's Changes Log row keeps its Reviewed By and Approved By cells empty until the owner approves the new version (business-reviewer-unifier/apply-and-verify.md:93-95, 108-110). A decision that asks for a sign-off gate is applied where it fits the current structure, the gate goes under Skill changes requested, and the point is Partially applied (business-reviewer-unifier/apply-and-verify.md:73-77). | Cover Status; the empty Approved By cell; the tracker's Skill changes requested block |

Session states for resume: the tracker is the single source of truth and survives the session (business-reviewer-unifier/SKILL.md:64-66). Phase detection (section 5) reconstructs the exact resumption point from tracker state alone; render the same detection as a session status card:

| Tracker state | Detected phase | Status card | Allowed actions |
|---|---|---|---|
| No tracker | `panel` | No review session | Run panel |
| Pending points | `walkthrough` | Walkthrough, N of M resolved | Resume walkthrough; ask-for-more if not started |
| Decided points not yet applied | `apply` | Decisions pending apply | Run apply |
| All points closed, no Verification pass | `verify` (offered) | Ready to verify | Run verify; Deferred only on the user's word |
| Verification pass, no Hand-offs block | close (step 7) | Ready to close | Run close |
| Hand-offs rows `To run` | next hand-off (offered) | Hand-offs pending | Launch the next row |
| All rows `Done` | report status and ask | Session complete | Report only |

## 10. Handoffs

Downstream requests, written as the Hand-offs block in chain order, one row per request, skipping unchanged documents (`None` when no document changed) (business-reviewer-unifier/apply-and-verify.md:202-242):

| # | To | Exact request phrase | When written | What the owning skill does with it |
|---|---|---|---|---|
| 1 | Each changed BRD: brd-unifier ([03](03-agent-brd.md)) | "update the todo: decisions from the business review of [the tracker's Created date] ([tracker path])" | The review changed this BRD | First checks whether an earlier update took this review: a Changes Log row, a Business review register entry in `decision-log.md`, or a chunk 14 consistency run whose Trigger names this review, newer than the review's own Changes Log row, that records its hand-off. If one did and the review has no row after it, the hand-off is already taken: it says so with that version, applies any `Decided - pending application` items, and changes nothing else (a new consistency run only when the user asks for one); if the review has rows after it, the steps cover those rows only. Otherwise it checks the review-applied decisions rather than re-applying them, closes the open items they answer (Outcome "Settled by business review [point ID]"), records each open remainder as a to-do item with owner and source (plus an open item for business choices), reruns the consistency check, refreshes `14-todo.md` and the delivery gate (brd-unifier/SKILL.md:318). |
| 1b | A BRD made from a changed pre-BRD: brd-unifier ([03](03-agent-brd.md)) | Same phrase, naming the changed pre-BRD chunks | The review changed a pre-BRD this BRD derives from, even if the BRD itself did not change | As row 1. pre-brd-unifier has no update request of its own, so this is the pre-BRD's only hand-off (business-reviewer-unifier/apply-and-verify.md:207-210). |
| 2 | Each affected SDD: sdd-unifier ([04](04-agent-sdd.md)) | "BRD [KEY] has a new version, after the business review of [the tracker's Created date] ([tracker path])", naming every changed source BRD in one request | Source BRDs changed | First checks whether an earlier update took this review: a Changes Log row or Reconciled entry, newer than the review's own Changes Log rows, that records its hand-off. If one did and the review has no row after it, the hand-off is already taken: it says so with that version, applies any pending items, runs the Child LLDs check, and changes nothing else (a new delta review of the review's chunks only when the user asks for one); if the review has rows after it, the steps cover those rows only. Otherwise it reruns the contract reconciliation (step 6a, §7.3 included) in one update with at most one more version (the review's own bump stands), closes or supersedes the open items and markers the review's decisions answer, raises an open item per open remainder, checks the Child LLDs table, keeps or sets chunk 19's Stale mark, runs the delta review (sdd-unifier/SKILL.md:372-373, business-reviewer-unifier/apply-and-verify.md:223-226). |
| 2b | Each changed SDD: sdd-unifier ([04](04-agent-sdd.md)) | "the business review changed this SDD" | Only the SDD changed | As row 2, take-once check included; reads the review's Changes Log row and tracker directly (sdd-unifier/SKILL.md:373). |
| 3 | Each child LLD: lld-unifier ([05](05-agent-lld.md)) | "the SDD has a new version" | The parent SDD changed | Its step 3c version check reads the `Chunks:` lists of the SDD Changes Log rows since the recorded version, makes one offer (mapped LLD chunks plus the trace when use cases, test cases, or screens changed), runs one update with one version, ends with a delta review (business-reviewer-unifier/apply-and-verify.md:236-242). |

Product consequence of the take-once checks: launching row 1, 1b, 2, or 2b again after its owner took the review is a reported no-op on the owner's side (brd-unifier/SKILL.md:318, sdd-unifier/SKILL.md:373). The launcher counts that "already taken" answer as `Done` evidence (decided 2026-10-08, [09-open-decisions.md](09-open-decisions.md) D12, option a).

Upstream: none. The Review Panel is triggered by the user after documents exist; no other agent may auto-trigger it.

## 11. Edge cases and failure modes

| Case | Handling |
|---|---|
| LLD exclusion | Structural, with no opt-in: the detection list names "numbered business docs, a pre-BRD when there is one, BRD chunk folders, SDDs" and "LLD folders are not reviewed" (business-reviewer-unifier/SKILL.md:94-99). LLDs enter only as lineage context, and "An LLD is never edited" (business-reviewer-unifier/apply-and-verify.md:64); its hand-off carries the change. The UI must not offer an LLD checkbox in scope selection. |
| pre-BRD absent | Never mentioned: "when the project has none, the review never mentions one" (business-reviewer-unifier/SKILL.md:96-97). No empty rows, no placeholder copy. |
| pre-BRD present | A pre-BRD has no version and no decision log: its story stays in the tracker (the Versioning block lists its changed chunks), and its hand-off rides on the derived BRD's row (business-reviewer-unifier/apply-and-verify.md:98-100, 207-210). Its investor assessment (chunk 23) is never rewritten; the close-out notes that its verdict predates the change (business-reviewer-unifier/apply-and-verify.md:69-71). |
| Conflicting persona points | Merged pre-walkthrough under one surviving ID when "they would be resolved by the same decision" (business-reviewer-unifier/panel-orchestration.md:69-70); the user resolves each concern once. |
| Zero-findings reviewer | Re-dispatched once with stronger framing; a still-clean reviewer is recorded in the Panel notes line with areas and evidence; findings are never invented (business-reviewer-unifier/panel-orchestration.md:57-64). |
| Verify returns zero remnants on a session with major structural decisions | Suspect: re-dispatch once with the stale-remnant categories spelled out (business-reviewer-unifier/apply-and-verify.md:175-177). |
| Lineage row behind only because this session bumped a version | Expected, not a remnant: the verify agent lists it under "For the hand-off" (business-reviewer-unifier/apply-and-verify.md:158-159); the hand-off carries it to the owner. |
| Structure-versus-content decision | A decision needing a template change (new column, status value, gate condition, ID scheme) is applied only in the part that fits the current structure; the rest goes to the tracker's Skill changes requested block and the point becomes Partially applied, naming that part. The options table says so before the decision (business-reviewer-unifier/apply-and-verify.md:73-86, business-reviewer-unifier/walkthrough-protocol.md:24-28). |
| Nothing changed | The Hand-offs block reads `None` (business-reviewer-unifier/tracker-schema.md:43-44). |

## 12. UI and productization requirements

Screens and dashboards:

| Screen | Contents |
|---|---|
| Panel progress screen | Five persona job cards (six or more with add-ons), each with dispatch state, finding count, and its `Left out` count and areas; a visible event for the zero-findings re-dispatch. |
| Merge report card | Total raw findings, merges performed, final point count, per-reviewer counts, each `Left out` line, and the per-reviewer "ask this reviewer for more" action (usable once, expires at walkthrough start). |
| Point triage queue | The tracker restated per step as a compact table (ID, short concern, status), the current point marked, status chips from the six-value enum (section 8). |
| Point detail page | The four-block prose: Issue with doc/section deep links (quote or paraphrase of the offending text), Why it matters, options table of 2 to 4 with one-line trade-offs (options that need a template change flagged as partial skill changes), highlighted Recommendation, and Accept / Adjust / custom free-text controls. Security points prepend the first-principles explainer. |
| Decision batching control | The walkthrough-start choice (section 6, row 5): tracker order versus picked order (the skill's offer); apply per point versus decide everything first (a product addition: the skill decides everything first only when the user asks). Shown once per session. |
| Live tracker sidebar | The Progress line recomputed at every update: "N of M decision points resolved (R raw comments, K merges)" (business-reviewer-unifier/tracker-schema.md:35). Fixture instance: "39 of 39 decision points resolved: 39 Applied, 0 Pending (60 raw comments, 21 merged into 15 surviving rows)" (`_fixtures/chain/run-2026-10-01-review/review-comments-tracker.md:51`). |
| Verification report view | The pre-fix score out of 10 (recorded before fixes, no second hunt), the numbered remnant list with each remnant's point ID and disposition: fixed, left for the hand-off, rejected with reason, or found while confirming; gated-chunk remnants shown as close-out notes (business-reviewer-unifier/apply-and-verify.md:164-175, business-reviewer-unifier/tracker-schema.md:39-40). The skill assigns no severity; a severity column would be a product addition. |
| Close-out dashboard | Points by status, major structural decisions, skill changes requested, files touched, new versions per document, and the Hand-offs list as launchable confirmed tasks with `To run` / `Done` state and per-owner done evidence (section 9). |

Decision queue items (the product owner is the decider): intake confirmations (scope, SME domain, panel composition), every point decision, remnant adjudications, Deferred authorizations, ask-for-more actions, and every hand-off launch. The SME domain confirmation is a mandatory blocking item, never a default.

Notifications:

| Notification | When |
|---|---|
| Panel dispatched | Five persona sub-agents launched in one message. |
| Persona complete, or zero-findings re-dispatch | Per persona job card; the re-dispatch event is shown, not hidden. |
| Merge report ready | Tracker and findings file written; walkthrough can start. |
| Point applied | Decision applied chain-wide; version bump at the document's first change; tracker row updated at once. |
| Verification complete | Pre-fix score and remnant count available. |
| Session closed | Close-out summary ready; first hand-off offered. |
| Hand-off row flipped | `To run` to `Done` on the user's word or the owner's own record. |

Hard to productize:

1. SME domain inference and confirmation is a mandatory human gate; the platform may pre-fill from document framing but must never auto-accept, and must reject product-category labels.
2. Persona-merge judgment is semantic and orchestrator-only; do not delegate it to a sub-agent or an automatic dedupe heuristic. Surface citation quality, because weak citations are rejected at merge.
3. Chain-wide apply is the hardest automation: enumerating every document that restates, cites, counts, or depends on changed content across free-form markdown is the main source of remnants the verify stage exists to catch.
4. Recommendation quality: each point needs generated prose with real trade-offs, and security points need first-principles explainers; budget model capacity for this.
5. Hand-off gating is deliberately manual: confirmed task launches through the handoff launcher, never automatic triggers.

## 13. Handoff inventory

The close-out summary the agent must surface at session close (business-reviewer-unifier/SKILL.md:184-187, business-reviewer-unifier/apply-and-verify.md:189-191):

| Inventory field | Source |
|---|---|
| Points by status | Tracker table, tallied by the six-value enum (fixture close: "5 Applied; 1 Rejected; 0 Pending, Decided, Partially applied or Deferred", `_fixtures/chain/run-2026-10-07-review/review-comments-tracker.md:48`). |
| Major structural decisions taken during the session | Tracker footer block: decisions that changed the shape of the plan (phase moves, reclassifications, deployment-model corrections, a use case, service, event, or objective added, removed, or narrowed), not every applied edit (business-reviewer-unifier/tracker-schema.md:86-90). |
| Skill changes requested | Tracker footer block: structure a decision needed (column, status value, gate condition, ID scheme), each with its skill and point ID; `None` when empty. |
| Files the session touched | Full list, including renames. |
| New versions per document | The completed Versioning block: per-doc old-to-new versions, Changes Log rows, renames, citation updates; changed pre-BRD chunks listed in place of a version (fixture: REFUNDS 1.0 to 1.1, LOYALTY to 1.3, SDD to 1.3, `_fixtures/chain/run-2026-10-01-review/review-comments-tracker.md:82-86`). |
| Verification score and remnant dispositions | The Verification pass block: pre-fix score, remnant count, one line per remnant (its fix, the hand-off that takes it, the close-out note of a gated chunk, or why it was rejected). |
| Hand-offs list | Every row with its exact request phrase, its `To run` / `Done` state, and the per-owner done evidence accepted (section 9). Gated chunks waiting for their gate appear as a close-out note, not a row (business-reviewer-unifier/tracker-schema.md:81-82). |
| pre-BRD verdict note | When the session changed a pre-BRD: its investor assessment (chunk 23) was not rewritten, and the close-out notes that its verdict predates the change (business-reviewer-unifier/apply-and-verify.md:69-71). |
