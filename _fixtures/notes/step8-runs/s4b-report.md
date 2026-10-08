# Step 8 run S4b: LLD 1.3 takes SDD 1.12 (condensed report)

## The run

- **Skill and request:** lld-unifier read from disk; request "The SDD has a new version".
- **Input:** S4a's final chain, with LLD 1.3 as the baseline left it.
- **Agent:** a background agent, 2026-10-07 23:36 to 2026-10-08 01:12 local, with the brief `briefs/s4b.md` in the session scratchpad.
- **Answer policy:** chunks, from-sdd, accept the refresh offer, accept every recommendation, person-only facts as test-fixture values.
- **The fixture's `decision-log.md`:** marked read-only in the brief, and byte-identical after the run.
- **Saved output:** `chain/run-2026-10-07-s8/`, with S4a.
- **Verification:** Claude Code checked the claims against the files.

## Output
- **Version:** LLD 1.3 to 1.4, one update. The row lists Chunks 03, three module files, 06, 09, 10, 13, 15, 16 and 18. The Child LLDs row in the SDD now reads LLD 1.4 against SDD 1.12.
- **The refresh, before review:** it read SDD rows 1.8 to 1.12 and brought in:
  - the five §8.1.1 synchronous calls (03 §6.4);
  - the account-closure incomplete-read rule, its alert and §20.1.17;
  - the 5-minute branch refresh and its 10-minute alert;
  - the staff role taken from the API-11 token;
  - the card-paid amount left and 422 `NO_CARD_PAID_AMOUNT_LEFT`;
  - the fixed business clock and the Keycloak container (13 §16.2, §16.3);
  - `IdentityProviderPort` and `MessageDispatchPort` named in customer-accounts §7.4;
  - the §20.1.15 export keyed by member;
  - §13.7 response homes brought in line with SDD §20.
- **Flags:** CONFIRM-23 and CONFIRM-24 were removed (answered by the SDD 1.11 Retention Policy). TODO-39 to TODO-43 and CONFIRM-25 were added, and TODO-28, TODO-29, TODO-31 and TODO-42 reworded. The total is now 43 TODO and 23 Confirm.
- **Delta review:** OI-14 to OI-23, all accepted and applied in the same update. Among them, OI-17 added the §7.2 `KeycloakIdentityProviderAdapter` row with its operations.
- **Application check (a fresh agent, ten rows):** every applied text matches its recommendation. It raised OI-24 to OI-28, which stay Open and are offered for a new request. Two passes in all.
- **Specs:** re-synthesised because SDD chunk 01 changed; identical.
- **Checks on the saved copy:** links 1,314 with 0 bad; trace, lineage, versions and Mermaid 0.

## Deviations
- An empty folder was created outside the run folder and removed at once.
- The fixture decision log was scanned by searches but never read or written.
- The review agents returned text that the run inserted, instead of writing chunk 18.
- The CLAUDE.md rules were given inline.
- When applying OI-16, the "orphan" wording at customer-accounts §7.4 and 09 §12.5 was not brought in line; the application check caught it as OI-26.
- 10 §13.7 was corrected outside the field mapping's literal destinations.

## Unclear or conflicting skill text (triaged in `../step8-triage/lld.md`)
1. The scope of "compared with that source as it stands now".
2. No mapping row sends SDD §11.4 alerting or the §20 triggers to 10 §13.7.
3. No rule for a Resolved item that the change confirms.
4. TODO or Confirm for an SDD decision still pending application.
5. Whether the out-of-date note is kept after an accepted refresh.
6. An SDD version inside a link label: a link or content?
7. Does "chunk" stay before a per-service file name in a coverage label?
8. Two parts:
   - The skill is silent on an SDD whose gate is Stale with pending items.
   - The reviewer-writes-chunk-18 and CLAUDE.md-path steps conflicted with the brief.
