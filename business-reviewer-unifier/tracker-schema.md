# Tracker Schema

File: `./review-comments-tracker.md` in the project root. Persistent across
sessions; updated after every applied point, never batched to session end.
One tracker is one review session (`apply-and-verify.md`). It is also the
record of what the session versioned and what it handed to the owning
skills.

## Template

```markdown
# Review Comments Tracker

**Created:** YYYY-MM-DD
**Source:** Multi-agent review of <doc list with versions at review time>
**Reviewers:** Business Owner (BO), <Domain> SME (SME), Product Manager (PM),
Principal Architect (PA), Document Consistency (DC)[, add-ons]
**SME domain:** <confirmed domain, e.g., residential compound and community operations>
**Status values:** Pending | Decided | Applied | Partially applied | Rejected | Deferred

| ID | Reviewer | Concern (short) | Target doc(s) | Status | Decision |
|----|----------|-----------------|---------------|--------|----------|
| BO-01 | Business Owner | <short concern> | 01 §7 | Pending | |

**Progress:** <N of M decision points resolved (R raw comments, K merges)>

**Versioning (YYYY-MM-DD):** <per-doc version bumps (old to new, the Changes Log row), renames, citation updates>

**Verification pass (YYYY-MM-DD):** <score, remnants found and fixed>

**Hand-offs (YYYY-MM-DD):**
1. <skill>: "<request>" on <document> - To run | Done
(or `None` when no document changed)

**Skill changes requested:**
1. <skill>: <structure and the change a decision needed> (<point ID>)
(or `None`)

**Major structural decisions taken during this session:**
1. <decision>
```

## Column rules

- **ID**: `<ROLE>-NN`. Merged findings noted inside the Concern cell of the
  surviving row ("merged with PA-05") and the absorbed row is not listed
  separately.
- **Concern (short)**: one line, readable without the source documents.
- **Target doc(s)**: doc ids + sections, comma-separated; update if apply
  reveals more affected docs than the reviewer cited.
- **Status**: exactly one of the six values. Decided means the user chose
  but edits are not yet made; Applied means every affected doc reflects it.
- **Decision**: filled at decision time; states what was ACTUALLY decided
  (which may exceed or fall short of the recommendation). For Partially
  applied, name the declined parts, or the part recorded under Skill
  changes requested. For Rejected/Deferred, one-line reason.

## Footer rules

- **Progress** line is recomputed at every update.
- **Versioning** gets a line when a point first changes a document
  (`apply-and-verify.md`, Apply rule 7) and is completed at the close. A
  pre-BRD, which has no version, gets the list of its chunks the session
  changed.
- **Verification pass** is appended by the `verify` phase only.
- **Hand-offs** is written at the close, one row per request in chain order
  (`apply-and-verify.md` § Hand-off). A row reads `To run` until the user
  says it ran or the owner's own record shows it; then `Done`. Gated chunks
  waiting for their gate are a note in the close-out, not a row.
- **Skill changes requested** lists the parts of decisions that needed a
  structure the owning skill defines (`apply-and-verify.md`, Apply rule 6),
  each with that skill and the point ID. `None` when there are none.
- **Major structural decisions** lists only decisions that changed the
  shape of the plan (phase moves, reclassifications, deployment-model
  corrections), not every applied edit.
