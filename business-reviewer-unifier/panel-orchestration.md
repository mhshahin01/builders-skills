# Panel Orchestration

## Dispatch

- One subagent per persona, dispatched in parallel in a single message
  (`Agent` tool, `subagent_type: general-purpose`). Cleared context is the
  point: reviewers must not inherit authoring or conversation memory.
- Each subagent receives:
  1. Absolute paths to every in-scope document (the full chain, not just
     "its" documents; cross-doc findings need the whole picture).
  2. When the chain has child LLDs, the lineage context from Intake (each
     LLD's version record), marked as context, not for review.
  3. Its charter, copied verbatim from `reviewer-personas.md`, with the
     SME domain substituted into the SME charter.
  4. The finding schema below and the instruction to return findings as
     raw structured text (their final message is data, not prose for the
     user).

## Finding schema (per finding)

```
Reviewer: <BO|SME|PM|PA|DC|...>
Concern: <one short line, tracker-cell ready>
Where: <doc id + section, e.g., "01 §7" or "02 DOM-04">
Why: <one paragraph: the risk or gap and its consequence>
Direction: <one or two suggested resolution directions, one line each>
```

No finding without a `Where`. Reviewers must not propose full solutions;
direction lines are seeds for the walkthrough options, not decisions.

## Reviewer prompt skeleton (adapt per persona)

> You are an independent adversarial reviewer with the charter below. You
> have no memory of how these documents were authored. Your job is to find
> what is missing, ambiguous, risky, or contradictory, not to confirm what
> is present.
>
> Read these files fully: [paths].
>
> (When the chain has child LLDs:) Lineage context, not for review:
> [paths]. A finding about lineage compares both ends: the parent's row and
> the child's own version record. A check recorded in a decision log may
> predate the latest update at either end, so it does not settle the
> question.
>
> [charter text]
>
> Return 5 to 12 findings using exactly this schema per finding: [schema].
> Do not echo or summarize the documents. Do not praise. Every finding
> must cite an exact document and section. Your final message is raw data
> for an orchestrator, not a message to a human.

## Zero-findings rule

A reviewer returning zero findings (or only confirmatory remarks) is
re-dispatched ONCE with stronger framing: "Assume the documents contain at
least five material gaps in your area. Find them. If after genuine effort
an area is clean, name the area and state what evidence makes it clean."
If the second pass still returns nothing, record that explicitly in the
tracker notes; never invent findings to fill the gap.

## Merge rules (orchestrator work, not an agent)

1. Read all findings across personas before assigning IDs.
2. Two findings merge when they would be resolved by the same decision.
   Keep the more senior framing as the primary; note "merged with X-NN"
   in both concerns (the absorbed ID still appears in the tracker row of
   the primary).
3. Assign IDs `<ROLE>-NN` in each reviewer's own sequence (BO-01, BO-02,
   SME-01, ...). Merged-away findings keep their ID only as a reference
   inside the surviving row.
4. Order the tracker by reviewer, then sequence. Walkthrough order may
   differ (user's choice); the tracker order is stable.
5. Report after merge: total raw findings, merges performed, final point
   count, per-reviewer counts.
