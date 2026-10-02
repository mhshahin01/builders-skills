---
name: business-reviewer-unifier
description: >-
  Run a multi-angle adversarial review panel over business and design documents (business docs,
  domain identification, service boundaries, project preparation, pre-BRDs, BRDs, SDDs) and drive the findings
  to resolution. Use when asked to review documents from different angles, run a review panel or
  multi-agent review, challenge the docs, do a business review, resume a review, walk through review
  points, apply review comments, or verify applied changes. Keeps a review-comments-tracker.md in
  the project root. Arguments: [panel|walkthrough|apply|verify]; with none, the phase is detected
  from the tracker. This is the cross-document panel, not the single reviewer pass built into
  brd-unifier, sdd-unifier, and pre-brd-unifier.
---

# Business Reviewer Unifier

Run an adversarial, multi-persona review of a business document chain, merge
the findings into a persistent tracker, walk the user through each point with
full context, apply decisions chain-wide, then verify and version.

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

## Argument parsing (do this first)

`business-reviewer-unifier [panel|walkthrough|apply|verify]`

| Argument | Action |
|---|---|
| `panel` | Dispatch the reviewer panel, merge findings, write the tracker. Stop. |
| `walkthrough` | Resume point-by-point resolution from the existing tracker. |
| `apply` | Apply all Decided-but-unapplied points chain-wide. |
| `verify` | Cleared-context consistency re-review, then the close and the hand-offs to the owning skills. |
| (empty) | **Detect from tracker state:** no `review-comments-tracker.md` means `panel`; Pending points mean `walkthrough`; Decided points not yet applied mean `apply`; every point closed (Applied, Partially applied, Rejected, Deferred) but no Verification pass means offer `verify`; a Verification pass but no Hand-offs block means the close (step 7); Hand-offs rows still `To run` mean offer the next one; otherwise report status and ask. |

The empty-argument default runs `panel` then flows into `walkthrough`
(announce the transition). `apply` happens per point during walkthrough,
not as a deferred batch, unless the user asks to decide everything first.

---

## Core principles

1. **Adversarial, not confirmatory.** A reviewer returning zero findings is
   re-dispatched with stronger adversarial framing. Reviewers find what is
   missing; they never echo or praise what is present.
2. **Every finding cites exact doc + section.** "Somewhere in the BRD" is not
   a finding.
3. **The tracker is the single source of truth** and survives the session.
   It lives at `./review-comments-tracker.md` and is updated after every
   applied point, never in batch at the end.
4. **Nothing is applied without an explicit decision.** A recommendation is
   not an approval. Partial acceptance is recorded as Partially applied with
   the declined parts named.
5. **Merge duplicates before walkthrough.** Overlapping findings across
   personas are merged under one ID; the user resolves each concern once.
6. **Chain-wide consistency.** A decision is not Applied until every affected
   document reflects it: counts, IDs, citations, supersession notes.
7. **The SME is domain-bound, never defaulted.** See Intake. A product
   category (PropTech, FinTech, HealthTech) is an invalid SME domain.
8. **One point in flight at a time** during walkthrough, presented with full
   context per `walkthrough-protocol.md`.
9. **The owning skill keeps its documents whole.** A pre-BRD, BRD, or SDD
   made by pre-brd-unifier, brd-unifier, or sdd-unifier keeps its template
   structure: a decision changes content, never that structure. An LLD is
   never edited. The first content change to a document bumps its version
   as its own rule says, and the close hands the chain back to the owning
   skills (`apply-and-verify.md`).

---

## Workflow

### 1. Intake (panel phase)

Ask at most three questions, skipping anything already in context:

- **Document chain**: list the docs detected in the project root (numbered
  business docs, a pre-BRD when there is one, BRD chunk folders, SDDs) and
  confirm which are in scope. Default: the whole chain. The pre-BRD is
  optional: when the project has none, the review never mentions one.
  LLD folders are not reviewed. When an SDD in
  scope lists child LLDs, each LLD's version record goes to the reviewers
  as lineage context only: its master, `00-metadata.md` (Changes Log), and
  `16-references.md` § 19.1 (the SDD version it read).
- **SME domain**: MANDATORY. Resolve in this order: (a) explicit in the
  invocation, (b) inferable from the docs' own framing; if inferred, restate
  it and ask for confirmation before dispatching, (c) ask the user outright.
  The domain is the CUSTOMER'S business (who operates with this product and
  what they operate), not the product's tech category. Record the confirmed
  domain in the tracker header.
- **Panel composition**: default five personas (below). Offer optional
  add-ons (Security, Finance/Legal, UX) in one line; add only on request.

### 2. Panel dispatch

Dispatch one cleared-context subagent per persona, in parallel, per
`panel-orchestration.md`. Each receives: absolute paths to the full doc
chain, the lineage context from Intake when there is one, its charter from
`reviewer-personas.md`, and the finding schema.
Personas:

- **Business Owner (BO)**: revenue model, GTM risk, moats/churn, phasing vs
  value tensions, legally gating items.
- **Domain SME (SME)**: operational realism of the confirmed domain,
  regional/regulatory specifics, workflows the docs idealize away,
  integrations operators expect day one.
- **Product Manager (PM)**: KPIs, milestone-value sequencing, narrative vs
  feature-map drift, persona capability gaps, triggers for "beyond" items.
- **Principal Architect (PA)**: saga/compensation ownership, consistency
  contracts, boundary violations, event taxonomy, evolution triggers.
- **Document Consistency (DC)**: cross-doc contradictions, dangling
  references, citation hygiene, silent overrides between documents.

Zero-findings rule applies per reviewer (Core principle 1).

### 3. Merge and tracker creation

Merging is YOUR job, not an agent's. Dedupe overlapping findings across
personas (record "merged with X-NN" on both sides), assign `<ROLE>-NN` IDs,
write the tracker per `tracker-schema.md`. Present the tracker summary:
total findings, merges, per-reviewer counts.

### 4. Walkthrough (point-by-point)

Follow `walkthrough-protocol.md` exactly. Summary of the contract:

- One point at a time, titled **"Point N (ID): full description"**, never a
  bare number.
- Tracker table restated at each step (ID, concern, status).
- Full prose per point, in chat: 1) the issue and exactly which document and
  section it lives in, 2) why it matters, 3) options table with trade-offs,
  4) explicit recommendation. Then ask for acceptance.
- Never substitute terse AskUserQuestion option labels for that prose.
- Security topics get first-principles explanations before the decision ask.
- Expect decisions beyond the recommendation; record what was decided.

### 5. Apply (per point, immediately after decision)

Apply chain-wide in the same step: every affected document, including
downstream BRD/SDD chunks that cite the changed content. Change content
only, inside the structure the owning skill defines, and bump a document's
version at its first change in the session (`apply-and-verify.md` § Apply).
Update the tracker row to Applied (or Partially applied / Rejected /
Deferred) immediately.

### 6. Verify (after all points closed)

Dispatch a fresh cleared-context agent to hunt stale remnants of the
decisions: counts, batch numbers, section references, superseded phrasing,
citations to renamed files, template structure that drifted, and lineage
rows that disagree with the version record at their other end. Fix what it
confirms, except what belongs to the hand-off (`apply-and-verify.md` §
Verify); record the pass and score in the tracker.

### 7. Close and hand off

Add the verify fixes to each changed document's Changes Log row for this
session, check the citations to any renamed file, and complete the
Versioning block in the tracker. Then write the Hand-offs block: the owning
skills re-check the changed documents in chain order (`apply-and-verify.md`
§ Hand-off).
Present the close-out summary: points by status, structural decisions list,
skill changes requested, files touched, new versions, and the hand-offs with
the request to give each skill. Offer to start the first hand-off; each runs
only on the user's word.

---

## Output conventions

- Tracker file: `./review-comments-tracker.md` (project root, persistent).
- Finding IDs: `<ROLE>-NN` (BO-01, SME-03, PM-06, PA-12, DC-05).
- Status vocabulary: Pending | Decided | Applied | Partially applied |
  Rejected | Deferred.
- Encoding UTF-8, LF. Pipe tables, no hard wrap.

---

## Things this skill never does

- Never applies a Pending point.
- Never raises a point as a bare number without its description and the
  tracker restated.
- Never uses terse AskUserQuestion option labels in place of the full prose
  presentation for review decisions.
- Never defaults the SME domain or accepts a product category as a domain.
- Never lets a reviewer's zero-findings result stand unchallenged.
- Never marks the run complete with unresolved Pending points (Deferred is
  the explicit escape hatch and requires the user's word).
- Never pads reviewer output with invented findings to look thorough.
- Never batches tracker updates to the end of the session.
- Never changes the template structure of a pre-BRD, BRD, or SDD (the list
  in `apply-and-verify.md`, Apply rule 6), and never edits an LLD or a gated
  chunk: a decision that needs a structural change becomes a skill change
  for the user, and what the owning skill updates goes to the hand-off.
- Never leaves a document whose content changed at its old version, and
  never closes a session without the hand-offs to the owning skills in the
  tracker.

---

## Reference files

- `reviewer-personas.md`: charters for the five default personas, the SME
  charter template, and optional add-on personas.
- `panel-orchestration.md`: subagent dispatch, finding schema,
  zero-findings re-dispatch, merge rules.
- `tracker-schema.md`: tracker file structure, columns, status vocabulary,
  footer sections.
- `walkthrough-protocol.md`: the point-presentation contract.
- `apply-and-verify.md`: chain-wide application rules (content within the
  owning skill's structure, versions at the first change), verification
  pass brief, close checklist, and the hand-offs to the owning skills.
