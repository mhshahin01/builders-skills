# FC regression baseline provenance

Selected by Mahmoud on 2026-10-13: the latest completed run, FC (`fc-2026-10-10`). Generated on skills `fbf4f8c`; promoted after the FC fixes at skills `a22f97e`. This is a normalized regression fixture, not another autonomous run or a sign-off.

Source: `W:/ITV/projects/hivantic/fixture-runs/fc-2026-10-10/run/` plus its sibling `source/`, copied here as `source/`. The initial 155 run/source files matched byte for byte. Two referenced interview records were also copied byte for byte into `standins/` so evidence links resolve inside the baseline. The original FC folder, earlier baselines, source inputs and source snapshots are preserved.

## Normalization

Eight compound clarification markers were separated into nineteen questions. No answer, requirement, rule or approver decision was invented. Existing owners and blocking references carry forward. Ten additional TD rows track the separated questions. REFUNDS now has 90 TD rows (70 Open, 1 Decided - pending application, 19 Resolved) and 66 distinct clarification questions in chunks 00-12; LOYALTY has 76 TD rows (35 Open, 41 Resolved) and 32 distinct clarification questions.

| Document | Original marker | Current TD rows |
|---|---|---|
| brd-refunds-portal | merchant-account condition, refund time-limit condition, original-payment details condition | TD-74, TD-84, TD-85 |
| brd-refunds-portal | refund reason list, faulty-item refund window, faulty-item remedy | TD-63, TD-86, TD-87 |
| brd-refunds-portal | second-approval threshold, second-approval role | TD-47, TD-88 |
| brd-refunds-portal | cross-branch objectives owner, cross-branch objectives report | TD-65, TD-89 |
| brd-refunds-portal | filter requirement, filter choices | TD-34, TD-90 |
| brd-loyalty-points | current state, problem to solve | TD-25, TD-74 |
| brd-loyalty-points | expected cost, expected business value | TD-52, TD-53 |
| brd-loyalty-points | screen languages, date formats, number formats | TD-31, TD-75, TD-76 |

The copied BRD to-do completion criteria reflect the already-approved FC-7 A ruling: an interview must reach its end. LOYALTY step 3 is In progress and G3 is Not met because 13 questions were never asked in the original session while the frontier remained blocked; its applied D1 and D2 remain applied. REFUNDS was already unfinished. Neither BRD delivery gate opens. Copied interview evidence: [LOYALTY](standins/loyalty/grill-me-session.md) and [REFUNDS](standins/refunds/grill-me-session.md). Both match the originals in the FC folder; the ruling is its `TRIAGE.md` section Rulings.

Three relative source-path references were relocated from `../../source/` to `../source/`; two interview links and one link label moved from `../../standins/` to `../standins/`. Both BRD masters link to this provenance record. Version numbers remain REFUNDS 1.5, LOYALTY 1.7, SDD 1.4 and LLD 1.2: these are editorial question splits, delivery tracking and reference relocation, not product content changes. Original review and consistency records describe the original FC revisions; no new BRD consistency run or interview is claimed for this copy. Both BRD step 2 statuses are In progress and G2 is Not met because the editorial changes postdate the original runs; current normalized-copy consistency coverage is pending. Each BRD has 0 of 5 steps Complete. Historical findings, including LOYALTY CF-59, are preserved; separate dated notes record the promotion corrections and current mockup dependencies.

The SDD and LLD are byte-identical to FC. E4 remains met by content hash `96819fd891ef423f`; E3 retains 23 owner-only blockers, so the E2E gate stays Locked and chunk 19 remains absent. The LLD retains 65 Confirm and 74 TODO flags. The bare `REFUNDS/UC-04` in the SDD merged-use-case Status cell remains a structural report entry, not a checker note or broken link.

The earlier `run-2026-10-07-review` snapshot stays unchanged for open-gate and chunk 19 coverage; regression tests also continue to exercise older fixtures. The stricter trigger-tie checker now reports its missing Input-row citation as a problem.
