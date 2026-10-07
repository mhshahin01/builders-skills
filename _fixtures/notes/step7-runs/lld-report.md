# Step 7 proof run: LLD refresh from SDD 1.8 (2026-10-07)

Run by a background Claude Code agent on the scratchpad chain after the SDD run (`chain-after-sdd/`), request "The SDD has a new version: refresh the LLD ... Answer policy for this request: I accept the recommended answer of every open item this request raises, before the handoff." The agent returned its report as text; the orchestrating session saved this condensed version (facts from the agent's report, spot-checked as noted).

## What ran

- lld-unifier read from disk (SKILL.md, then every referenced file). Both review passes ran as cleared-context sub-agents (a fresh agent for the application check). Shape chunks (implied); direction asked and answered from-sdd; no further intake.
- Step 3c: 16 §19.1 recorded SDD 1.7; SDD now 1.8 with one newer row, `Chunks: 13a, 18` (13a: the Developer Notes Testing bullet; 18: Reviewer Notes only, no open, deferred or pending item). BRDs REFUNDS 1.9 and LOYALTY 1.8 equal the register; chunk 16 Up to date in both; every chunk 14 Mockup coverage row equals 14 §17.3; no trace refresh fired. One offer, accepted.
- Mapping: SDD 13a to customer-accounts.md, 03 §6.2, 05, 06, 07, 08 §11.1, 09, 10 §13.1 and §13.3, 11 §14.6, 13 §16, 15 §18.4; SDD 18 to no LLD chunk (input context only). Changed: 13 §16.2, §16.3, §16.6 and 16 §19.1; the other destinations checked and kept. Step 6a rerun (9 §7.3 rows, 0 problems; again after the answers); step 6b not due; step 6c updated the Child LLDs row.

## Version and files

- LLD 1.4, Changes Log row dated 2026-10-07, `Chunks: 04-implementation/customer-accounts.md, 09, 10, 13, 15, 16, 18, decision-log.md`.
- Ten LLD files changed (00, the master, customer-accounts.md, 09, 10, 13, 15, 16, 18, decision-log.md) plus the SDD's Child LLDs row, now `| Refunds Platform | customer-accounts, refund-requests, payouts, notifications, loyalty-points | from-sdd | 1.4 | 1.8 | ... |` (verified: the only SDD change).

## Review passes (two)

1. Delta review (step 7, On an update): six coverage rows, labelled `2026-10-07 delta: chunk 13`, `2026-10-07 delta: chunk 16`, `2026-10-07 delta: decision-log.md`, and three `2026-10-07 delta: global` rows (no brackets around the date). It raised OI-14 to OI-19.
2. Scoped application check (step 7, Answers in the same update), a fresh cleared-context agent: six rows labelled `[2026-10-07] application check: OI-14` to `OI-19` (with brackets). It found the six answers read as plain implementation text with no option letter, date or progress note, and raised OI-20 to OI-27, which stay Open for a later request (SKILL.md: at most two review passes; gaps the check finds wait).
- Process note: both reviewers compared the chunks with the pre-run copy `lld-before/` on their own initiative, and the delta reviewer reran the run's scratch step 6a script; neither was in their brief.

## Answers applied (OI-14 to OI-19, option A each, under the answer policy)

- OI-14: three instants around `expires_at`, `sent_at` read once from the business clock, keyed test tags (13 §16.2, §16.8; customer-accounts §7.3).
- OI-15: the destination guard as a transaction-scoped advisory lock on (`tenant_id`, `destination_hash`), two named Testcontainers cases (customer-accounts §7.3; 13 §16.3).
- OI-16: a forward-only test business clock for the integration suites; CONFIRM-25 routes the two-clock reading of `last_sign_in_at` to sdd-unifier (13 §16.3; 15).
- OI-17: seven named Keycloak lifecycle cases on a `GenericContainer` loading the realm export (13 §16.1, §16.3).
- OI-18: the `BUSINESS_CLOCK_OFFSET` row bound once at startup, with a Prod start refusal (10 §13.1; 13 §16.6).
- OI-19: `IdentityProviderPort` with `KeycloakIdentityProviderAdapter` (customer-accounts §7.2, §7.4; 09 §12.3; 13 §16.2, §16.3) and a corrected retained claim in the decision log.
- OI-20 to OI-27 (from the application check, Open, not answered): guarded checks in `startSignUp`, lock order, user listing and tenant attributes on the port, clock reset per case, the closure retry case, UAT timing rules, the `confirm` pseudocode, `destination_hash` normalization.

## State after the run

- Chunk 18: 27 items: 18 Resolved, 1 Rejected, 8 Open (verified).
- Flags: before 38 TODO, 24 Confirm; after 38 TODO, 25 Confirm (CONFIRM-25 at 13-testing.md:28).
- 16 §19.1 records SDD 1.8 (Draft; E2E gate Open - Up to date) and the BRDs unchanged.

## Checkers (all 0 problems)

check_links 1317 links, 0 broken; _linkcheck 1317 links, 487 SDD references, 0 bad; check_lld_trace 0 broken, unkeyed, unknown, range and lineage problems (child row 1.4 / 1.8); check_trace 0 problems, 0 notes; check_versions LLD 0 (newest v1.4); check_mermaid 39 blocks, 0 issues; list_flags 38 TODO, 25 Confirm; check_versions SDD 0; check_uc_keys 0. Re-verified by the orchestrating session: check_versions, check_lld_trace and check_trace 0; chunk 18 counts; BRDs and `source/` untouched; the repository's skill state unchanged.

## Offers declined

The SKILL.md:308 offer to answer and apply OI-20 to OI-27 in a new request; the SKILL.md:304 suggestion to pin the missing versions in SDD §6 through sdd-unifier.

## Unclear or contradictory skill text reported by the run (next-round input)

1. Refresh granularity: the scope is per mapped chunk, but neither text says whether a refresh re-derives each mapped LLD chunk against the current SDD or applies only the delta and keeps the rest (SKILL.md:158, :321; chunking.md:186; sdd-to-lld.md:198). Re-deriving would have caught the pre-existing gap behind OI-19.
2. Answer policy against the check's items: SKILL.md:255 has gaps the application check finds wait for a later request (at most two passes), while the user's policy covered every item the request raises before the handoff.
3. "The same cleared-context reviewer" (SKILL.md:255): the same agent instance continued, or a fresh agent with the same brief?
4. Row label format: SKILL.md:253, :255 and chunks/18:83 do not say whether the brackets of `[YYYY-MM-DD]` are literal (the two agents differed), and give no form for a file outside the template such as `decision-log.md`.
5. Which chunks to list: SKILL.md:358 can be read as listing chunk 15 on every accepted refresh; the run listed 15 only because CONFIRM-25 was added.
6. The §7.3 row's version in chunks/16-references.md:19: the version the trace was last checked at, or the version §7.3 last changed in?
7. Direction question on an update: SKILL.md:82 and :103 always ask; transform-detection.md:161 names no direction question for an existing LLD whose mode is recorded.
8. decision-log.md in `Chunks:`: the LLD keeps one, but the chunk map (chunking.md:20-43) and the Versions rule never mention it.
9. Correcting a history record: OI-19's option corrected a decision-log claim; SKILL.md:255's "plain implementation text that reads correctly in place" fits body chunks, not a log.
