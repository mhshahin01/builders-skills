# Live-check findings, 2026-10-07 (next-round input)

The skills were frozen on 2026-10-07 at 09:15 after the last live runs. Nothing below is applied. Sources: the reports of the SDD 1.7 run ("apply the pending decision and refresh the e2e") and the LLD 1.3 run ("the SDD has a new version"), both on `_fixtures/runs-wip/step6-R/review/` (saved as `chain/run-2026-10-07-review/`). The findings of the earlier gate rerun and of the SDD 1.6 run were fixed the same day (stage rows GATE, FIX2 and SDD16 in `../step6-plan.md`).

## Skill text

### sdd-unifier

1. **Review kind for an update that only applies a pending item.** SKILL.md step 7 (On an update, Review after answers, Review limit) and step 10 (common tail) do not say whether the first pass is a delta review or an application check; `chunks/18-open-items-and-clarifications.md` Reviewer Notes labels differ. The run counted one pass and labelled it `application check`.
2. **Row granularity.** The new Reviewer Notes label "one dated row per checked item, chunk NN (OI-NN)" does not fit an item that spans two chunks; pass 1 wrote one row per changed chunk.
3. **Policy: a faithfulness-found source problem that no chunk 19 claim depends on.** SKILL.md step 8b item 3 and Faithfulness source corrections allow only "fix it (one clear side)" or "raise an open item (shuts the gate)". The run met a naming question (`CustomerAccountClosed` is both 13a's internal publication and an API-12 typed error) that bears on no chunk 19 claim, and recorded it for the owner without raising it. Needs a decision: record it for the owner without shutting the gate, or raise it as an OI.
4. **Chunk 19 version after a regeneration with no semantic change.** SKILL.md Versions says chunk 19 keeps "the version it was written at" and `Chunks:` lists semantic changes only; a regeneration that changes nothing would carry the new version without being listed, which `check_versions.py` reports.
5. **Already current behind a Stale gate.** SKILL.md step 8b (Already current) does not say what to do when the gate is Stale but the source edits touch nothing chunk 19 asserts. The run treated any change to the contract registry as relevant and regenerated.
6. **Re-check after faithfulness fixes.** "On every write of chunk 19" leaves open whether the fixes made after the check are a new write. The run had the same agent confirm only the fixed passages.
7. **Open remainder placement.** `decision-log.md` puts the open remainder inside the Decision record in the Clarification register but on its own line in the Marker register.
8. **Gate line template.** `chunks/sdd-master.md` allows only "open conditions" after the dash; for an Open gate the run added its verification evidence.
9. **Process note.** Step 8 item 3 applies a Recommended Answer as written, so a neighbouring cell it leaves inconsistent needs a new OI (that is how OI-46 arose). Consider letting the application check fix a plainly dependent neighbouring cell.

### lld-unifier

10. **Delta-review rows.** SKILL.md step 7 (On an update) asks for one dated row per changed chunk, but `chunks/18-open-items-and-clarifications.md` has no column for it in the per-service table; R3d used a separate heading.
11. **No mapping row for SDD chunk 18.** `sdd-to-lld.md` § the field mapping table has no row for SDD 18, although SDD Changes Log rows list it.
12. **Step 6b omitted.** `chunking.md` and `sdd-to-lld.md` (new SDD version) leave out step 6b (Specs), which SKILL.md includes.
13. **Routine sync or content.** SKILL.md Versions: unclear whether chunk 15 index edits and the §19.1 version cells are routine synchronization. The run listed both as content.
14. **Retention mapping.** `sdd-to-lld.md` sends the SDD Retention Policy only to 05 §8.6, but the retention algorithm lives in 04 §7.3 (mapped from Business Logic).
15. **Carried flags.** `sdd-to-lld.md`: a carried `[NEEDS CLARIFICATION]` flag can sit outside the mapped chunks; no effect in this run.
16. **Policy: no re-check of fixes applied after the LLD delta review.** SKILL.md step 7 has no scoped re-check like the SDD's Review limit, so the five applied items (OI-09 to OI-13) had no second pass. Needs a decision: add one scoped check, or keep a single pass.

## Fixture design gaps (seen, not raised; the owners' backlog)

- SDD 13e §17.5: a purchase reported before late leave and rejoin notices earns in the ended period and never counts in the new membership, against the LOYALTY 03 rule that a purchase on or after the rejoin day earns.
- SDD §11.1 audit columns are missing on `refund_application`, `refund` and `membership_period`.
- SDD 13a: `CustomerAccountClosed` names both an internal publication and an API-12 typed error.
- SDD §12 INT-06: "one batch" and its Auth cell; INT-04 to INT-06 Auth cells name no credential store; API-10 and API-11 credentials are not stated per tenant.
- SDD 1.7 reviewers, seen and not raised: how a go-live import sent as several calls maps to one `go_live_import` run (near OI-22); no refused-call alert for API-07 to API-09; the inbound endpoints use business keys rather than `Idempotency-Key`; the API-09 marker names no document; ADR-03 How is narrower than §11.2; the §11.6 source-address assumption.
- LLD 1.3: CONFIRM-23, CONFIRM-24 and TODO-38 are routed to sdd-unifier.

## Checker limits (known)

- `check_e2e.py` reads E4 from dates and the step 6a mention in the newest Changes Log row; it cannot see an unfixed step 6a finding. It cannot verify E3 claim dependencies or nonblocking reasons; those need a human source review.

## Found in the close-out review (Claude Code, 2026-10-07)

Codex's own follow-up review found two defects in the S3 output (`_fixtures/scenarios/pre-brd-to-brd/rerun-2026-10-07/brd-clinic-reminders/`); the Claude Code review confirmed both. The skill rules exist; the run did not follow them. The saved output stays as run evidence and is not corrected by hand.

- **S3-1. A regulatory constraint is dropped.** Pre-BRD 08 Political point 4 (`run/pre-brd-clinic-reminders/08-pestle-analysis.md:15`) says SMS goes only through an NTRA-licensed aggregator and hosting in Egypt only with a licensed provider. The BRD carries the SMS half (02:63, 08:16, 12:59) but not the hosting half: chunk 02 has no such constraint, and 12:59 cites hosting only to the Legal row. Rule: `brd-unifier/sow-transformation.md:179` (a legal or regulatory PESTLE factor becomes a 02 constraint).
- **S3-2. The to-do register does not follow the template.** In `14-todo.md:60-113`, all 54 rows have the same Blocks text ("Linked requirement, objective or acceptance outcome"), every Source cites a chunk file but no section or UC ID, and every Kind is "Owner clarification", which is not one of the three template values. TD-16 (`14-todo.md:75`) merges the WhatsApp sender-model question (02:77, 04:62, 06b:280, 06c:176, 08:38, 12:79) with the residency hand-off and words it as an SDD hand-off; the incorporation question (02:62) has no named decision. Rules: `brd-unifier/delivery-chunks.md:143`, `:148` and `:155`; `brd-unifier/chunks/14-todo.md:80-84`. The step 3 register (`run/brd-clinic-reminders/14-todo.md`) met them.

Hardening candidates for the next round (not applied):

- **H1.** `brd-unifier/sow-transformation.md:179`: say that a regulatory point in any PESTLE row (Political included) becomes a 02 constraint, one per implication.
- **H2.** The BRD consistency check (C10) or chunk 14 step 1: flag a TD row whose Blocks cell names no use case, NFR or chunk section, whose Source names no section or UC ID, or whose Kind is not one of the three values.
