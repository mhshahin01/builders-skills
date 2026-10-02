# Business Reviewer Unifier

A multi-angle adversarial review panel for business and design documents, driven all the way to resolution. Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

---

## What

`business-reviewer-unifier` runs a panel of five reviewer personas over a document chain (pure-business docs, domain identification, service boundaries, project preparation, a pre-BRD when there is one, BRDs, SDDs), merges their findings into a persistent tracker, walks the user through each finding one point at a time with full context, applies accepted decisions across every affected document (bumping each changed document's version once), verifies consistency, and hands the changed documents back to the skills that own them.

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
- **The chain stays whole.** A BRD or SDD made by `brd-unifier` or `sdd-unifier` keeps its template structure (tables, status values, gates, lineage, contract registries): a decision changes content, and a needed structural change is listed as a skill change instead. LLDs and gated chunks are never edited. A document's version is bumped at its first change in the session, and the close hands the chain back to the owning skills, which re-check what depends on the change (the BRD's consistency check and delivery gate, the SDD's reconciliation and lineage, each LLD's refresh). The panel itself does not check §7.3 or registry consistency; `sdd-unifier` re-checks them at the hand-off.
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
| `verify` | Cleared-context consistency re-review, then the close and the hand-offs to the owning skills. |
| (empty) | Detect the phase from the tracker state: no tracker means `panel`; Pending points means `walkthrough`; decided but unapplied points means `apply`; all points closed but unverified means `verify`; verified with hand-offs still to run means offering the next hand-off. |

Invocation prefix depends on the agent: `/business-reviewer-unifier panel` in Claude Code, `$business-reviewer-unifier panel` in Codex, `/skill:business-reviewer-unifier panel` in Kimi Code. Or describe the task in plain words ("review the BRD and SDD from different angles") and the agent picks the skill from its description.

### The workflow

1. **Intake.** At most three questions: which documents are in scope (default: the whole chain), the SME domain (mandatory, the customer's business, never a product category), and the panel composition (default five personas). A pre-BRD is reviewed when the project has one; otherwise it is never mentioned. LLDs are not reviewed; each child LLD's version record goes to the reviewers as lineage context, so a lineage finding compares both ends.
2. **Panel dispatch.** One cleared-context subagent per persona, in parallel, each with the full document chain, the lineage context, its charter, and the finding schema.
3. **Merge and tracker.** Duplicates across personas are merged under one ID, findings get `<ROLE>-NN` IDs, and `review-comments-tracker.md` is written per `tracker-schema.md`.
4. **Walkthrough.** One point at a time, presented in chat with full prose: the issue and its exact location, why it matters, an options table with trade-offs, and an explicit recommendation. The tracker table is restated at each step.
5. **Apply.** Immediately after each decision, the change is applied to every affected document, within the structure its owning skill defines, and the tracker row is updated. A document's first change in the session bumps its version and opens one Changes Log row naming the review.
6. **Verify.** A fresh cleared-context agent re-reviews for stale remnants of the changes, structures that drifted from the owning skill's templates, and lineage rows that disagree with the other end; fixes are applied and the pass is scored in the tracker.
7. **Close and hand off.** The Changes Log rows take the verify fixes, files are renamed where the version is in the filename, and the tracker lists the hand-offs in chain order: `brd-unifier` "update the todo" for each changed BRD, then `sdd-unifier` "BRD `KEY` has a new version" (or "the business review changed this SDD"), then `lld-unifier` "the SDD has a new version" for each child LLD (plus "refresh the trace" when a BRD's use cases, test cases, or screens changed). The close-out summary names each hand-off with its request; each runs on the user's word.

### Outputs

- `review-comments-tracker.md` in the project root: persistent, survives the session, updated after every point. It also records the version bumps, the hand-offs to the owning skills, and any skill changes the decisions needed.
- Updated documents across the chain, with version bumps and changelog entries.

### Reference files

| File | Contents |
| ---- | -------- |
| `reviewer-personas.md` | Charters for the five default personas, the SME charter template, optional add-ons |
| `panel-orchestration.md` | Subagent dispatch, finding schema, zero-findings re-dispatch, merge rules |
| `tracker-schema.md` | Tracker structure, columns, status vocabulary, footer sections |
| `walkthrough-protocol.md` | The point-presentation contract |
| `apply-and-verify.md` | Chain-wide application rules (content within the owning skill's structure, versions at the first change), verification pass brief, close checklist, hand-offs to the owning skills |
