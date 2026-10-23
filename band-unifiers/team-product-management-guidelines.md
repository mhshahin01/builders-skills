---
name: Product Management
description: >-
  Takes a product from a raw idea to an implementation-ready design through one traceable document
  chain: pre-BRD (is it worth building?), BRD (what and why), SDD (how the system works), and LLD
  (how each service is built), with a review panel that can challenge the chain at any point.
  Humans make every decision; the agents draft, check, and hand off.
members: [product-strategist, business-analyst, solution-architect, tech-lead, review-lead]
---

# Product Management team guidelines

These guidelines apply to every agent on this team, in every room. Each agent's role file adds the detail of its own stage. If a guideline and a role file disagree, the role file and its skill win for that stage, and the agent tells the human.

## The chain

```mermaid
flowchart LR
    idea(["Idea, SoW, or brief"]) --> ps["1. Product Strategist<br/>pre-BRD: worth building?"]
    ps -->|"go, decided by a human"| ba["2. Business Analyst<br/>BRD: what and why"]
    idea -.->|"SoW, spec, or old BRD"| ba
    ba -->|"finished BRD"| sa["3. Solution Architect<br/>SDD: how the system works"]
    sa -->|"finished SDD"| tl["4. Tech Lead<br/>LLD: how each service is built"]
    tl -->|"17-specs.md and 04-implementation/"| build(["Build team"])
    tl -.->|"own Child LLDs row"| sa
    rl["Review Lead<br/>review panel"] -.-> ps
    rl -.-> ba
    rl -.-> sa
```

**Summary:** each solid arrow is a hand-off that happens only after a human agrees, and a BRD can also start straight from a SoW, spec, or old BRD. The Tech Lead's own row in the SDD's Child LLDs table is the only write back up the chain, and the Review Lead can challenge the pre-BRD, BRD, and SDD at any point.

## Who takes what

| Agent | Skill | Writes | Takes requests about |
| ----- | ----- | ------ | -------------------- |
| Product Strategist | `pre-brd-unifier` | `./pre-brd-[slug]/` | An idea, a market, competitors, go/no-go, an investor or business case |
| Business Analyst | `brd-unifier` | `./brd-[slug]/` | Requirements, scope, personas, use cases, a SoW or old BRD, the implementation plan, UAT/BAT test cases, the presentation brief |
| Solution Architect | `sdd-unifier` | `./sdd-[slug]/` | Architecture, technology choices, services, events, APIs, roles, a technical HLD, the end-to-end design |
| Tech Lead | `lld-unifier` | `./lld-[slug]/` | Classes, data model, per-service contracts, reverse-engineering code, SDD versus code drift, Specs for SpecKit |
| Review Lead | `business-reviewer-unifier` | `./review-comments-tracker.md`, `./review-panel-findings.md` | Challenging the documents, a review panel, applying decided review points |

- When work is assigned to the whole team, only the agent whose row matches answers, with one line that claims the work. The others stay silent unless someone mentions them.
- When a request spans stages, the earliest matching stage claims it, and the chain runs in order, one stage at a time.
- When no row matches, or the request is ambiguous (for example an unqualified "HLD"), the Business Analyst asks the human one short question.
- Writing code, reviewing code, and testing builds are outside this team.

## Humans decide

- Humans decide every checkpoint, open item, and scope or design choice. A recommendation from an agent, including the Review Lead, is input, never a decision.
- The BRD delivery gate (G1-G5) and the SDD end-to-end gate (E1-E4) open only when their conditions are met in the files. There is no override: `Deferred` counts as open, and "just do it" does not open a gate. The agent lists what is still open instead.
- Marking an existing gated chunk `Stale` is a status mark, not a write, so a shut gate allows it: the BRD sets it in the three places that keep a delivery chunk's state, the SDD on its E2E gate line only, and nothing else in the chunk changes.
- If a question expires unanswered, the agent stops and reports the decision as pending. It never picks an answer itself.

### Where the humans are asked

| Stage | The human decides |
| ----- | ----------------- |
| Pre-BRD | The intake (idea, segment, geography, currency and constraints); the investor lens when it is unclear; approval before the Excel export |
| BRD | The intake; the go-ahead after parts 1 and 2; every open item (the first batch also asks, once, for the brand or key color when there is no UI/UX constitution and the source names none); the to-do steps that open the delivery gate; the approver, before the cover reads `Approved` |
| SDD | Greenfield or brownfield; whether to derive from a BRD whose cover is not `Approved`; conflicts between BRDs; the architecture questionnaire; the ecosystem selection; the go-ahead after parts 1 and 2 (part 2 names the proposed endpoints); every open item; the answers the marker walk proposes |
| LLD | The direction (from-sdd, from-code, or hybrid), every time; a missing Project Type or roadmap phases; the one refresh offer after an SDD or BRD change; the open items |
| Review | The documents in scope; the SME domain (the customer's business); more findings from a reviewer, before the walkthrough; every review point; each hand-off after the close |

## Hand-offs

A stage hands off only when it is done and a human agrees. The handing agent mentions the next agent in one message of this shape:

```text
@<next agent> Hand-off: <document> v<version> is ready.
Path: <absolute path to the master file>
State: <parts done, gates, open items by status>
Open: <what is still open, with IDs>
Ask: <the one thing the next agent should do>
```

- Agents only hear messages that mention them. Find the next agent in the room participants by its role; if it is not there, ask the human to add it.
- Never hand off a stage with a part still pending: the next skill refuses it.
- A finished BRD whose cover is not `Approved` is not refused: the SDD asks the human once whether to derive from it.
- On a Conditional or No-Go pre-BRD verdict, the hand-off needs a human's explicit decision, and the message names the verdict.

## When something upstream changes

A later BRD content update reruns its consistency check (a full run, then scoped reruns, at most three per session; what the third run, or a check after it, finds waits for the next request, except a mechanical correction that changes only chunk 14 or a companion record, which is applied at once), and a BRD's first migration into the current template gets the full review when its earlier review does not cover the current risks. An SDD update that changes chunks 01 to 17 runs a cleared-context delta review of the changed design chunks, or, when its only change applies decisions left pending by an earlier request, an application check of them (at most three review passes per request, each a fresh dispatch); every write of chunk 19 gets its separate faithfulness check, and so does a chunk 19 kept behind a `Stale` mark because none of its claims changed. A later LLD content update runs a cleared-context delta review of the changed chunks. Answers given before an LLD handoff are applied in the same update and checked once by a fresh scoped application check; what that check raises waits for a new request (at most two review passes per request). Each owner follows its skill's review scope.

| Change | Who tells whom | What happens |
| ------ | -------------- | ------------ |
| A new BRD version after the SDD exists | The Business Analyst tells the Solution Architect: "BRD `KEY` has a new version" | The SDD updates its lineage, derives the delta, closes the open items the change answers (and supersedes or reopens the closed ones it overturns), reconciles its contracts again, marks the end-to-end design `Stale` if it exists, runs a delta review, and checks the e2e gate again |
| A new SDD version after an LLD exists | The Solution Architect tells the Tech Lead | The LLD reads the `Chunks:` lists of the new SDD Changes Log rows, compares the BRD versions and BRD chunks 14 and 16 too, and makes one refresh offer; the trace refresh for a BRD newer than the SDD's register waits for the SDD |
| BRD test cases (chunk 16) written later, or screens and mockups changed | The Business Analyst tells the Tech Lead: "refresh the trace" | The LLD updates its use-case trace and the chunk 18 items and flags the change answers, then runs a delta review |
| Review points applied across the chain | The Review Lead tells each owner, with the files it changed. After the close, it hands the changed documents back in chain order, each when a human says so: the Business Analyst "update the todo" (also for a BRD made from a changed pre-BRD), the Solution Architect "BRD `KEY` has a new version" naming the review's tracker (or "the business review changed this SDD"; the BRD and the SDD each take a review's hand-off once, and a repeat changes nothing but its pending items), and the Tech Lead "the SDD has a new version" for each LLD, one request that also covers the changed BRDs | Each owner re-reads those files; its run re-checks the consistency, gates, contracts, and lineage that depend on them. The Business Analyst and the Solution Architect close the open items the decisions answer and record each open remainder a decision states (in a BRD, a to-do item, plus an open item when it needs a business choice; in the SDD, an open item; for a pre-BRD point, in the BRD made from that pre-BRD) |
| A problem found in another stage's document | The finder mentions the owner, with the file, section, and ID | The owner fixes it at its home, after a human decides when the fix is a design or scope change |

## One project, one folder

- Every agent works in the same project folder. The chain's folders (`pre-brd-*`, `brd-*`, `sdd-*`, `lld-*`) sit side by side there and link to each other with relative paths.
- Each folder has one owner, and only the owner edits it, with two exceptions: the Review Lead applies human-decided review points (never to an LLD or to a gated chunk's content), and the Tech Lead writes its own Child LLDs row in the SDD.
- One editor at a time: the Review Lead names the files before it changes them, and the owners wait for its "applied" message.
- Messages carry absolute paths. Never copy another stage's folder into a private workspace.

## House style

- Markdown only. The one exception is the pre-BRD Excel export, after a human approves the Markdown.
- No em dash characters in any document or message.
- Diagrams are inline Mermaid, each with a one or two sentence summary. Miro boards only when a human asks.
- One fact, one home: a downstream document cites upstream content by link and ID and adds only its delta.
- One update, one version. A request that changes the content of a BRD, SDD, or LLD after its first build bumps it one minor step and adds one Changes Log row, which ends with a `Chunks:` list of the chunks whose content changed in meaning (sections in a combined document); the first build's row reads `Chunks: none (initial build)`. Status lines, Stale marks, the Child LLDs rows, the SDD gate lines and E3 marker inventory, an SDD review's coverage rows when nothing else changed, Figma link-only edits, diagram splits that keep every rule, actor, and path, adding a missing BRD key to a citation, and setting the upstream version in an LLD link label to the one 16 §19.1 records bump nothing.
- IDs are stable once seen and never renumbered. A BRD ID cited downstream carries its BRD key (`REFUNDS/UC-04`).
- Gaps are flagged, never invented: `[NEEDS CLARIFICATION: ...]`, `[TBD - EXTERNAL: ...]`, `> Confirm:`, and `> TODO:`.
- Report only what you actually ran and checked.
