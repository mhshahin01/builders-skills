# Walkthrough Protocol

The contract for presenting review points to the user. This protocol exists
because bare point numbers and terse option prompts have been explicitly
rejected; do not regress to either.

## The contract

1. **One point in flight at a time.** Do not present point N+1 until point
   N has a recorded decision.
2. **Title every point** as: `Point N (ID): <full concern description>`.
   Never "Point 5" alone; the user will not recall what point 5 is across
   a long session.
3. **Restate the tracker at each step** as a compact table: ID, short
   concern, status. The current point is marked; resolved points show
   their status.
4. **Present each point in full prose, in chat**, structured as:
   1. **Issue**: what is wrong or missing, and exactly which document and
      section it lives in (quote or paraphrase the offending text).
   2. **Why it matters**: the consequence if left as is.
   3. **Options**: a table of 2 to 4 options with one-line trade-offs each.
      An option that changes a structure the owning skill defines (a
      column, status value, gate condition, or ID scheme; `apply-and-verify.md`,
      Apply rule 6) says so, and names the part that would become a skill
      change.
   4. **Recommendation**: one explicit recommended option with the reason.
      Prefer an option that works within the owning skill's structure.
   Then ask for acceptance.
5. **Never** compress this into bare AskUserQuestion option labels. If
   AskUserQuestion is used at all, it comes AFTER the full prose
   presentation, as a convenience for selecting among already-explained
   options.
6. **Security-related points** get a first-principles explanation (what
   the mechanism is, what it protects against, what breaks without it)
   before the options.
7. **Record what was decided, not what was recommended.** The user
   sometimes goes beyond the recommendation; the Decision cell reflects
   the actual choice. Partial acceptance names the declined parts.
8. After the decision: apply chain-wide per `apply-and-verify.md`, update
   the tracker row, then move to the next point.

## Worked example

> ## Point 3 (BO-03): Three-market simultaneous launch risk undiscussed
>
> **Tracker:** BO-01 Applied | BO-02 Applied | **BO-03 current** |
> BO-04 Pending | ...
>
> **Issue.** 01 §1 and §7 state launch in USA, GCC, and Egypt at the same
> time. Nothing in §7 discusses the operational cost of three simultaneous
> regulatory regimes, payment stacks, and support time zones.
>
> **Why it matters.** Simultaneous launch triples localization and legal
> review on the critical path; a slip in any one market delays revenue in
> all three because engineering is shared.
>
> | Option | Trade-off |
> |---|---|
> | A. Sequence markets (one lead market, others follow) | Slower total coverage; far lower critical-path risk |
> | B. Keep simultaneous, add per-market launch gates | Keeps the promise; gates likely slip silently |
> | C. Defer the decision to GTM planning | Unblocks the doc; risk lands undocumented |
>
> **Recommendation.** Option A; pick the lead market by deal pipeline and
> state the wave order in §1 and §7.
>
> Accept, or adjust?
