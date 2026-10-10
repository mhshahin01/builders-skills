# Tracker Schema

File: `./review-comments-tracker.md` in the project root. Persistent across
sessions; updated after every applied point, never batched to session end.
One tracker is one review session (`apply-and-verify.md`). It is also the
record of what the session versioned and what it handed to the owning
skills.

Its companion, `./review-panel-findings.md`, keeps every raw finding in
the finding schema (`panel-orchestration.md`), so the reviewers' Why and
Direction survive the session. Each finding sits under the point it ended
in, one heading per point (`## <ID>: <short concern>`). The file is
written at the merge, takes the findings of any re-dispatch the user
asks for before the walkthrough (`panel-orchestration.md` § Merge rules,
rule 6), and is never edited after the walkthrough starts.

## Template

```markdown
# Review Comments Tracker

**Created:** YYYY-MM-DD
**Source:** Multi-agent review of <doc list with versions at review time>
**Reviewers:** Business Owner (BO), <Domain> SME (SME), Product Manager (PM),
Principal Architect (PA), Document Consistency (DC)[, add-ons]
**SME domain:** <confirmed domain, e.g., residential compound and community operations>[, confirmed by Stand-in: SME (<policy>, set by <name>, <date>)]
**Status values:** Pending | Decided | Applied | Partially applied | Rejected | Deferred
**Panel findings:** [review-panel-findings.md](review-panel-findings.md)
**Panel notes:** <a reviewer whose re-dispatch still returned nothing: the persona, the areas it named clean, and the evidence; omit the line when there is none>
**Answer policy:** <the policy as the user stated it, who set it and the date, and the stand-ins it names; this line is the policy's only home (SKILL.md § Answer policy, rule 7); omit the line when there is none>
**Paused:** <the point the walkthrough stopped at because the answer policy cannot decide it (SKILL.md § Answer policy, rule 4), the rule or policy wording that kept the policy from deciding it, and the date; remove the line when the walkthrough resumes; omit it when the walkthrough is not paused>

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

## Column rules

- **ID**: `<ROLE>-NN`. Merged findings noted inside the Concern cell of the
  surviving row ("merged with PA-05") and the absorbed row is not listed
  separately.
- **Concern (short)**: one line, readable without the source documents.
- **Target doc(s)**: doc ids + sections, comma-separated; update if apply
  or a verify fix reveals more affected docs than the reviewer cited.
- **Status**: exactly one of the six values. Decided means the user, or
  the answer policy (SKILL.md § Answer policy), chose but edits are not yet
  made; Applied means every affected doc the review may edit reflects it,
  and the rest is named in a hand-off (`apply-and-verify.md`, Apply rule 6).
- **Decision**: filled at decision time; states what was ACTUALLY decided
  (which may exceed or fall short of the recommendation). For Partially
  applied, name the declined parts, or the part recorded under Skill
  changes requested. For Rejected/Deferred, one-line reason. A decision
  the answer policy took ends with its decider label, for example
  `Option B: <edits made>. Decided by Policy: <policy> (set by <name>, <date>).`

## Footer rules

- **Progress** line is recomputed at every update. A stop at a point the
  answer policy cannot decide goes in the header's **Paused** line, not
  here.
- **Versioning** gets a line when a point first changes a document
  (`apply-and-verify.md`, Apply rule 7) and is completed at the close. A
  pre-BRD, which has no version, gets the list of its chunks the session
  changed.
- **Verification pass** is appended by the `verify` phase only. A fix the
  answer policy chose ends with the decider label, as in the Decision cell.
- **Hand-offs** is written at the close, one row per request in chain order
  (`apply-and-verify.md` § Hand-off). A row reads `To run` until the user
  says it ran or the owner's own record shows it; then `Done`. Owners never
  write the tracker, so a row whose `Done` evidence exists
  (`apply-and-verify.md` § Hand-off) is `Done` whatever its cell reads. The
  session has closed when this block is written and no point is `Pending` or
  `Decided` (`apply-and-verify.md` § Hand-off). A row the
  answer policy started ends with
  `Started by Policy: <policy> (set by <name>, <date>)`. Gated chunks
  waiting for their gate are a note in the close-out, not a row.
- **Skill changes requested** lists the parts of decisions that needed a
  structure the owning skill defines (`apply-and-verify.md`, Apply rule 6),
  each with that skill and the point ID. `None` when there are none.
- **Major structural decisions** lists only decisions that changed the
  shape of the plan (phase moves, reclassifications, deployment-model
  corrections, or a use case, service, event, or objective added, removed,
  or narrowed), not every applied edit, and not a template structure (that
  goes under Skill changes requested).
