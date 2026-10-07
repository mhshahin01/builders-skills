# Step 7 proof run: SDD update and e2e refresh (2026-10-07)

Run by a background Claude Code agent on a copy of `chain/run-2026-10-07-review` in the session scratchpad; the harness blocked the agent from writing this file, so the orchestrating session saved its returned report here (condensed; every fact below is from the agent's report, spot-checked as noted).

## Setup

- Start: SDD v1.7, CHUNKS, generation whole, derive-from-BRD; gate `Open - Up to date`; chunk 19 at v1.7; 47 open items all closed (42 Accepted - applied, 1 Adjusted - applied, 4 Rejected); 67 live markers, none blocking; Child LLD row LLD 1.3 / SDD 1.7; parents REFUNDS v1.9, LOYALTY v1.8.
- The review pass and the faithfulness check ran as cleared-context sub-agents. Snapshots: `sdd-before/`, `sdd-after-r1/`.

## Request 1: "in 13a (customer-accounts), Developer Notes, the Testing bullet, add that the code-rule tests run with a fixed clock so the 15-minute expiry is deterministic"

- Targeted update (SKILL.md step 10, "update section X"). The bullet now reads: "JUnit 5 and Mockito for the code rules (15 minutes, latest only, 5 wrong entries), with a fixed business clock (§19) so the 15-minute expiry is deterministic; ..."
- Version 1.8; Changes Log row dated 2026-10-07, `Chunks: 13a, 18`. Child LLDs row: `1.7 (out of date: SDD is now v1.8; refresh through lld-unifier)`.
- Step 6a: one scripted run after the edit, no finding (Reconciled line records order and hash be4d581fda9b95de).
- Review: a delta review of 13a (pass 1 of 3), no issue, no open item. Coverage row label: `[2026-10-07] delta: chunk 13a`. Process note: the run agent asked the reviewer to record three older out-of-scope observations in Reviewer Notes ("as the v1.6 delta did"); the reviewer added that bullet on request.
- Step 8b: E1-E4 met. Chunk 19 was behind a Stale mark but no claim it asserts changed, so its body and version (1.7) were kept and not rewritten (verified: byte-identical to `sdd-before`). Faithfulness check (cleared context): 0 wrong, 0 misleading, 0 cosmetic.
- The check reported five source problems, none in the changed text and none a chunk 19 claim depends on: (a) `CustomerAccountClosed` names both a 13a publication and an API-12 error; (b) the Keycloak deletion retry versus the ADR-02 / §11.1 send-job rule (two readings); (c) Figure 8's failure label is narrower than §17.3; (d) the Boundaries event bullets are used two ways across 13a-13e; (e) §16.1 "call each other's ports" versus §15.2. All five were recorded in chunk 18 Reviewer Notes for the Architecture team, not raised; the gate stayed open.
- Gate line: `**E2E gate (chunk 19):** Open - Up to date` (nothing after it). The E2E basis line records chunk 19 v1.7, the v1.7 and v1.8 Reconciled entries, E1-E4, the kept body, and the faithfulness check with its date and counts by label.
- Decision log: Action entries for the request, the Testing bullet (inline rule home), step 6a, the delta review, the open items loop and marker walk, and the e2e gate.

## Request 2: "Refresh the e2e"

- No content change: chunks 01-17 still match the v1.8 Reconciled hash, so step 6a was not rerun; E1-E4 met; chunk 19 already current (gate already open): body and version kept, the verification recorded on the E2E basis line, one decision-log Action entry. No version bump, no Changes Log row, no review pass, no faithfulness check (no write).

## Checkers (final state)

check_sdd 0 (89 markers, 33 Mermaid blocks); check_e2e 0 problems, 1 informational note; check_uc_links 668 BRD links, 0 broken; check_uc_keys 0; _linkcheck 1134 links, 0 bad; check_versions 0 (newest row v1.8); check_mermaid 33 blocks, 0 issues. Re-verified by the orchestrating session: check_e2e 0, check_versions 0, chunk 19 byte-identical, BRDs, LLD and `source/` untouched, repository skill and fixture state unchanged.

## Offers declined

"Refresh it through lld-unifier" (both handoffs and the chunk 00 Child LLDs cell): the LLD is refreshed in a later, separate run.

## Unclear or contradictory skill text reported by the run (next-round input)

1. SKILL.md:322 (E4): "one run is the current request through handoff" does not say whether each request needs its own step 6a run; SKILL.md:367 reruns only on change or unproven order.
2. SKILL.md:328 against :330: the "not raised" exception attaches to the open-item route, while :330 allows mechanical source fixes with no limit to changed or claim-relevant text; unclear whether a plain inconsistency in unchanged text with no dependent claim must be fixed.
3. SKILL.md:409 against :407: unclear whether a delta review that adds only a coverage row puts chunk 18 in `Chunks:` (the run listed it).
4. SKILL.md:255: the delta scope is the row's `Chunks:` list, which grows during the update.
5. SKILL.md:275 against :255 and chunks/18:85: step 7 verifies "one line per area", while the delta review adds one row per changed chunk.
6. SKILL.md:110 against :407: the Child LLDs check runs at step 1, before the bump makes the row out of date; its timing is unstated.
7. SKILL.md:358: the "Cross-mode conversion" heading holds the targeted-update, e2e-refresh and common-tail rules.
8. SKILL.md:158 and :420 against parts-mode.md:17 and transform-detection.md:141: step 3c is "mandatory" and "always runs", but elsewhere runs once before part 1.
9. SKILL.md:335 against :356: unclear whether the one-line offer belongs in a short handoff.
10. SKILL.md:366 against decision-log.md:13: no register section for a direct edit instruction, while every settled design point needs a `Rule home:`.
11. SKILL.md:326: the "no claim changed" test has no stated method (the run used the source diff, confirmed by the faithfulness check).

## Process notes

- The harness auto-saved two large Bash outputs under the Claude projects folder (tool results); the agent did not read them.
- Helper scripts are in `tools/`; hash lists in `sdd-after-r1.sha256` and `final.sha256`.
- No state-changing git command ran; nothing in the skills repository changed.
