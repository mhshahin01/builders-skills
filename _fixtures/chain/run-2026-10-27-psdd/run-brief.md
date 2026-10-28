# Run brief: Pre-SDD fixture run on the FC baseline BRDs

Task 7.2 of the pre-SDD unifier build. Prepared 2026-10-27 (UTC). You are the runner: run the `pre-sdd-unifier` skill once, unattended, from the start to the G3 sign-off and the hand-off, on the two FC baseline BRDs in this folder.

## Paths

| Name | Path |
|---|---|
| WT (the build worktree, read only for this run) | `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier` |
| The skill | `WT\pre-sdd-unifier` (its `SKILL.md`, rule files, `chunks\`, `TEMPLATE-COMBINED.md`, `reference\`) |
| The engine CLI | `node "C:/Users/negat/.claude/skills-wt/pre-sdd-unifier/pre-sdd-unifier/studio/cli.mjs"` |
| TOOLS (temp files only) | `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\5cecb36b-03d8-4e5a-8cf5-681dd1950497\scratchpad\tools` |
| The run folder, which is the project root | `TOOLS\runs\run-2026-10-27-psdd` |

The run folder holds, copied unchanged from `WT\_fixtures\chain\run-2026-10-13-fc`: `brd-refunds-portal\`, `brd-loyalty-points\`, `standins\` and `AGENTS.md`; and, written for this run: this brief and [fixture-answers.md](./fixture-answers.md). The two BRD masters link to `../source/` and `../BASELINE-PROVENANCE.md`, which were not copied: those links do not resolve here, and nothing in this run needs them.

## What to run

Run the skill as if invoked with `pre-sdd-unifier full prompt chunks` and the request: "Run the full Pre-SDD for the Refunds Platform from its two BRDs, REFUNDS and LOYALTY, under the test-run policy in run-brief.md."

- **Mode** `full`, **input path** `prompt`, **output** `chunks`, not light. The arguments answer the input path and output mode prompts, so neither is asked.
- **Read the skill from WT by path:** `WT\pre-sdd-unifier\SKILL.md` first, then each rule file when SKILL.md says to read it. Never invoke an installed skill (the Skill tool, `~/.claude/skills`, `~/.agents/skills`): those are the main checkout, without this build's changes. `<skill>` in every command is `C:/Users/negat/.claude/skills-wt/pre-sdd-unifier/pre-sdd-unifier`.
- **The project instruction file** is this folder's `AGENTS.md`. Honour its two rules for project content (no new third-party dependency without the product owner's approval; do not ask for the brand or key color).
- **Commands run from the run folder** (the folder that holds `./brd-*`). Your shell may reset its working folder between calls, so pass absolute paths, quoted, with forward slashes. Never pass `--now`: the engine stamps the real UTC time.
- The Pre-SDD folder is `./pre-sdd-refunds-platform/` (slug `refunds-platform`), created by `cli.mjs new` with one `--brd` per BRD, for example `--brd "REFUNDS=../brd-refunds-portal/refunds-portal-brd-master.md@1.5:In Review" --brd "LOYALTY=../brd-loyalty-points/loyalty-points-brd-master.md@1.7:In Review" --mode full --input prompt --slug refunds-platform --name "Refunds Platform"`.

## The test-run policy

The test-run policy for this run, as the build plan words it (Task 7.2 Step 1):

> accept the recommended option; continue at G1 and G2; facts come only from `fixture-answers.md`, labelled `Fixture: <owner> (test-run policy)` with the owner named as in the FC stand-in records; the Approver stand-in signs each applicable G3 role only when the conditions hold; exceptions are granted only by the named fixture owner

The fixture owner, named as in the FC stand-in records ([standins/refunds/grill-me-session.md](./standins/refunds/grill-me-session.md)), is **`Product Owner stand-in`**, so its label is `Fixture: Product Owner stand-in (test-run policy)`.

How the run applies it, through the engine's actors (`engine-and-studio.md` § The patch file):

| Who | Actor in the patch | Does |
|---|---|---|
| The skill (you, as the E2E Architect) | `{ "type": "agent", "name": "pre-sdd-unifier" }` | The pre-fill with BRD citations, the added entries, the proposals, the option names and proposed scores, the progress pointer, the version. Never confirms, accepts, signs, ticks, grants or decides. |
| The answer policy | `{ "type": "policy" }`, after `set-policy` (fixture-answers.md § 1) | Takes the recommended option or stated default, and nothing else: "keep" for a pre-filled choice, the group confirm, each proposal on a proposal row that the fixture file does not answer, each open item's Accept recommendation (and a `No change: <evidence>` recommendation). Passes the G1 and G2 review stops. Never a fact, an owner name or due date, a score, a cost, a weight, a decision, an `N/A`, a tick, an exception. |
| The fixture owner | `{ "type": "fixture", "name": "Product Owner stand-in" }` | Every answer in fixture-answers.md: the intake facts, the values for entries still `Open`, the owner names and due dates, `N/A` with reasons, keeping BRD-stated facts, costs, horizon, weights, score confirms, the stage 4 decisions, the G3 checklist ticks, the condition. Never signs a decision and never grants an exception (the engine refuses both). |
| The Approver stand-in | `{ "type": "policy" }` on a `sign` op | Signs each applicable role at the G3 stop, only when the engine's G3 result names no problem other than the roles still to sign. |
| The fixture owner as a named person (ruling R23, and the policy record) | `{ "type": "person", "name": "Product Owner (fixture owner)" }` | Only two ops: the one time-bound exception (fixture-answers.md § 9) and `set-policy` (fixture-answers.md § 1). If the engine refused `set-policy` from this person actor, use the fixture actor for it instead. Never use the real owner's name on any op: a fixture run must not put his name on a decision he did not make. |

**Which answer applies.** Where fixture-answers.md gives an answer for a question, that answer is used, even when the skill has a recommendation. Where it does not, the policy takes the recommended option or the stated default if the question has one. Anything else waits: the item stays as it is, with its owner name and due date (fixture-answers.md § 8), and the final report lists it. Never supply a fact, an owner, a date, a cost, a weight or a decision that fixture-answers.md does not give.

**No one is at the keyboard.** Do not call AskUserQuestion. Ask each question exactly as the skill would (its batch, entry ID, options, the pre-filled value or proposal, the recommendation and its Why), write it into `run-transcript.md` in the run folder, and write the answer the policy or the fixture file gives under it, with who answered. Then apply the answer through `derive --apply` with that answer's actor, as the skill's prompt path says (`stages-and-input.md` § Writing the answers). Record the decisions in the Pre-SDD's `decision-log.md` as the skill says: the policy once, the first time it answers, in § Walkthrough and delegation history.

## Ruling R23: the one time-bound exception

The engine and the skill let only a named person grant an exception (design § 6.7, the `add-exception` op refuses a fixture actor). Ruling R23 (decided 2026-10-27): the fixture owner acts as the named person for the one time-bound exception. Grant it as fixture-answers.md § 9 says: a person actor named `Product Owner (fixture owner)`, never a name that contains "stand-in" (the skill forbids a stand-in granter), at stage 4 step 3 (Validate), before the write-up. Record the choice in `decision-log.md` (§ Walkthrough and delegation history, and the exception in § Sign-off record) and in your final report, naming R23. Grant no other exception and revoke none.

**The exception's expiry.** EXC-01 expires 2027-12-31. A recompute of this fixture after that date reads G3 `Blocked`, because the expired exception no longer lifts `OPEN-SEC-01.1`. The fixture's results hold as of the run date: record that as-of date (UTC) in your final report.

## The pre-G3 copy (for Task 7.4)

At the G3 sign-off stop, after the write-up (step 11), the review and its accept loop (step 12), and before the first G3 checklist tick, copy the whole Pre-SDD folder, `studio\` included, to `./_snapshots/pre-sdd-refunds-platform.pre-g3/`, unchanged (ledger ruling of 2026-10-23; inside `_snapshots`, the real Pre-SDD stays the only `./pre-sdd-*` folder in the project root). Never write into the copy afterwards, and do not treat it as a second Pre-SDD: the run's Pre-SDD is `./pre-sdd-refunds-platform/` only.

## The status board

No `unifier-status.md` exists in this folder, and no chain skill has run here, so this run is the first chain skill that runs: create the board from the template in SKILL.md § Status board, with `Run mode: solo`, and write only the E2E Architect row and the requests this skill raises (to `brd-unifier` for questions only a BRD owner can answer, and the hand-off to the Software Architect, raised with State `Later` per fixture-answers.md § 13). The other rows stay `Not started`: a skill writes only its own row.

**Today's Status board changes.** The shared Status board section of the chain skills changed today (Task 7.0a, uncommitted in WT): for example, the pending request states include `Accepted`, the Folder and Waiting on cells have rules, and the raiser and the receiver own different State values. Read the section from `WT\pre-sdd-unifier\SKILL.md` as it is on disk, with these changes, and follow it.

## The review (step 12)

The skill asks for a cleared-context reviewer through the `Agent` tool (`subagent_type: general-purpose`), with the brief in `review-and-open-items.md` (design § 6.8). The coordinator approved this one dispatch for the runner (2026-10-27): dispatch that cleared-context reviewer as the skill says, and the delta reviews of the same reviewer that the review limit allows; dispatch no other subagent. If your runtime has no Agent tool, run the review as a separate pass (SKILL.md § Running outside Claude Code: re-read the files from disk, set aside your drafting reasoning, follow the same brief). Say in the final report which way the review ran. At most three review passes.

## Rules for the run

1. **Write only inside the run folder.** Never write into WT (the skill, the fixtures, the plan folder). Temp files go under TOOLS, never under the current folder or `/tmp`.
2. **No git command that writes.** No browser, no Studio page, no web path, no Playwright or browser tools: the prompt path only.
3. **Fix the skill, not the run.** Change the project state only through the engine (`derive --apply`, `compute`); never edit `project-state.json` or a fragment by hand, and never work around an engine refusal by changing the actor. When a skill rule or the engine stops the run or gives a wrong result, keep going where the rules allow, and report the rule with evidence (the file and line, the command, its output). The controller decides any skill fix and the rerun.
4. **Every number comes from the engine.** Never work one out by hand.
5. **Plain words, UTC.** No em dash and no en dash in anything you write. Every timestamp in UTC.
6. **When G3 cannot be reached** (a blocker, an unconfirmed critical entry, a checklist line without evidence), stop at the G3 sign-off stop as the skill says, keep the board row and the master current, and report each problem the engine names. Do not sign around it.

## Your final report

Reply with, in plain words:

- the Pre-SDD path, its version, the engine's gate label and G3 status, the chosen option, and the DR strategy per failure scope (from `model.json`);
- the counts by status from the engine, the unknowns (`QD-NN`) with owner and due, the condition and the exception with who granted it (naming R23);
- every fixture answer used and every fallback in fixture-answers.md that was needed (fallback proposals, fallback scores, removed entries, added or removed options);
- the policy choices without a source, as the handoff summary lists them;
- the open items by status, and the requests raised on the board;
- how the review ran (an Agent dispatch or a separate pass);
- every skill or engine problem found, with evidence;
- the as-of date (UTC) of the results, and the note that a recompute after 2027-12-31 reads G3 `Blocked`;
- the files written, including `run-transcript.md` and the pre-G3 copy in `_snapshots/`.
