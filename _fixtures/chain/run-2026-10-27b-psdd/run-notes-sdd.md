# Run notes: Task 7.3, SDD fixture run on the G3-signed Pre-SDD (run-2026-10-27b-psdd)

Runner: one unattended run of `sdd-unifier` (read from `WT\sdd-unifier\SKILL.md` and its rule files by path; never the Skill tool, never an installed copy, never the pre-sdd-unifier rule files). Request, as the Software Architect's user: "Derive an SDD from these BRDs: ./brd-refunds-portal and ./brd-loyalty-points. whole. Answer policy: accept the recommended option. Continue at part checkpoints. Stand-ins: Approver." The policy is recorded as set by the tester (fixture), 2026-10-27. Writes stayed inside RUN (temp files under `TOOLS\sdd-run3`); no git command; no browser tool; times are UTC.

## Outcome

- SDD `./sdd-refunds-platform/`, version 1.0, CHUNKS mode, generation `whole`, intent derive-from-BRD. 23 chunk files (00 to 18 with 05a and 13a to 13d) plus the master and `decision-log.md`; chunk 19 not written (gate Locked); chunk 20 not written.
- Design: a modular monolith (Java 21 / Spring Boot, PostgreSQL 17+, one schema per module) with four modules: refund-request (REFUNDS/UC-01 to UC-04), payout, notification, loyalty-points (LOYALTY/UC-01, UC-02). 11 durable in-process domain events (§14.10), no broker; 9 API contracts (3 Internal (in-process) Defined, 6 External `TBD - external`); 15 permission tokens; 32 Mermaid blocks; 75 body markers, 17 of them E3-blocking.
- Step 2a: the Pre-SDD `pre-sdd-refunds-platform/` v1.0 was found, read in the required order, judged signed (G3 Approved with conditions, SDD authorized Yes), loaded and locked. Every locked item of chunk 12 § 12.2 lands where its landing table says (table below; the landing script found no missing row).
- Review: 3 of 3 passes (baseline + 2 scoped application passes, the one approved reviewer dispatch continued by SendMessage), plus one re-dispatch on OI-19 (not a pass). 38 open items: 31 Accepted - applied, 1 Adjusted - applied (OI-18), 1 Rejected (OI-19, `No change`), 2 Decided - pending application (OI-37, OI-38, last-pass discoveries), 3 Open (OI-23 and OI-24 owned by the E2E Architect, HR-004 and HR-005; OI-27 reserved for the product owner by AGENTS.md).
- E2E gate: Locked - E1 not met (5 items), E2 met, E3 not met (17 blocking markers), E4 met (Reconciled entry 2, content sha256:4cedb1b7e270bff0).
- Board: Software Architect row `Done v1.0`, waiting on the E2E Architect (HR-004; HR-005). HR-003 went `Later` -> `Accepted` (20:05) -> `Done` (21:39, Closed 2026-10-27 21:39). HR-004 and HR-005 raised `Open` (21:20). `check_status_board.py`: 0 problems.
- All requested checkers exit 0 with 0 problems on the new SDD (outputs below).

## Timeline (UTC, 2026-10-27)

| Time | Step |
|---|---|
| 19:53 | Read the brief, `run-notes.md` (with the Task 7.2b refresh), `unifier-status.md`, `AGENTS.md` |
| 19:54 to 20:03 | Read `SKILL.md`, `brd-to-sdd.md`, `architecture-questionnaire.md`, `chunking.md`, `parts-mode.md`, `decision-log.md`, `mermaid-diagrams.md`, `mermaid-syntax.md`, `sdd-quality.md`, the chunk skeletons; both BRDs (chunks 00 to 12; the REFUNDS chunk 13 open items as context) |
| 20:00 | Step 1 (no SDD folder: not a resume); step 2 DERIVE-FROM-BRD; step 2a search, read (chunk 00 Source BRDs, chunk 12, master gate line, chunk 11), signed, load |
| 20:05 | Board: HR-003 `Accepted`; own row `In progress: step 3` |
| 20:05 | Policy answers recorded for later: mode `chunks`, derive from `In Review` BRDs, Project Type Greenfield, questionnaire Accept all, ecosystem Accept all proposed |
| 20:05 to 20:42 | Chunks 00 to 17, master, decision log written (sources with link macros, built by `TOOLS\sdd-run3\build.py`) |
| 20:43 | Step 6a (script `reconcile.py`): 0 divergences; Reconciled entry 1 |
| 20:45 | Board: own row `In progress: step 7`; baseline review dispatched (Agent, general-purpose) |
| 21:08 | Chunk 18 written: OI-01 to OI-24 (OI-23, OI-24 with the E2E Architect owner line) |
| 21:09 | Re-dispatch on OI-19 (author held it wrong, with the trigger tie rule): rewritten as `No change` |
| 21:10 to 21:16 | Acceptance loop under the policy: 20 items applied, OI-18 adjusted, OI-19 rejected; author items OI-25, OI-26 (Missing scenario, applied as BRD follow-up markers), OI-27 (AGENTS.md conflict, left Open); step 6a rerun 0 divergences |
| 21:20 | Board: HR-004, HR-005 raised to the E2E Architect |
| 21:17 to 21:25 | Application pass 1 (SendMessage): OI-28 to OI-36 raised |
| 21:26 to 21:30 | OI-28 to OI-36 accepted and applied; step 6a rerun 0 divergences |
| 21:30 to 21:38 | Application pass 2 (the last): OI-37, OI-38 raised; decided, pending application |
| 21:38 to 21:41 | E3 inventory (75 rows, 17 blocking), Reconciled entry 2 with hash, gate line Locked, Changes Log row; board `Done v1.0`, HR-003 `Done` |
| 21:41 to 21:46 | Checkers; citation hygiene fixes (keys and links in chunk 18, the decision log, the master; plain state names in one §17.2 table); step 6a and hash rerun; checkers rerun, all clean |

## Step 2a evidence

1. **Find.** The project root holds one `pre-sdd-*/` folder, `pre-sdd-refunds-platform/`, and no `PRE-SDD-*.md` file. Its chunk 00 Source BRDs (lines 30 to 33) name REFUNDS `../brd-refunds-portal/refunds-portal-brd-master.md` v1.5 and LOYALTY `../brd-loyalty-points/loyalty-points-brd-master.md` v1.7: the same set, by the same links, as this SDD's sources, so it matches. `_snapshots/pre-sdd-refunds-platform.pre-g3/` is not a root-level `pre-sdd-*/` folder, so the step 2a search did not find it and it was never offered; no problem to record (a recursive search would find a second master, which SKILL.md:158 does not do).
2. **Read order.** Chunk 12 (`12-sdd-handoff-guide.md`, in full) first, then the master's **Gate:** line (master line 27: "G3 Approved with conditions - G3: Approved with conditions - SDD authorized: Yes"; version line 4 `VERSION: 1.0`), then chunk 11 (in full). No other Pre-SDD file was read for content; heading lines of the register chunks, 02, 04, 09, and 10 were listed only to build `PSDD/<ID>` link anchors.
3. **Signed.** Chunk 12 § 12.1: G3 status `Approved with conditions`, authorized `Yes`; the gate line does not read `Review`; chunk 11 § 11.1 G3 `Approved with conditions`, ten counted stand-in signatures, COND-01, EXC-01 valid.
4. **Load records.**
   - Chunk 00 Source Pre-SDD row: `sdd-refunds-platform/00-cover-and-changelog.md:38`, `| PSDD | Refunds Platform | 1.0 | G3 Approved with conditions | [refunds-platform-pre-sdd-master.md](../pre-sdd-refunds-platform/refunds-platform-pre-sdd-master.md) |`.
   - Master **Source** line: `refunds-platform-sdd-master.md:27` (the two BRD masters and the Pre-SDD master).
   - `decision-log.md` § Pre-SDD record: heading line 35, the Loaded entry line 37, and the two Requested entries (HR-004, HR-005) after it.
   - `check_presdd.py --sdd`: the row, key, version, gate label, link, every cited `PSDD/<ID>`, and the §18 CALC values all pass (0 problems).

## Where each locked item landed

Every row of chunk 12 § 12.2's landing table is cited `PSDD/<ID>` with a link in its SDD place; the script `TOOLS\sdd-run3\landing.py` checked each (place, row) pair inside the right section and found none missing.

| SDD place (chunk 12 § 12.2 landing) | Locked rows, each with its first `PSDD/<ID>` citation (file:line) |
|---|---|
| Project Type | HDR-07 01-executive-summary-scope-risks:30 |
| Q3 | CAP-01 decision-log:24; CAP-02 decision-log:24; CAP-03 decision-log:24; CAP-04 decision-log:24; CAP-05 decision-log:24; CAP-06 decision-log:24; CAP-07 decision-log:24; CAP-09 decision-log:24; CAP-10 decision-log:24; REL-01 decision-log:24; REL-02 decision-log:24; DAT-02 decision-log:24; DAT-08 decision-log:24 |
| Q7 | DAT-07 decision-log:28 |
| Q8 | HDR-08 decision-log:29 |
| §6 Notes | DAT-01 02-ecosystem-overview:22; DAT-03 02-ecosystem-overview:22; DAT-04 02-ecosystem-overview:22; DAT-05 02-ecosystem-overview:22; DAT-06 02-ecosystem-overview:22; SEC-01 02-ecosystem-overview:26; SEC-02 02-ecosystem-overview:26; SEC-03 02-ecosystem-overview:26; SEC-04 02-ecosystem-overview:27; SEC-05 02-ecosystem-overview:22; SEC-06 02-ecosystem-overview:26; SEC-07 02-ecosystem-overview:26; SEC-08 02-ecosystem-overview:26; INT-02 02-ecosystem-overview:24; INT-04 02-ecosystem-overview:24; INT-05 02-ecosystem-overview:18; ECO-01 02-ecosystem-overview:19; ECO-03 02-ecosystem-overview:19 |
| §8.3 | HDR-08 04-architecture-style-and-diagrams:107; DAT-01 04-architecture-style-and-diagrams:108; DAT-05 04-architecture-style-and-diagrams:109; INT-02 04-architecture-style-and-diagrams:110; INT-03 04-architecture-style-and-diagrams:111; INT-04 04-architecture-style-and-diagrams:112; INT-05 04-architecture-style-and-diagrams:113; INT-08 04-architecture-style-and-diagrams:114 |
| §8.6 | HDR-08 05a-infrastructure-and-network:16; REL-01 05a-infrastructure-and-network:22; REL-03 05a-infrastructure-and-network:53; REL-04 05a-infrastructure-and-network:53; REL-05 05a-infrastructure-and-network:21; REL-10 05a-infrastructure-and-network:45; DAT-04 05a-infrastructure-and-network:21; DAT-09 05a-infrastructure-and-network:61; INT-07 05a-infrastructure-and-network:21 |
| §8.7 | DAT-04 05a-infrastructure-and-network:127; SEC-03 05a-infrastructure-and-network:134; SEC-04 05a-infrastructure-and-network:158; SEC-07 05a-infrastructure-and-network:173; INT-06 05a-infrastructure-and-network:146; INT-07 05a-infrastructure-and-network:127; INT-08 05a-infrastructure-and-network:121 |
| §11 | BUS-07 07-cross-cutting-concerns:16; BUS-08 07-cross-cutting-concerns:16; REL-03 07-cross-cutting-concerns:20; REL-04 07-cross-cutting-concerns:20; REL-05 07-cross-cutting-concerns:20; REL-10 07-cross-cutting-concerns:18; DAT-03 07-cross-cutting-concerns:34; DAT-04 07-cross-cutting-concerns:75; DAT-06 07-cross-cutting-concerns:28; DAT-07 07-cross-cutting-concerns:38; SEC-01 07-cross-cutting-concerns:34; SEC-02 07-cross-cutting-concerns:71; SEC-03 07-cross-cutting-concerns:78; SEC-04 07-cross-cutting-concerns:72; SEC-05 07-cross-cutting-concerns:74; SEC-06 07-cross-cutting-concerns:78; SEC-07 07-cross-cutting-concerns:71; SEC-08 07-cross-cutting-concerns:78; INT-08 07-cross-cutting-concerns:76 |
| §18 | CAP-01 14-performance-and-capacity:18; CAP-02 14-performance-and-capacity:20; CAP-03 14-performance-and-capacity:21; CAP-04 14-performance-and-capacity:22; CAP-05 14-performance-and-capacity:27; CAP-06 14-performance-and-capacity:23; CAP-07 14-performance-and-capacity:35; CAP-08 14-performance-and-capacity:31; CAP-09 14-performance-and-capacity:44; CAP-10 14-performance-and-capacity:27; DAT-02 14-performance-and-capacity:24; DAT-08 14-performance-and-capacity:25; INT-03 14-performance-and-capacity:46 |
| §18.5 | CAP-08 14-performance-and-capacity:70; REL-01 14-performance-and-capacity:70; REL-02 14-performance-and-capacity:70; REL-03 14-performance-and-capacity:70; REL-04 14-performance-and-capacity:70; REL-05 14-performance-and-capacity:70; REL-10 14-performance-and-capacity:69 |
| §19 | REL-03 15-environments:12; REL-04 15-environments:12; REL-05 15-environments:12; OPS-04 15-environments:12 |
| §20 | REL-03 16-operations-runbook:14; REL-04 16-operations-runbook:14; REL-05 16-operations-runbook:14; REL-06 16-operations-runbook:14; REL-07 16-operations-runbook:16; DAT-09 16-operations-runbook:16; OPS-06 16-operations-runbook:16 |
| §4 risk (COND-01) | COND-01 01-executive-summary-scope-risks:74 |

Conditions, exceptions, unknowns:

- COND-01 is risk **R-03**, `01-executive-summary-scope-risks.md:74`, citing `PSDD/COND-01`, owner Refunds and Loyalty Product Owner, due 2026-12-15; also a §11.3 promotion gate and the reason API-04 stays `TBD - external`.
- EXC-01 stays open and cited with SEC-01.1: risk R-04 (`01-executive-summary-scope-risks.md:75`), the §11.6 law marker, the §11.3 prod gate, the §6 IAM Notes.
- QD-01 to QD-08 stay open and cited: QD-01 (01, 14 §18.5 LOYALTY/NFR-04), QD-02 (14 §18.2, §18.5 REFUNDS/NFR-05), QD-03 (01, 15, 16), QD-04 (01, 04, 08, 11, 13a), QD-05 (01, 04, 08, 11, 13a), QD-06 (14 §18.1, §18.3), QD-07 (05a §8.6.4, 14 §18.5 marker), QD-08 (01, 14).
- Every lock-list entry that reads `TBD`/`Open` (CAP-05.1, CAP-10.1, REL-02.1, REL-07.1, DAT-07.1, DAT-09.1, SEC-01.1, SEC-03.1, SEC-06.1, SEC-08.1, INT-03.1 to INT-03.3, INT-06.1, OPS-06.1) is carried as an open marker or a cited open value, never filled. Q7 waits for DAT-07.1 (ADR-05 Proposed, §11.2 marker).
- Pre-SDD ADRs ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001 are cited, never rewritten (chunk 06 below the ADR table); ADR-PERF-001, ADR-INT-001, ADR-IAM-001 became the SDD's ADR-09, ADR-08, ADR-05 and ADR-06, each citing them.
- No locked value was edited: the values in the SDD are copied from § 12.2 (e.g. §8.6.4 RPO 5 s and 900 s, RTO 300 s and 14,400 s), and the two disagreements went to chunk 18.

## Disagreements with locked values

Two, both raised by the reviewer and kept as open items owned by the E2E Architect, never edits:

- **OI-23** (`18-open-items-and-clarifications.md:377`): asynchronous zone replication with RPO 5 s (`PSDD/REL-04.2`, `PSDD/REL-05.2`) against `PSDD/REL-10.1`; handoff request **HR-004**.
- **OI-24** (`18-open-items-and-clarifications.md:392`): the locked peak rate `PSDD/CAP-02.1` (0.2292 req/s) cannot carry 300 peak active users (`PSDD/CAP-03.1`); handoff request **HR-005**.

Both are shown in the acceptance loop and left `Open` (SKILL.md step 8: an E2E-Architect item is not decided by the user or a policy). The author found no further disagreement at step 7 item 5.

## Checker outputs (run from WT, PYTHONIOENCODING=utf-8, 21:45 UTC; RUN stands for the run folder)

```
2026-10-27 21:42 UTC
> py -3 -B _fixtures/checkers/check_presdd.py RUN/pre-sdd-refunds-platform --sdd RUN/sdd-refunds-platform --cli pre-sdd-unifier/studio/cli.mjs
0 problems
(exit 0)

> py -3 -B _fixtures/checkers/check_status_board.py RUN
0 problems
(exit 0)

> py -3 -B _fixtures/checkers/check_sdd.py RUN/sdd-refunds-platform
PROBLEMS: 0
MARKERS:
  00-cover-and-changelog.md: 0
  01-executive-summary-scope-risks.md: 2
  02-ecosystem-overview.md: 13
  03-users-and-use-cases.md: 1
  04-architecture-style-and-diagrams.md: 3
  05-workflows-and-sequences.md: 0
  05a-infrastructure-and-network.md: 8
  06-principles-and-decisions.md: 1
  07-cross-cutting-concerns.md: 5
  08-integrations.md: 4
  09-services-summary.md: 0
  10-events-hub.md: 1
  11-api-contracts.md: 0
  12-centralized-user-roles.md: 1
  13a-service-refund-request.md: 9
  13b-service-payout.md: 8
  13c-service-notification.md: 2
  13d-service-loyalty-points.md: 6
  14-performance-and-capacity.md: 7
  15-environments.md: 1
  16-operations-runbook.md: 3
  17-appendix-and-wishlist.md: 0
  18-open-items-and-clarifications.md: 8
  decision-log.md: 0
  refunds-platform-sdd-master.md: 0
TOTAL MARKERS: 83
MERMAID BLOCKS: 32
(exit 0)

> py -3 -B _fixtures/checkers/check_sdd.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
PROBLEMS: 0
MARKERS:
  00-cover-and-changelog.md: 0
  01-executive-summary-scope-risks.md: 4
  02-ecosystem-overview.md: 7
  03-users-and-use-cases.md: 0
  04-architecture-style-and-diagrams.md: 0
  05-workflows-and-sequences.md: 0
  06-principles-and-decisions.md: 0
  07-cross-cutting-concerns.md: 3
  08-integrations.md: 3
  09-services-summary.md: 0
  10-events-hub.md: 0
  11-api-contracts.md: 0
  12-centralized-user-roles.md: 10
  13a-service-refund-request.md: 15
  13b-service-payout.md: 9
  13c-service-customer-notification.md: 2
  13d-service-loyalty-points.md: 7
  14-performance-and-capacity.md: 7
  15-environments.md: 2
  16-operations-runbook.md: 9
  17-appendix-and-wishlist.md: 0
  18-open-items-and-clarifications.md: 10
  decision-log.md: 0
  refunds-platform-sdd-master.md: 0
TOTAL MARKERS: 88
MERMAID BLOCKS: 17
(exit 0)

> py -3 -B _fixtures/checkers/check_uc_keys.py RUN/sdd-refunds-platform
Register:
  REFUNDS: Refunds Portal v1.5 -> brd-refunds-portal (exists: True)
  LOYALTY: Loyalty Points v1.7 -> brd-loyalty-points (exists: True)
Child LLDs section present: True
Per file: keyed links / unkeyed links / bare mentions
  01-executive-summary-scope-risks.md: 3 / 0 / 0
  02-ecosystem-overview.md: 1 / 0 / 0
  03-users-and-use-cases.md: 16 / 0 / 1
  05-workflows-and-sequences.md: 16 / 0 / 0
  06-principles-and-decisions.md: 2 / 0 / 0
  07-cross-cutting-concerns.md: 2 / 0 / 0
  08-integrations.md: 5 / 0 / 0
  09-services-summary.md: 8 / 0 / 0
  10-events-hub.md: 13 / 0 / 0
  11-api-contracts.md: 25 / 0 / 0
  12-centralized-user-roles.md: 9 / 0 / 0
  13a-service-refund-request.md: 29 / 0 / 0
  13b-service-payout.md: 11 / 0 / 0
  13c-service-notification.md: 18 / 0 / 0
  13d-service-loyalty-points.md: 17 / 0 / 0
  18-open-items-and-clarifications.md: 28 / 0 / 0
  decision-log.md: 1 / 0 / 0
  refunds-platform-sdd-master.md: 10 / 0 / 1
Problems: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_uc_keys.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
Register:
  REFUNDS: Refunds Portal v1.5 -> brd-refunds-portal (exists: True)
  LOYALTY: Loyalty Points v1.7 -> brd-loyalty-points (exists: True)
Child LLDs section present: True
Per file: keyed links / unkeyed links / bare mentions
  00-cover-and-changelog.md: 5 / 0 / 0
  01-executive-summary-scope-risks.md: 8 / 0 / 0
  03-users-and-use-cases.md: 16 / 0 / 1
  05-workflows-and-sequences.md: 16 / 0 / 0
  06-principles-and-decisions.md: 2 / 0 / 0
  07-cross-cutting-concerns.md: 4 / 0 / 0
  08-integrations.md: 5 / 0 / 0
  09-services-summary.md: 8 / 0 / 0
  10-events-hub.md: 18 / 0 / 0
  11-api-contracts.md: 23 / 0 / 0
  12-centralized-user-roles.md: 12 / 0 / 0
  13a-service-refund-request.md: 49 / 0 / 0
  13b-service-payout.md: 16 / 0 / 0
  13c-service-customer-notification.md: 18 / 0 / 0
  13d-service-loyalty-points.md: 22 / 0 / 0
  14-performance-and-capacity.md: 1 / 0 / 0
  18-open-items-and-clarifications.md: 84 / 0 / 0
  decision-log.md: 23 / 0 / 0
  refunds-platform-sdd-master.md: 22 / 0 / 0
Problems: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_uc_links.py RUN/sdd-refunds-platform
SDD folder: C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\5cecb36b-03d8-4e5a-8cf5-681dd1950497\scratchpad\tools\runs\run-2026-10-27b-psdd\sdd-refunds-platform
Resolved links into the BRD (file + anchor): 937
Resolved internal links with anchors: 537
UC links to a BRD file with no anchor: 0
Broken links: 0
UC mentions outside code blocks and comments (linked / bare) per file:
  03-users-and-use-cases.md: 0 linked / 1 bare
  refunds-platform-sdd-master.md: 0 linked / 1 bare
03 has a 7.3 section: True
09 has a 'Use cases (BRD)' column: True
(exit 0)

> py -3 -B _fixtures/checkers/check_uc_links.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
SDD folder: C:\Users\negat\.claude\skills-wt\pre-sdd-unifier\_fixtures\chain\run-2026-10-13-fc\sdd-refunds-platform
Resolved links into the BRD (file + anchor): 545
Resolved internal links with anchors: 236
UC links to a BRD file with no anchor: 0
Broken links: 0
UC mentions outside code blocks and comments (linked / bare) per file:
  03-users-and-use-cases.md: 0 linked / 1 bare
03 has a 7.3 section: True
09 has a 'Use cases (BRD)' column: True
(exit 0)

> py -3 -B _fixtures/checkers/check_e2e.py RUN/sdd-refunds-platform
sources: 4 services, 0 topics, 0 catalog events, 0 coverage rows, 11 in-process events, 3 internal and 6 external contracts, 7 §7.3 rows
E3 policy: owner-classified inventory; claim dependencies/nonblocking reasons still require human source review
E1 open items not closed: 5 ['OI-23: Open', 'OI-24: Open', 'OI-27: Open', 'OI-37: Decided - pending application', 'OI-38: Decided - pending application']
E2 open divergence rows: 0 []
E3 markers: 17 {'01-executive-summary-scope-risks.md': 2, '06-principles-and-decisions.md': 1, '07-cross-cutting-concerns.md': 1, '08-integrations.md': 4, '13a-service-refund-request.md': 1, '13b-service-payout.md': 6, '13d-service-loyalty-points.md': 1, '14-performance-and-capacity.md': 1}
E4 reconciled 2026-10-27 vs last Changes Log date 2026-10-27: met (by content hash: chunks 00-17 hash to sha256:4cedb1b7e270bff0, as the newest Reconciled entry records)
master gate line: Locked - E1 not met (OI-23 and OI-24 Open, owned by the E2E Architect, HR-004 and HR-005; OI-27 Open for the product owner; OI-37 and OI-38 Decided - pending application); E2 met (no Open row in §14.8, §15.5, or §16.12.3); E3 not met (17 blocking markers, inventory below); E4 met (Reconciled entry 2)
chunk 19: not written
problems: 0
notes: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_e2e.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
sources: 4 services, 0 topics, 0 catalog events, 1 coverage rows, 13 in-process events, 1 internal and 8 external contracts, 7 §7.3 rows
E3 policy: owner-classified inventory; claim dependencies/nonblocking reasons still require human source review
E1 open items not closed: 0 []
E2 open divergence rows: 0 []
E3 markers: 23 {'01-executive-summary-scope-risks.md': 2, '12-centralized-user-roles.md': 9, '13a-service-refund-request.md': 2, '13b-service-payout.md': 6, '13d-service-loyalty-points.md': 3, '14-performance-and-capacity.md': 1}
E4 reconciled 2026-10-10 vs last Changes Log date 2026-10-10: met (by content hash: chunks 00-17 hash to sha256:96819fd891ef423f, as the newest Reconciled entry records)
master gate line: Locked - E1 met (OI-01 to OI-47 are Accepted - applied or Rejected); E2 met (no Open row in §14.8, §15.5, or §16.12.3); E3 not met (23 blocking markers, inventory below); E4 met (Reconciled entry 5)
chunk 19: not written
problems: 0
notes: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_versions.py RUN/sdd-refunds-platform
document: sdd-refunds-platform (sdd), master refunds-platform-sdd-master.md, chunks ['00', '01', '02', '03', '04', '05', '05a', '06', '07', '08', '09', '10', '11', '12', '13a', '13b', '13c', '13d', '14', '15', '16', '17', '18']
newest Changes Log row: v1.0 (2026-10-27)
version check: initial build, no changed chunks listed
gate state 20: master Deck brief line Locked (no chunk file)
problems: 0
notes: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_versions.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
document: sdd-refunds-platform (sdd), master refunds-platform-sdd-master.md, chunks ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13a', '13b', '13c', '13d', '14', '15', '16', '17', '18']
newest Changes Log row: v1.4 (2026-10-10)
problems: 0
notes: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_mermaid.py RUN/sdd-refunds-platform
mermaid blocks: 32
issues: 0
(exit 0)

> py -3 -B _fixtures/checkers/check_mermaid.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
mermaid blocks: 17
issues: 0
(exit 0)

> py -3 -B _fixtures/checkers/_linkcheck.py RUN/sdd-refunds-platform
LINKS 1605 SDD_REFS 475 BAD 0
FILES 25
(exit 0)

> py -3 -B _fixtures/checkers/_linkcheck.py _fixtures/chain/run-2026-10-13-fc/sdd-refunds-platform
LINKS 936 SDD_REFS 0 BAD 0
FILES 24
(exit 0)

> py -3 -B _fixtures/checkers/diff_runs.py _fixtures/chain/run-2026-10-13-fc RUN --levels 2
== brd-loyalty-points
  totals (base -> new): bytes 369187 -> 369187, clarification 52 -> 52, confirm 0 -> 0, em_dash 0 -> 0, links 643 -> 643, mermaid 1 -> 1, todo 0 -> 0
== brd-refunds-portal
  totals (base -> new): bytes 374929 -> 374929, clarification 98 -> 98, confirm 0 -> 0, em_dash 0 -> 0, links 494 -> 494, mermaid 1 -> 1, todo 0 -> 0
== lld-refunds-platform: only in base
== sdd-refunds-platform
    files only in base (1):
      13c-service-customer-notification.md
    files only in new (2):
      05a-infrastructure-and-network.md
      13c-service-notification.md
  00-cover-and-changelog.md
    tables only in new (1):
      Key | Pre-SDD | Version | Gate | Link
    ids only in base (46):
      ADR-01
      ADR-05
      ADR-07
      ADR-08
      API-02
      API-03
      API-05
      API-07
      API-08
      API-09
      BR-10
      INT-01
      ... 34 more
    ids only in new (3):
      OI-36
      OI-37
      OI-38
  01-executive-summary-scope-risks.md
    ids only in base (8):
      ADR-03
      ADR-07
      API-02
      API-07
      INT-03
      LOYALTY/UC-02
      R-09
      REFUNDS/UC-04
    ids only in new (7):
      ADR-08
      API-05
      API-08
      LOYALTY/UC-01
      PSDD/INT-02
      PSDD/INT-03
      PSDD/INT-05
  02-ecosystem-overview.md
    tables only in base (1):
      Layer | Technology / Service | Version / Tier | Notes
    tables only in new (2):
      Layer | Technology / Service | Version / Tier | Status | Source | Notes
      System | Owner (role) | Role in the eco-system | Interface style | Spec source | §12 row
    ids only in base (7):
      ADR-05
      ADR-07
      ADR-09
      ADR-11
      ADR-12
      API-04
      REFUNDS/NFR-02
    ids only in new (13):
      ADR-03
      ADR-04
      ADR-08
      API-03
      INT-01
      INT-02
      INT-03
      LOYALTY/UC-01
      PSDD/INT-02
      PSDD/INT-04
      PSDD/INT-05
      PSDD/INT-07
      ... 1 more
  03-users-and-use-cases.md
    ids only in base (1):
      API-08
    ids only in new (5):
      API-07
      INT-01
      INT-02
      INT-03
      REFUNDS/NFR-04
  04-architecture-style-and-diagrams.md
    tables only in new (1):
      Locked item | What it fixes in this architecture | Where the design realises it
    ids only in base (10):
      ADR-02
      ADR-05
      ADR-07
      ADR-09
      ADR-11
      API-02
      API-03
      API-04
      API-09
      LOYALTY/NFR-02
    ids only in new (8):
      ADR-04
      ADR-08
      ADR-10
      PSDD/INT-02
      PSDD/INT-03
      PSDD/INT-04
      PSDD/INT-05
      PSDD/INT-08
  05-workflows-and-sequences.md
    ids only in base (3):
      API-06
      API-09
      LOYALTY/NFR-02
    ids only in new (2):
      API-07
      API-08
  06-principles-and-decisions.md
    ids only in base (7):
      ADR-11
      ADR-12
      API-06
      API-08
      LOYALTY/UC-02
      REFUNDS/NFR-02
      REFUNDS/NFR-03
    ids only in new (3):
      LOYALTY/UC-01
      PSDD/INT-02
      PSDD/INT-04
  07-cross-cutting-concerns.md
    ids only in base (9):
      ADR-03
      ADR-07
      ADR-09
      API-02
      API-05
      API-09
      LOYALTY/NFR-02
      REFUNDS/NFR-02
      REFUNDS/UC-04
    ids only in new (4):
      ADR-04
      ADR-05
      PSDD/INT-08
      REFUNDS/NFR-06
  08-integrations.md
    ids only in base (6):
      ADR-07
      API-02
      API-03
      API-09
      INT-04
      LOYALTY/UC-02
    ids only in new (5):
      API-06
      PSDD/INT-03
      R-02
      R-03
      REFUNDS/UC-02
  09-services-summary.md
    ids only in base (2):
      INT-04
      LOYALTY/NFR-01
    ids only in new (2):
      PSDD/INT-05
      REFUNDS/NFR-01
  10-events-hub.md
    tables only in base (4):
      # | Where (chunks) | Divergence | Resolution / flag | Status
      --- | --- | --- | ---
      Event | Catalog (§14.5) | Contract (§14.9 / registry) | Status
      Field | Type | Notes
    ids only in base (4):
      API-02
      API-04
      LOYALTY/NFR-02
      LOYALTY/UC-02
    ids only in new (4):
      API-03
      API-06
      API-08
      INT-01
    events only in base (6):
      CardPaymentDisputeClosed
      CardPaymentDisputeOpened
      PayoutAttemptFailed
      PayoutCancelled
      PayoutReturned
      RefundRequestPayoutReturned
    events only in new (4):
      CardDisputeDecided
      PayoutFailed
      RefundPayoutDelayed
      RefundRequestReturnedToApproved
  11-api-contracts.md
    tables only in base (1):
      # | Where | Divergence | Status
    tables only in new (6):
      Aspect | Value
      Aspect | Value
      DTO | Field | Type | Required | Constraints | Description
      DTO | Field | Type | Required | Constraints | Description
      Error | `errorCode` | When | Retryable | Consumer action
      Error | `errorCode` | When | Retryable | Consumer action
    ids only in base (5):
      ADR-04
      ADR-05
      ADR-07
      INT-04
      R-09
    tokens only in base (1):
      refund.contact.read
    tokens only in new (3):
      payout.card-dispute.read
      refund-request.approved-refund.read
      refund-request.customer-contact.read
  12-centralized-user-roles.md
    tables only in base (5):
      # | Where | Divergence | Resolution / flag | Status
      Capability | `CUSTOMER` | `MEMBER` | `BRANCH_MANAGER` | `PAYOUT_OPERATOR` | `NOTIFICATION_DISPATCHER`
      Permission token | `CUSTOMER` | `MEMBER` | `BRANCH_MANAGER` | `PAYOUT_OPERATOR` | `NOTIFICATION_DISPATCHER`
      Role | Scope | Core authorities | Related services
      Role | refund-request | payout | customer-notification | loyalty-points
    tables only in new (4):
      Capability | `CUSTOMER` | `MEMBER` | `BRANCH_MANAGER` | `PAYOUT_STAFF`
      Permission token | `CUSTOMER` | `MEMBER` | `BRANCH_MANAGER` | `PAYOUT_STAFF` | `REFUND_REQUEST_MODULE` | `NOTIFICATION_MODULE` | `PAYOUT_MODULE` | `PLATFORM_OPERATOR`
      Role | refund-request | payout | notification | loyalty-points
      Sub-role | Scope | Core authorities | Related services
    ids only in base (6):
      ADR-05
      ADR-07
      ADR-08
      API-06
      API-08
      REFUNDS/NFR-04
    ids only in new (1):
      ADR-06
    tokens only in base (11):
      loyalty.points.read-own
      payout.resolution.confirm
      payout.resolution.record
      refund.contact.read
      refund.receipt.read
      refund.report.read-branch
      refund.request.cancel-own
      refund.request.create
      refund.request.decide
      refund.request.read-branch
      refund.request.read-own
    tokens only in new (15):
      loyalty-points.points-balance.read-own
      loyalty-points.points-history.read-own
      payout.card-dispute.read
      payout.manual-result.confirm
      payout.manual-result.record
      platform.event-publication.redeliver
      refund-request.approved-refund.read
      refund-request.branch-report.read
      refund-request.customer-contact.read
      refund-request.receipt.lookup
      refund-request.refund-request.cancel-own
      refund-request.refund-request.create
      ... 3 more
  13a-service-refund-request.md
    headings only in base (1):
      ## 17.1 refund-request
    headings only in new (1):
      ## 17.1 Refund Request
    tables only in new (9):
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
    ids only in base (8):
      ADR-04
      ADR-10
      API-04
      API-06
      BR-10
      REFUNDS/NFR-04
      REFUNDS/OI-10
      REFUNDS/OI-11
    ids only in new (6):
      ADR-01
      ADR-06
      API-01
      API-02
      API-03
      API-09
    events only in base (5):
      CardPaymentDisputeClosed
      CardPaymentDisputeOpened
      PayoutCancelled
      PayoutReturned
      RefundRequestPayoutReturned
    events only in new (4):
      CardDisputeDecided
      PayoutFailed
      RefundPayoutDelayed
      RefundRequestReturnedToApproved
    tokens only in base (8):
      refund.contact.read
      refund.receipt.read
      refund.report.read-branch
      refund.request.cancel-own
      refund.request.create
      refund.request.decide
      refund.request.read-branch
      refund.request.read-own
    tokens only in new (10):
      platform.event-publication.redeliver
      refund-request.approved-refund.read
      refund-request.branch-report.read
      refund-request.customer-contact.read
      refund-request.receipt.lookup
      refund-request.refund-request.cancel-own
      refund-request.refund-request.create
      refund-request.refund-request.decide
      refund-request.refund-request.read-branch
      refund-request.refund-request.read-own
  13b-service-payout.md
    headings only in base (1):
      ## 17.2 payout
    headings only in new (1):
      ## 17.2 Payout
    tables only in new (9):
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Payout state | Result | Effect
    ids only in base (7):
      ADR-04
      ADR-10
      API-01
      API-07
      R-09
      REFUNDS/NFR-06
      REFUNDS/NFR-07
    ids only in new (3):
      API-04
      API-05
      API-06
    events only in base (5):
      CardPaymentDisputeClosed
      CardPaymentDisputeOpened
      PayoutAttemptFailed
      PayoutCancelled
      PayoutReturned
    events only in new (2):
      CardDisputeDecided
      PayoutFailed
    tokens only in base (2):
      payout.resolution.confirm
      payout.resolution.record
    tokens only in new (3):
      payout.card-dispute.read
      payout.manual-result.confirm
      payout.manual-result.record
  13d-service-loyalty-points.md
    headings only in base (1):
      ## 17.4 loyalty-points
    headings only in new (1):
      ## 17.4 Loyalty Points
    tables only in new (5):
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
      Column name | Data type | Required or optional | Description
    ids only in base (6):
      ADR-04
      ADR-10
      API-05
      LOYALTY/NFR-01
      REFUNDS/UC-03
      REFUNDS/UC-04
    ids only in new (4):
      API-08
      LOYALTY/NFR-05
      PSDD/INT-05
      R-05
    events only in base (1):
      RefundRequestPayoutReturned
    events only in new (1):
      RefundRequestReturnedToApproved
    tokens only in base (1):
      loyalty.points.read-own
    tokens only in new (2):
      loyalty-points.points-balance.read-own
      loyalty-points.points-history.read-own
  14-performance-and-capacity.md
    ids only in base (5):
      ADR-02
      ADR-07
      ADR-10
      INT-02
      LOYALTY/UC-02
    ids only in new (3):
      ADR-08
      PSDD/INT-03
      PSDD/INT-05
  16-operations-runbook.md
    ids only in base (1):
      ADR-03
    ids only in new (3):
      API-04
      LOYALTY/NFR-02
      REFUNDS/UC-01
  17-appendix-and-wishlist.md
    ids only in base (1):
      ADR-04
    ids only in new (1):
      ADR-07
  18-open-items-and-clarifications.md
    ids only in base (25):
      ADR-07
      ADR-11
      ADR-12
      API-07
      INT-04
      LOYALTY/NFR-03
      LOYALTY/NFR-04
      LOYALTY/NFR-05
      LOYALTY/UC-01
      OI-39
      OI-40
      OI-41
      ... 13 more
    ids only in new (4):
      ADR-04
      PSDD/INT-03
      PSDD/INT-06
      REFUNDS/UC-03
    tokens only in base (3):
      payout.resolution.confirm
      payout.resolution.record
      refund.receipt.read
    tokens only in new (2):
      platform.event-publication.redeliver
      refund-request.approved-refund.read
  decision-log.md
    headings only in base (1):
      ## Business review register
    headings only in new (1):
      ## Pre-SDD record
    ids only in base (38):
      ADR-06
      ADR-07
      ADR-08
      ADR-09
      ADR-12
      API-01
      API-02
      API-04
      API-05
      API-07
      API-08
      INT-01
      ... 26 more
    ids only in new (5):
      ADR-04
      ADR-10
      API-09
      R-03
      R-08
    tokens only in new (2):
      platform.event-publication.redeliver
      refund-request.approved-refund.read
  refunds-platform-sdd-master.md
    headings only in new (1):
      ## Architecture Deck Brief (gated, on request)
    tables only in new (1):
      Section | Chunk
    ids only in base (20):
      ADR-07
      API-02
      API-03
      API-04
      API-09
      BR-10
      LOYALTY/NFR-04
      LOYALTY/UC-01
      OI-01
      OI-26
      OI-28
      OI-47
      ... 8 more
    ids only in new (10):
      ADR-05
      API-06
      INT-02
      OI-23
      OI-24
      OI-36
      OI-37
      OI-38
      PSDD/INT-03
      PSDD/INT-06
  totals (base -> new): bytes 676617 -> 579165, clarification 88 -> 83, confirm 0 -> 0, em_dash 0 -> 0, links 936 -> 1605, mermaid 17 -> 32, todo 0 -> 0
(exit 0)
```

## Problem-class comparison with FC

| Class | New SDD | FC SDD | Note |
|---|---|---|---|
| check_sdd problems | 0 | 0 | 31 citation-hygiene problems before the final fix (unkeyed or unlinked BRD IDs in chunk 18 reviewer text, decision log, master; 5 false "event" hits on payout state names in a §17.2 table); fixed editorially before the final run |
| Markers (check_sdd total) | 83 | 88 | Similar backlog size; the new SDD adds about 15 markers for open Pre-SDD entries and 12 product-owner approval markers (AGENTS.md), and has fewer BRD-question markers in chunk 12 roles |
| check_uc_keys / check_uc_links | 0 / 0 broken | 0 / 0 broken | New: 937 resolved BRD links, 537 internal anchors; FC: 545, 236 |
| check_e2e | 0 problems; E1 5 open, E2 met, E3 17, E4 met | 0 problems; E1 met, E2 met, E3 23, E4 met | The new SDD's gate also waits on the E2E Architect (OI-23, OI-24), the product owner (OI-27) and two pending items; FC's only on E3 |
| check_versions | 0 | 0 | New: initial build v1.0; FC v1.4 |
| check_mermaid | 32 blocks, 0 issues | 17 blocks, 0 issues | New adds the §8.6/§8.7 diagrams (chunk 05a) and more sequences |
| _linkcheck | 1605 links, 475 Pre-SDD refs, 0 bad | 936 links, 0 Pre-SDD refs, 0 bad | Pre-SDD links are new |
| diff_runs | BRDs byte-equal to FC; SDD 676,617 -> 579,165 bytes, markers 88 -> 83, links 936 -> 1605, mermaid 17 -> 32; new 05a chunk and Source Pre-SDD table; notification chunk renamed (13c-service-notification) | - | Same four-module decomposition and modular-monolith style as FC; IDs (ADR, API, INT) differ by design |

## Skill problems found (5)

1. **The lock list gives values without saying what each row measures, so the SDD cannot apply several locked items from chunk 12 alone** (worst). Chunk 12 § 12.2 (`pre-sdd-refunds-platform/12-sdd-handoff-guide.md:36-97`, the engine fragment `12-locked-items.md`) lists `ID | Value | Status | Lands in`, e.g. `REL-03.1 | 14,400 s`, `REL-04.1 | 900 s`, `DAT-04.1 | yes`, `INT-08.1 | public`, and 15 rows `TBD`, with no row title; `sdd-unifier/SKILL.md:159` (step 2a item 2) forbids reading the register rows that hold the titles. What happened: §8.6.4 needs RTO and RPO per scope, and nothing in chunk 12, the gate line, or chunk 11 says which of REL-03 and REL-04 is the RTO; I took REL-03 as RTO and REL-04 as RPO from the prose of the fixture's own `run-notes.md` ("REL-03.1 (14,400 s for a region loss)") and the plausibility of the pairs, a source outside what the skill allows. DAT-04.1 `yes` became a residency marker asking for the area; each `TBD` row became a generic marker ("Which value does the Pre-SDD set for PSDD/SEC-06.1 ...") because its question is unknown. An SDD could swap RPO and RTO in its home table with every checker passing.
2. **§18 is told to cite `PSDD/CALC-NN` values that the SDD may not read.** `sdd-unifier/brd-to-sdd.md:190`, `sdd-unifier/chunks/14-performance-and-capacity.md:12`, `sdd-unifier/architecture-questionnaire.md:93`, and chunk 12 § 12.3 (§18 row, line 142) say §18 cites the CALC values of the Pre-SDD's chunk 04; chunk 12 lists no CALC row, and `SKILL.md:159` forbids reading chunk 04. What happened: the author cited the CAP/DAT entries instead; the reviewer (who read chunk 04 while checking links) raised OI-18 with the values; the policy accepted it and the author pasted values it cannot verify; `check_presdd.py` then flagged the CALC-11 citation (its value was not in the Recommended Answer), which was dropped, so OI-18 is `Adjusted - applied`.
3. **Open lock-list entries have no owner the SDD may read.** `sdd-unifier/brd-to-sdd.md:196` says the marker for a `TBD`/`Open` entry "names its Pre-SDD owner"; chunk 12 gives owners only for conditions, exceptions, and unknowns (§ 12.5), and § 12.2 line 125 says the owner "stands" in the register row, which `SKILL.md:159` puts out of reach. What happened: 14 markers name "E2E Architect (pre-sdd-unifier)" as the routing owner instead of the entry's owner.
4. **The citation rule has no link target for header rows.** Chunk 12 § 12.7 (lines 200-206) gives link targets for register rows, calculations, conditions, unknowns, ADRs, and decision rules, but HDR-07.1 and HDR-08.1 (classification rows with no register heading) have none. What happened: I linked them to `02-classification-and-path.md#21-classification`, a heading of a chunk the SDD does not read, chosen from the heading list only.
5. **Q7 under an open isolation level has no rule.** `sdd-unifier/architecture-questionnaire.md:94` and `SKILL.md:205` (step 3b item 6) say Q7 offers only the options DAT-07 allows; with DAT-07.1 `TBD` no option is allowed, and neither file says what Accept all records for Q7 or whether the walkthrough is then recommended (chunk 12 § 12.3 line 135 says only "Q7 waits for its owner"). What happened: Accept all with Q7 recorded open, ADR-05 `Proposed` with a marker, §11.2 marker; the minimum ADR set's multi-tenancy decision stays open.

## Runner notes and deviations (not skill problems)

- **Application passes continued, not fresh.** `SKILL.md:329` says each scoped pass is "a fresh dispatch of the step 7 reviewer, never an earlier pass continued"; the brief approved one dispatch continued with SendMessage, which I followed. The OI-19 re-dispatch was also a SendMessage continuation.
- **The reviewer read the Pre-SDD's chunk 04.** My brief allowed it "link targets if you need to verify that a PSDD link resolves"; it used chunk 04's CALC values for OI-08, OI-18, OI-23, OI-24. That is what surfaced problem 2.
- **OI-28 and OI-29 were my build-order fault.** I appended OI-25 and OI-26 and edited the sources, but the first application pass started before I regenerated the chunks, so it found their markers missing. After the rebuild the markers were present; both items closed as applied. Its out-of-scope note on the Changes Log and the Clarification register had the same cause and is marked `Resolved in v1.0`.
- **Final editorial fixes after the checkers:** keys and links added to BRD IDs in chunk 18 (reviewer text), the decision log, and the master; backticks removed from the state names of the §17.2 "Results in other states" table, which `check_sdd.py` read as event names. The latter changed chunk 13b bytes, so step 6a and the content hash were rerun and Reconciled entry 2 carries the new hash.
- **OI-27 is an author item for the AGENTS.md conflict** (new dependency approval versus REFUNDS 12 TI-01 and TI-02); its Recommended Answer keeps the BRD-mandated rows, which the policy may not take, so it waits for the product owner.
- **Policy choices without a source** (listed for the owner): OI-11 (a receipt lookup expires after 30 minutes for the customer), OI-13 (10 receipt lookups per 10 minutes per customer).
- The fixture owner label `Product Owner (fixture owner)` appears only where the Pre-SDD itself names EXC-01's owner; no real person's name is written.
- No git command was run; no browser tool was used; the Pre-SDD, the BRDs, `_snapshots/`, `standins/`, and `AGENTS.md` are unchanged (no file there is newer than `run-notes.md`).

## Files written (all inside RUN)

`sdd-refunds-platform/` (00 to 18 with 05a and 13a to 13d, `refunds-platform-sdd-master.md`, `decision-log.md`), `unifier-status.md` (own row, HR-003 state, HR-004, HR-005), `run-notes-sdd.md`, `run-transcript-sdd.md`.
