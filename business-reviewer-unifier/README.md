# Business Reviewer Unifier

A multi-angle adversarial review panel for business and design documents, driven all the way to resolution. Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

---

## What

`business-reviewer-unifier` runs a panel of five reviewer personas over a document chain (pure-business docs, domain identification, service boundaries, project preparation, BRDs, SDDs), merges their findings into a persistent tracker, walks the user through each finding one point at a time with full context, applies accepted decisions across every affected document, then verifies consistency and bumps versions.

The default panel:

| Persona | Angle |
| ------- | ----- |
| Business Owner (BO) | Revenue model, GTM risk, moats and churn, phasing vs value, legally gating items |
| Domain SME (SME) | Operational realism of the confirmed business domain, regional and regulatory specifics |
| Product Manager (PM) | KPIs, milestone-value sequencing, narrative drift, persona capability gaps |
| Principal Architect (PA) | Saga ownership, consistency contracts, boundary violations, event taxonomy |
| Document Consistency (DC) | Cross-document contradictions, dangling references, silent overrides |

Optional add-on personas (Security, Finance/Legal, UX) are available on request. Findings carry `<ROLE>-NN` IDs (BO-01, SME-03) and move through a fixed status vocabulary: Pending, Decided, Applied, Partially applied, Rejected, Deferred.

This is the cross-document panel. It is separate from the single-agent reviewer pass built into `brd-unifier`, `sdd-unifier`, and `pre-brd-unifier`, which reviews one document at generation time.

## Why

Single-pass reviews confirm what is already written; they rarely hunt for what is missing. This skill exists to close that gap and to make sure findings do not die in a chat log:

- **Adversarial by contract.** A reviewer that returns zero findings is re-dispatched with stronger adversarial framing. Reviewers find gaps; they never echo or praise.
- **Every finding is actionable.** Each one cites the exact document and section, and carries options with trade-offs plus an explicit recommendation.
- **Findings survive the session.** The tracker (`review-comments-tracker.md` in the project root) is the single source of truth and is updated after every applied point, never in a batch at the end.
- **One concern, resolved once.** Overlapping findings across personas are merged under one ID before the walkthrough, so the user never answers the same question twice.
- **Decisions stick chain-wide.** A point is not Applied until every affected document reflects it, including downstream BRD and SDD chunks that cite the changed content. A cleared-context verification pass then hunts stale remnants (counts, references, superseded phrasing).
- **Nothing is applied silently.** A recommendation is not an approval; partial acceptance is recorded as Partially applied with the declined parts named.

## How

### Usage

```text
business-reviewer-unifier [panel|walkthrough|apply|verify]
```

| Argument | Action |
| -------- | ------ |
| `panel` | Dispatch the reviewer panel, merge findings, write the tracker. Stop. |
| `walkthrough` | Resume point-by-point resolution from the existing tracker. |
| `apply` | Apply all Decided-but-unapplied points chain-wide. |
| `verify` | Cleared-context consistency re-review, then versioning and changelogs. |
| (empty) | Detect the phase from the tracker state: no tracker means `panel`; Pending points means `walkthrough`; all points closed but unverified means `verify`. |

Invocation prefix depends on the agent: `/business-reviewer-unifier panel` in Claude Code, `$business-reviewer-unifier panel` in Codex, `/skill:business-reviewer-unifier panel` in Kimi Code. Or describe the task in plain words ("review the BRD and SDD from different angles") and the agent picks the skill from its description.

### The workflow

1. **Intake.** At most three questions: which documents are in scope (default: the whole chain), the SME domain (mandatory, the customer's business, never a product category), and the panel composition (default five personas).
2. **Panel dispatch.** One cleared-context subagent per persona, in parallel, each with the full document chain, its charter, and the finding schema.
3. **Merge and tracker.** Duplicates across personas are merged under one ID, findings get `<ROLE>-NN` IDs, and `review-comments-tracker.md` is written per `tracker-schema.md`.
4. **Walkthrough.** One point at a time, presented in chat with full prose: the issue and its exact location, why it matters, an options table with trade-offs, and an explicit recommendation. The tracker table is restated at each step.
5. **Apply.** Immediately after each decision, the change is applied to every affected document and the tracker row is updated.
6. **Verify.** A fresh cleared-context agent re-reviews for stale remnants of the structural changes; fixes are applied and the pass is scored in the tracker.
7. **Version and close.** In-document versions are bumped, changelogs name the review session, files are renamed where the version is in the filename, and a close-out summary is presented.

### Outputs

- `review-comments-tracker.md` in the project root: persistent, survives the session, updated after every point.
- Updated documents across the chain, with version bumps and changelog entries.

### Reference files

| File | Contents |
| ---- | -------- |
| `reviewer-personas.md` | Charters for the five default personas, the SME charter template, optional add-ons |
| `panel-orchestration.md` | Subagent dispatch, finding schema, zero-findings re-dispatch, merge rules |
| `tracker-schema.md` | Tracker structure, columns, status vocabulary, footer sections |
| `walkthrough-protocol.md` | The point-presentation contract |
| `apply-and-verify.md` | Chain-wide application rules, verification pass brief, versioning checklist |
