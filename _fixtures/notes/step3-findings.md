# Step 3 findings log (for the step 3 report and step 6)

Branch: test/known-gap-scenarios (from main 057f137, local merge of test/chain-rerun, not pushed).
Scratchpad: s3a (pre-BRD to BRD), s3b (heading map), s3c (SDD version tracking), s3d (modular monolith). Tools in tools/.

## Setup deviations (tell the user)
- Each scenario runs as two sequential agents (stage 2 is a fresh session).
- 3b: fixture brd-refunds-portal has no links between merged chunks (only to 14-todo). Planted 10 links in the s3b copy (15: 14-todo, 06a, 06b whole-chunk, 02 anchor, 16 whole-chunk, 4 UC anchors; 16: 15 whole-chunk). Pristine planted copy: s3b/original. First merge agent stopped before writing anything, relaunched.
- 3c: LOYALTY v1.1 by hand: UC-02 BR-3 (partial refund takes back 1 point per full 1 EUR refunded), AC-2 (80.00 EUR, 80 points, refund 30.50 EUR, -30 points); 00 version/date/Changes Log row; master and 06a header VERSION 1.1; 14-todo BRD version 1.1.

## 3b merge stage (agent report, 15 min)
- Output BRD-RefundsPortal-v1.0-MERGED.md: 17 chunks merged (00-13, 15, 16), 14 skipped (MERGE: Excluded); 9 links rewritten to same-file anchors; 14-todo links kept as file links. Whole-chunk 06a link -> #use-cases---customer (the replaced title), 16 -> #refunds-portal---uatbat-test-cases, 15 -> #implementation-plan. My checks: 103 links, 0 bad; 0 Mermaid blocks.
- Agent error: claimed every source file is CRLF; verified false (0 of 19 contain CR).
- Skill ambiguities it reported (verify in step 6):
  - M1 06x chunks without a structure list (fixture predates); merge took the list from TEMPLATE-COMBINED.md. Heading map does not say where it comes from.
  - M2 modes.md Chunks->Combined step 6 "Regenerate the Figures and Tables indices" (unconditional) vs chunking.md Merge step 5 "if they exist".
  - M3 15/16 without a MERGE: key (fixture predates); rule only names Excluded.
  - M4 `---` separators: chunking.md "no extra --- unless the template calls for one" vs modes.md "single blank line". Agent added 16 `---` (TEMPLATE-COMBINED has one before every H1).
  - M5 ToC regeneration: no format, depth, or rule for a cover without a ToC; whether 14-todo is listed.
  - M6 whole-chunk link text names a file but now points at a section (cosmetic); plain-text chunk references ("chunk 11") untouched.
  - M7 transform-detection classifies a merge as TRANSFORM, which literally pulls in sow-transformation sanity checks (Changes Log row) vs "a merge is not a content change". Which workflow steps a pure conversion runs is not stated.
  - M8 SKILL.md principle 16 "project root" undefined relative to a BRD folder.
  - M9 merge does not re-check the delivery gate when 15/16 exist (fixture: G5 would fail, flowcharts skipped).
- Fixture staleness it saw: cover lacks ToC and indexes; 01 heading lacks "/ Problem Statement"; 13 lacks "How to read" and the Reviewer Notes coverage record; 15/16 lack skeleton parts.

## 3b re-chunk stage (agent report, 19 min) - PASS
- cmp_rechunk (s3b/cmp-report.txt) vs s3b/original: heading outline identical in every chunk except 00 (ToC added); links identical in every chunk (all 10 planted links back as file links, whole-chunk ones as ./X.md); 06a/06b titles and chunk 16 project-name title restored; 14-todo identical; no body line lost. Differences: header comments rebuilt from skeletons (TITLE and DEPENDS_ON values differ, extra keys, 15 VERSION loses "(baselined against BRD v1.0)"), 06a/06b gain the template structure list (the fixture never had one), 00 gains the merge-built ToC (56 links), master regenerated from the skeleton. _linkcheck: 175 links, 0 bad.
- Skill ambiguities reported:
  - R1 (main) chunking.md § When to deviate rule 4: a BRD with <= 6 use cases and 1-2 personas collapses 05 and 06* into 05-user-journeys-and-use-cases.md "on an explicit conversion (SKILL.md step 10)", vs Re-chunk step 2 and modes.md "one 06* chunk per persona". Collapsing would break stable file links (14-todo links 06a/06b, chunk 13 text "06b"). Agent kept 06a/06b. DESIGN.
  - R2 ToC on re-chunk unspecified (merge rebuilds it; re-chunk silent); with M5, a merge creates a ToC the original never had, so the round trip adds it.
  - R3 reversing a whole-chunk anchor: #first-heading -> ./X.md or ./X.md#anchor unspecified (agent chose ./X.md; the 06* group anchors no longer exist after re-chunk, which forces ./X.md there).
  - R4 header keys: full skeleton header or only the § Chunk header keys; merge strips headers, so header values (TITLE, DEPENDS_ON, VERSION notes) cannot round-trip.
  - R5 `---` at chunk boundaries: merge adds them (M4), re-chunk silent (agent dropped them, correct for the round trip).
  - R6 = M2 (Figures/Tables index: Skip rules say empty skeleton, merge says "if they exist").
  - R7 = M7 (Changes Log row for a TRANSFORM vs layout change bumps nothing).
  - R8 re-chunk step 7 assumes a COMBINED-mode source whose to-do links point at ../BRD-*.md; a -MERGED.md inside the folder is not covered.
  - R9 chunks/brd-master.md hard-codes a decision-log.md link "once it exists"; unclear whether its instruction comments stay in a generated master.
  - R10 whether re-chunk must check the G1-G5 gate before producing 15/16 from the combined sections.
- Fixture staleness seen: G5 fails against the files (no 05 use-case diagram, flowcharts "Skip - fixture"), SCR-01/02 not MK-NN, decision-log.md missing though OI-01 decided, 15/16 old format.

## 3a pre-BRD stage (agent report, 84 min)
- 25 files (00-24); 27 markers in 01-23 (+8 marker strings in 24: 1 skeleton text, 7 inside Recommended Answers); 16 OIs all Open; 39 assumptions; 131 source URLs in 06-11; investor No-Go 2.85/10 (venture), scoreboard 2.31/5 No-Go. 0 em dashes (verified). Research: 6 parallel general-purpose agents; investor startup-analyst; reviewer general-purpose. Total marker strings 35 (verified).
- Agent stray writes, both cleaned: /tmp/urls_all.txt; `.playwright-mcp/` created in the skills repo by a research agent's browser tool (deleted; git status clean, verified). Consider a .gitignore entry for .playwright-mcp/.
- Skill ambiguities reported (pre-brd-unifier):
  - P1 chunks/23 intro says the investor writes after the reviewer pass, vs SKILL.md steps 5-6 (investor first) and chunk 24 PURPOSE. Contradiction.
  - P2 frameworks.md Tier-5: no mapping from SAM/SOM (currency) to a 1-5 score, Porter 1-3 to inverted 1-5, "EFAS net + IFAS net" undefined ("net"; chunk 22 calls it "EFAS + IFAS blended (VRIO context)"); decimals allowed?
  - P3 EFAS vs IFAS rating meanings differ (strength/likelihood vs performance); EFAS total sums opportunities and threats.
  - P4 chunks/07 TAM "globally" vs regional segment TAM in sections 1-3 and frameworks.md; average(top-down, bottom-up) with no rule for a 16x divergence; SOM value vs SOM % for plans.
  - P5 modes.md comment block (PROJECT:, PART OF: PRE-BRD - [Project Name]) vs skeletons (PART OF: PRE-BRD Master, no PROJECT).
  - P6 "regenerate 00-pre-brd-master.md as the index", but chunks/00 has no answer slots.
  - P7 step 7 source count: no sources slot in any chunk; how to present and count sources undefined.
  - P8 research-orchestration.md canonical-figures note in 07 vs fill contract (Answer cells only); 07 Notes/source column mixes guidance and source slots.
  - P9 chunks/06 hint "same product names as in section 1": where?
  - P10 IFAS gets a web-research agent, but internal facts cannot be web-researched.
  - P11 principle 8 names no home chunk for each shared fact (revenue levers 01 vs 03, channels 03/19/21, vision 02 vs 19); templates ask for the same element in several chunks.
  - P12 chunks/23 "Conditions that would move a Conditional Go to a Go" has no No-Go wording.
  - P13 EFAS/IFAS rows: Markdown may grow, Excel fixed at 5 and 4 rows; author within Excel capacity?
  - P14 chunks/16 BCG: no fallback when shares do not exist (used clinic-count proxies + marker).

## 3a BRD stage (agent report, 211 min) - PASS with two defects
- BRD v1.1 Draft: 3 personas, 19 UCs (06a owner, 06b receptionist, 06c patient), 52 OIs accepted (30 reviewer + 22 from consistency runs), to-do steps 1-2 In progress, gate shut, 15-17 not written. 0 em dashes; _linkcheck 303 links, 0 bad; check_mermaid 3 blocks, 0 issues; links into the pre-BRD 0 broken.
- Mapping (sow-transformation.md § pre-BRD) followed: 01/02/15 -> 01 (OKR key results became BO-01..16 with measures); 03-05 -> personas and journeys; 06-12 -> 01 market paragraph + links, PESTLE legal -> 02 constraints and NFR-05/06/08; 14 MoSCoW -> 04 scope (Must MVP, Should "paid launch") and 12 wishlist; 16-19 context only; 21 -> scope split; 22/23 -> verdict linked; 24 -> 02 assumptions and markers; technical statements verbatim to 12 Technical Inputs. prebrd_carry: market figures not copied except OKR measures (legit) and verbatim technical quotes with cost figures in 12 (borderline).
- Markers: pre-BRD 27 in 01-23 + 16 OIs. 14 requirement-relevant ones kept as markers (legal x4, product owner, appointment volume, incorporation, pilot clinics, validation gate, timed slots, pilot design, waitlist, report scope, sender model), each with a TD row; market and team ones left in the pre-BRD by design; 4 became text without a marker (baseline rate, WhatsApp share -> Assumption 2 "most patients use WhatsApp", competitors bundling, DPO staffing). Before review 88 BRD markers, final 143 (accepted answers add proposal markers). None filled with invented values.
- DEFECT 1 (skill conflict): before review chunk 01 cited the verdict word ("returns **No-Go** as scoped" + links to 22/23), as sow-transformation.md requires; reviewer OI-03 (Type Duplication) recommended dropping the verdict word, accepted, so the final BRD no longer names the verdict. The reviewer brief does not know the verdict-citation rule.
- DEFECT 2 (miss): pre-BRD OI-10 flags the planning price per clinic; BO-11 keeps "EGP 26,000 (40 clinics x EGP 650)" without a marker (agent acknowledged).
- Skill ambiguities reported:
  - A1 consistency check (to-do step 2) did not converge in one session: runs 1-5 found 23, 9, 8, 7, 5; Run 6 due. delivery-chunks.md says run 1 at generation and rerun after decisions; with accept-all and check-raised OIs it loops; no stop rule. Run took 3.5 h. DESIGN.
  - A2 check-raised OIs (delivery-chunks.md § Special cases) are walked through with the user (covered by accept-all here).
  - A3 direct corrections outside the narrow mechanical list (CF-03, 04, 14, 25, 26, 33, 34, 47) citing an accepted item as confirmation.
  - A4 = DEFECT 1.
  - A5 MoSCoW Should items: "Must and Should in scope" vs "later roadmap phases to the wishlist".
  - A6 mermaid-diagrams.md "quote every edge label" vs stateDiagram-v2 transition labels that cannot be quoted.
  - A7 version rules: step 8 vs parts-mode § progress record vs delivery-chunks "one minor step per run"; master VERSIONING "all chunks share one version" vs bump only changed chunks (same class as SDD C2/D3).
  - A8 "one row per distinct question" (step 1): 74 proposal markers grouped into 17 rows.
  - A9 accepted OI-44 makes acceptance criteria repeat a flow's marker: inflated counts.
  - A10 sow-transformation.md covers pre-BRD chunk 24 open items, not inline markers in chunks 01-23.
  - A11 (test artifact) snapshot's 00 already lists chunk 13.
  - A12 verbatim Technical Input containing a relative link that breaks when moved.
  - A13 no author in the source (used "Clinic Reminders founding team").
  - A14 decision-log.md "create on first use" vs created at intake for Q-01/Q-02.

## 3d SDD stage (agent report, 84 min) - meets the fixture requirements
- §13: refund, payout, notification, loyalty, all Type module; ADR-01 Accepted modular monolith (one deployable, Kubernetes, one Helm chart). §15.2: API-01 `PayoutPort.requestPayout` Internal (in-process) Defined; API-02..04 external TBD. §14.10: six in-process events (RefundSubmitted, RefundCancelled, RefundRejected, RefundPaid, PayoutSucceeded, PayoutFailed); no broker, no integration events. Gate Locked on E3 (31 markers in 10, 13a-13d). SDD version 1.1 (agent bumped every file after the acceptance loop; step 2 run kept 1.0: inconsistent behaviour from the same ambiguity, step 2 #4).
- My checks: check_uc_keys 0; check_uc_links ok; check_mermaid 21 blocks, 0 issues; 0 em dashes; markers 143. check_sdd 30: unkeyed "UC-01 row" etc. in 12 §16 capability rows (genuine), "feeds UC-02" in 13a (genuine), ranges "REFUNDS/UC-01 to UC-04" and "REFUNDS/NFR-01 to NFR-04" (step 2 #2), TI-01/TI-02 unkeyed in 02, ADR-06, master (fixture TI IDs; check what format the skill wants), decision-log and master unkeyed/unlinked (step 2 #1 class), "API-05 not in §15.2" is a checker false positive (an ID in a rejected option of chunk 18).
- Skill ambiguities reported:
  - D1 step 3a Project Type has no recommended answer (step 2 #4 item, repeated).
  - D2 questionnaire "First production release" profile gives two Q4 answers (monolith or hybrid) and two Q8 answers with no tie-break; "recommend the simpler one" covers style only.
  - D3 version bump after the acceptance loop: step 8.3 vs parts-mode § progress record vs sdd-master VERSIONING (step 2 #4; this run bumped to 1.1, step 2 kept 1.0).
  - D4 chunking.md deviation rule 6 and chunks/10: no rule for §14.1-§14.9 when the only events are in-process; chunk 19/§24 "Distinct published events" counts the §14.9 matrix (reads 0 with six in-process events).
  - D5 chunks/11 §15.3 in-process block: no field for transaction participation or idempotency.
  - D6 chunks/10 §14.10 "Transaction phase (before/after commit)" cannot express a durable publication (persisted before commit, delivered after).
  - D7 §7.3 Events column reads only the firing step; a consuming use case shows "-" (step 2 #4 item, repeated).
  - D8 principle 17 "every cited UC is a link" vs §7.3 Status cell plain "Merged into KEY/UC-NN".
  - D9 brd-to-sdd.md § SDD-only sections: API style and authorization get markers, vs CLAUDE.md REST/OpenAPI (step 2 #4 ADR-04/ADR-08 item, repeated); §6 flag rows with no CLAUDE.md default vs step 3c recommendation.
  - D10 (major for step 4) the reviewer captures external findings only and inline markers stay, but accepted answers add new inline markers in 09-13x and the loop never clears markers, so a first derive-from-BRD run can practically never open the gate (E3).
  - D11 decision-log.md: accept-all ecosystem needs no record vs canonical structure always has the section.
  - D12 mermaid-diagrams.md § Syntax quick reference points to ../lld-unifier/mermaid-diagrams.md, outside the skill folder (breaks a standalone upload).
  - D13 13a template: no "Not applicable" wording for Published/Consumed events of a module with only in-process events; module chunks keep the 13a-service-[slug].md prefix.
  - Template deviations it made: OI-22 accepted answer replaced the 13b Error Handling template bullets; added a Behaviour table to API-01, an NFR-to-target table before §18.1; §14.9.1 repurposed as "Integration event contracts - Not applicable".

## 3d LLD stage (agent report, 80 min) - PASS
- 04-implementation: loyalty.md, notification.md, payout.md, refund.md (one per module). 06 §9.6: API-01 PayoutPort.requestPayout (DTOs, errors, token, adapter, no URI). 07 §10.6: all six §14.10 events; 07 §10.1-10.5 "Not applicable - no broker". 09 §12.3: "in-process port calls take no timeout, retry, circuit breaker, or bulkhead"; Resilience4j only on POS, CardPay, MsgHub adapters. Outbox only as dispatch tables for provider writes (SDD ADR-09), cited with the CLAUDE.md Kafka outbox rule; 10-operations says "no outbox table" while payout/notification say "Outbox pattern applied (dispatch table)": small internal inconsistency.
- SDD written by the LLD stage: only the Child LLDs row (None yet -> "Refunds Platform | refund, payout, notification, loyalty | from-sdd | 1.0 | 1.1"). Lineage clean: no "Angular web app" this time (step 2 brief had named the frontend in scope; the skill's §2.1 In Scope wording can still produce it).
- Checkers: check_links 271/0; _linkcheck 271/0; check_lld_trace broken 0, unkeyed 0, lineage 0, unknown 1 = REFUNDS/UC-010 again (09 §12.8 template example; step 2 #8 reproduced, so it is the template); check_mermaid 40/0; 0 em dashes; flags TODO 43, Confirm 46 (agent: 43/46).
- check_trace crashed on module file names (hard-coded refund-service.md, loyalty-service.md at line 190). FIXED in _fixtures/checkers/check_trace.py: owner files from the §7.3 Active owners. Verified: run-new 10, run-2026-09-30 5, s3c 5 (unchanged); s3d 0; planted wrong UC in refund.md -> 2 problems. Note for step 6: the per-entry-point @UseCase check is file-level only (the table-row regex at line ~192 matches neither run's format, so it is dead code).
- Skill ambiguities reported:
  - E1 TODO flag format `> TODO: <best-guess> [em dash] verify` contains an em dash in SKILL.md principle 8, confidence-rules.md, sdd-to-lld.md (part of the 83 copy-verbatim em dash lines); chunks/lld-master.md uses " - verify".
  - E2 = step 2 #10 (screen-ID-keyed mockup rows: link target).
  - E3 = step 2 #10 ("Direct lift" vs one fact, one home), reproduced.
  - E4 outbox in a modular monolith: pattern-rules.md § Outbox, lld-quality.md, chunks/09 §12.4 assume a broker; no rule for provider-write dispatch tables or for durable in-process event publication logs.
  - E5 §7.8 requires a sequence diagram per workflow vs mermaid-diagrams.md § When NOT to draw (plain reads).
  - E6 = step 2 #10 (Screens field "each route that starts the use case" vs § Checks 2), reproduced.
  - E7 modules with no REST surface: §7.2 Controllers and "Participates in" give no guidance; § Upstream gaps has no row for a §7.3 with REST entry points only (listeners and jobs get no @UseCase; step 2 #10, reproduced).
  - E8 = step 2 #10 (§12.7 tenantId on every log line vs CLAUDE.md; field names vs SDD §11.4), reproduced.
  - E9 chunks/06 §9.1 and chunks/09 §12.2 state "TTL 24h" as fact.
  - E10 chunks/15 §18.5 has no rows for §6 or Specs flags; "High-confidence rows" undefined.
  - E11 7.N numbering is alphabetical in the LLD (refund = 7.4) but SDD §17.1: confusing, no rule.
  - E12 templates embed boilerplate flags (11 PII/compliance Confirms, 12 SLO Confirm, 10 dashboard TODO, 11 threat-model TODO) that inflate the counts.
  - Also: step 6b version pins (step 2 #10, reproduced: Spring Modulith and Keycloak pins left as TODO).

## 3c SDD stage (agent report, 21 min) - PASS on the scenario's SDD expectations
- SDD 1.0 -> 1.1; LOYALTY register row 1.0 -> 1.1; Changes Log row 1.1; Child LLDs SDD version cell "1.0 (out of date: SDD is now v1.1; refresh through lld-unifier)" (exact). 8 files changed: 00, 01, 03 (§7.3 group row version), 05, 13d, 17, master, decision-log. 09-12 unchanged (RefundPaid already carries paidAmount). Chunk 19 absent, gate Locked (E3: markers in 10, 12, 13a-13d). New cross-BRD conflict found: "partial refund" means two things (REFUNDS amount vs LOYALTY purchase) -> two §5 rows + marker.
- My checks: diff_runs vs run-2026-09-30: only the SDD and the LOYALTY BRD differ, LLD byte-identical; 0 em dashes; links 438 -> 444. check_uc_keys 0, check_mermaid same 4 over-30-line blocks (13d ERD now 42 lines). check_lld_trace: lineage accepts the out-of-date note; remaining lineage problem is the old "Angular web app" scope (step 2 #7); unknown ID REFUNDS/UC-010 (step 2 #8). check_sdd 37 -> 44: the 7 new are unlinked keyed UC IDs in the new Changes Log row (00) and new decision-log entries: the main agent, not only the reviewer, leaves IDs unlinked in 00 and decision-log (extends step 2 #1: decide whether 00 Changes Log and decision-log must link, or the checker exempts them).
- Agent error again: claimed the SDD is CRLF; verified 0 of 24 files contain CR.
- Skill ambiguities reported:
  - C1 "mark chunk 19 Stale" unconditional in brd-to-sdd.md § Changes after the SDD exists and the SKILL.md step 10 row, vs "Stale if it exists" in step 8b item 2 and other step 10 rows.
  - C2 chunks/sdd-master.md VERSIONING comment: "All chunks share the SDD version number" vs "bump the SDD version in this master and in the updated chunk(s)". Agent bumped only changed chunks.
  - C3 SKILL.md step 10 says reconcile the new BRD version against the other BRDs; the brd-to-sdd.md "new version" row does not mention reconciliation.
  - C4 Glossary row per meaning (cross-BRD reconciliation) vs reference-not-restate for business terms.
  - C5 decision-log.md canonical structure has no section for a BRD-version update ("Part N clarification register" assumes parts).
  - C6 which handoff a targeted update gives (step 9 defines the full one only).
  - C7 Child LLDs rule 2: "each scope service is a row in §13", but a marker is prescribed only for merged or removed services; "Angular web app" left unflagged (ties to step 2 #7).

## 3c LLD stage (agent report, 25 min) - PASS
- Step 3c found recorded SDD 1.0 vs current 1.1, read the 1.1 Changes Log row, named SDD chunks 00, 01, 03, 05, 13d, 17, and showed the offer (yes/no, recommended yes). Accepted.
- Changed (hash diff vs s3c-after-sdd): LLD 00, 01, 04/loyalty-service, 05, 08, 10, 13, 15, 16, 17, 18, master; SDD 00 only this LLD's row (1.0 + note -> 1.1 / 1.1). Unchanged: 02, 03, 06, 07, 09, 11, 12, 14, other 3 service files. All changes map from the changed SDD chunks (13x -> 04, 05, 08, 10; 01 -> 01, 17 Mission; 00/03/17 -> 16 §19.1, §19.9) plus bookkeeping (00, master, 15 index, 18 statuses); 13 testing from the new LOYALTY AC-2.
- Checkers on s3c final: check_lld_trace lineage 1 (old Angular scope), unknown 1 (old REFUNDS/UC-010), unkeyed 0; check_links 387/0; _linkcheck 387/0; check_trace 5 (old: 4 routes without route data, report route); check_mermaid 42/0; check_sdd 44 (7 from the SDD stage).
- Skill ambiguities reported:
  - L1 SKILL.md step 7 reviewer "mandatory before presenting" vs the step 9 "new SDD version" row (no review listed); no rule for re-reviewing an existing chunk 18 with stable OI IDs. Refresh shipped without review.
  - L2 Specs on a refresh: § Field mapping table has no Specs row; SDD §1 -> Mission lives in § Specs ownership & synthesis; step 6b on a refresh unspecified.
  - L3 a new BRD version behind the SDD bump fires two triggers ("A new BRD version", "A new SDD version"); step 3c defines an offer only for the SDD one.
  - L4 "Changes Log rows since the recorded version" is ambiguous when a version label repeats (the SDD has two 1.0 rows; ties to step 2 #4 parts-mode vs step 8.3 bump).
  - L5 no rule for reviewer OIs settled by an upstream change (author marked LLD OI-09, OI-10 Resolved in chunk 18).
  - L6 chunks/15 § 18.5 confidence summary unit (tables, blocks, diagrams) vs existing per-section counts.
  - L7 sdd-to-lld.md § Upstream gaps covers NEEDS CLARIFICATION only in §7.3 cells; an SDD §5 term marker that affects implementation has no rule (carried as Confirm).
  - L8 = step 2 #10 (link target of a mockup row keyed by a screen ID).
  - L9 chunking.md § Targeted regeneration has no "new SDD version" bullet (SKILL.md step 9 and sdd-to-lld.md do).
  - L10 (agent) the offer omitted 10-operations, which the refresh then changed (10 is mapped from 13x, so in scope; the offer should list every mapped chunk).
- Setup artifacts the agent flagged (mine, not skill issues): LOYALTY 14-todo header VERSION 1.0 with body "BRD version: 1.1"; LP-02 mockup row lists BR-1, BR-2, not BR-3.
