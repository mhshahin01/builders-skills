# Stage R findings (skill issues seen in the chain rerun)

For triage with `B-findings.md`. Class: A wrong or contradictory, B ambiguous, C cosmetic, D for the user, N not a skill issue.

## R1: SDD derive (done 2026-10-06 about 10:25, about 7.5 hours; the reviewer alone about 2.8 hours)

Result: SDD 1.0, modular monolith (the questionnaire's recommended Q4), five modules (13a customer-accounts, 13b refund-requests, 13c payouts, 13d notifications, 13e loyalty-points); 0 topics, 10 in-process events, 14 APIs (3 in-process, 11 `TBD - external`), 6 roles, 16 tokens, 8 ADRs; 26 open items (25 accepted, OI-22 go-live import rejected as new business behavior); marker walk: 47 settled, 3 in part, 1 kept; E1, E2, E4 met, E3 not met (4 markers: the lawful basis in 13a, 13b, 13e, and OI-18's card-paid counting rule in 13b); chunk 19 not written; faithfulness check not run. Write scope checked (BRDs and `source/` unchanged, no skill file changed, tools folder deleted). Snapshot `SP3/s6R/after-R1/`. Note: the earlier baselines had a hybrid core with four services, so `diff_runs` against them will show a different decomposition.

| ID | Class | Where | Finding |
|---|---|---|---|
| R1-1 | D | `chunks/13a-service-detailed-template.md` Compliance line against SKILL.md step 8 item 6 ("keep markers needing a legal basis") and E3 | Every module that handles personal data carries a GDPR lawful-basis marker the design cannot settle, so the e2e gate cannot open until a person (the DPO) answers it. Correct (never invent a legal basis), but the walk and the gate line could route it to its owner explicitly. |
| R1-2 | C | SKILL.md § Output conventions, Versions | The first build's row "lists none": write `Chunks:` empty or omit it? (Omitted.) |
| R1-3 | B | `chunks/11-api-contracts.md` §15.1 against the reviewer brief | §15.1 classes the identity provider's admin client and token endpoint as infrastructure with no API-NN; the reviewer brief asks for an API-NN for every synchronous integration. |
| R1-4 | N | run hygiene | After a context compaction the agent read other agents' transcripts under `C:/Users/negat/.claude/projects/.../subagents` (not used). Later briefs: forbid reading session transcripts. |
| R1-5 | N | the brief | "A new item that would add business behavior" was read as reviewer items only; applied to OI-22. |

## R1b: SDD markers and gate (done 2026-10-06 about 14:00, about 3.5 hours)

Result: the four answers applied (v1.0 to 1.1; `Chunks: 01, 05, 07, 13a, 13b, 13d, 13e, 16, 18`); the delta review raised OI-27 to OI-34 (OI-27 rejected: it changed the given counting rule; OI-28 to OI-34 accepted); OI-33 added a new lawful-basis marker in 13e §17.5 (former-member history and refunds waiting for their purchase; owner the DPO), so E3 is still not met and chunk 19 was not written. Write scope checked (12 SDD files changed as reported; BRDs and `source/` unchanged). Snapshot `SP3/s6R/after-R1b/`. Agent's judgment calls: OI-27 rejected; OI-30, OI-32, OI-34 accepted as design, not new business behavior; "only Approved and Paid" also excludes Submitted (an approval-time check and 422 `CARD_PAID_AMOUNT_EXCEEDED` added in 13b).

| ID | Class | Where | Finding |
|---|---|---|---|
| R1b-1 | D | SKILL.md step 7 (On an update) with step 8 item 6 and E3 | A marker-answer update runs a delta review, which can raise a new legal-basis question; the skill never proposes a legal basis, so the gate re-shuts with no way to reopen it in the same run. Same loop family as BR2-8. |
| R1b-2 | B | step 8b E3 | Whether a question blocks the gate depends on where the reviewer puts its marker: the same kind of DPO question blocks in 13e but not in chunk 07 (OI-31 against OI-33). |
| R1b-3 | B | SKILL.md step 10 "fill in section Y" row and `transform-detection.md` § Update this SDD, against step 7 (On an update), the step 10 preamble, and step 8 item 7 | Does a targeted update end with step 8b? Some rows list it, others do not. |
| R1b-4 | B | step 8b E4 | "This run" in the same-date rule is undefined (one request or the session). |
| R1b-5 | C | SKILL.md § Output conventions, Versions; `decision-log.md` | Do chunks 18 and 00 belong in the `Chunks:` list? `decision-log.md` has a VERSION field but no rule for when it changes. |

## R1c: last marker, gate, chunk 19 (done 2026-10-06 about 20:10, about 6 hours)

Result: v1.1 to 1.3 (1.2: the answer, two standing-answer values (Art. 17(3)(e) erasure ground; legitimate interests for held purchases), the delta review OI-35 to OI-41 (4 accepted, OI-36 adjusted, OI-35 and OI-39 rejected), chunk 19 written with its faithfulness check; 1.3: request 2 rewrote an identical chunk 19, and the second faithfulness check's fixes forced a second bump). Gate `Open - Up to date`. The faithfulness checks found 7 real source inconsistencies, each fixed in its own chunk (a 422 against 400, three idempotency keys, a timeout claim, CUSTOMER write against read in §16.7, an ADR pointer). Write scope checked (15 SDD files changed or added; BRDs and `source/` unchanged). Snapshot `SP3/s6R/after-R1c/`.

`check_e2e.py` on the result (read-only, before the checks stage): E1-E4 met, gate line Open; 16 problems to triage: 5 x §24.1 rows that never say "module"; §24.4 does not point to chunk 10 (§24.4 is not applicable with no topics); 10 x §24.5 in-process edges missing (7 to notifications, which chunk 19 treats as the universal subscriber of §24.5.3, and 3 self-edges refund-requests to its own POS adapter). Each is a chunk 19 slip, a template gap, or a checker gap: triage in the checks stage.

| ID | Class | Where | Finding |
|---|---|---|---|
| R1c-1 | B | SKILL.md step 8 item 7, step 7 (On an update), step 8b | Every update ends in step 8b, which has no "already up to date" branch, and the faithfulness check runs on every write, so a second "generate chunk 19" request rewrote an identical chunk, checked it again, and its fixes forced a second version. |
| R1c-2 | B | step 8 item 6 | No rule for a user answer that covers only part of a marker (the agent narrowed the marker to its open half). |
| R1c-3 | B | SKILL.md step 10 preamble against step 8b item 3 | Faithfulness-check fixes in chunks 01 to 17: a delta review (the preamble) or only a Changes Log record and a step 6a rerun (8b item 3)? |
| R1c-4 | B | step 8b E3 | Only markers in 09-13x and §7.3 block the gate, so a value the 13x chunks rely on but that is marked only in chunk 08 (provider timeouts) or chunk 04 does not block it: placement decides gating (with R1b-2). |
| R1c-5 | C | `chunks/19-e2e-system-design.md` §24.1 | No name for a single phase with no topics (the agent wrote "P1 (single release)"). |
