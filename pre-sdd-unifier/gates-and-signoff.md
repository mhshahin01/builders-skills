# Gates and sign-off

The Pre-SDD passes the Standard's four gates in order: G0 Initiate, G1 Discover, G2 Assess, and G3 Approve (Standard § 11). G1 and G2 end in review stops, and G3 is the sign-off stop. G3 approval is the permission to start the SDD. It is not a guarantee that the design will meet its targets (Standard § 11).

The engine computes every gate (`gateStatus` in `studio/src/engine.js`): `derive` prints the gate result after every patch. `compute` writes it to `model.json` and to the gate fragment (`engine-and-studio.md`). Read every gate from that output, never from memory, and never decide a gate by hand. This file says what each gate needs and which decision rules block it. It also says how the G3 checklist and the sign-off register work, and what a change after G3 does.

Read this file at step 8 (the G1 review stop), step 9 (the G2 review stop), and step 13 (the G3 sign-off stop).

---

## The gates at a glance

| Gate | The Standard's exit | What the engine checks | Stop |
|---|---|---|---|
| G0 Initiate | Sponsor, business problem, measurable outcome, scope, and lead architect identified | No entry of HDR-02 (business sponsor), HDR-04 (lead architect), BUS-01 (outcome and KPI), or BUS-03 (scope) is `Open` | None: stage 2 opens with the header rows that G0 needs |
| G1 Discover | Universal checklist reviewed, source estate inventoried if brownfield, evidence identified, critical unknowns visible | G0 is met; every applicable entry has a valid status; every `Open` entry has an owner name and a due date (`YYYY-MM-DD`) | G1 review stop (step 8) |
| G2 Assess | Hard constraints, critical NFRs, placements, feasibility, operational and cost constraints, and migration risks evaluated: a feasible option shortlist, or a blocker | `blocker` when validation holds any blocker; otherwise `shortlist` when G0 and G1 are met, no failure scope is `unresolved`, at least one option passes every hard check, and (with the overlay) every workload holds a 7R; otherwise `incomplete` | G2 review stop (step 9) |
| G3 Approve | Business approves critical targets and trade-offs; security and data reviews complete; options and ADR candidates documented; risks accepted or closed | The G3 status, below | G3 sign-off stop (step 13) |

**The gates are cumulative.** A gate is met only when every gate before it is met. The engine opens a later gate's `missing` list with the earlier gate that is not met (except a G2 `blocker`, which lists the blocker IDs). G3 cannot reach an approved status until G2 reads `shortlist`. The Standard's gates run in order, and an SDD never starts without a feasible option.

**Applicable entries.** Every register entry counts, except the OVL entries while the migration overlay does not apply (`migration-overlay.md`). While the overlay applies, G1 counts every OVL entry of every workload, so stage 2 asks for their owners and due dates.

**G0 counts `Estimated`.** G0 needs its four rows answered, not confirmed: an `Estimated` sponsor from the BRD meets it. Confirmation comes in stage 4, and G3's critical-entry check needs it only for the critical rows.

---

## G3 status

The engine gives G3 one status. The first that applies wins, in this order:

| Status | When | What to do |
|---|---|---|
| `Blocked` | Any one of these: validation holds a blocker; a sign-off on an applicable role says `Rejected` (a stand-in's rejection too); a condition has no owner or no valid due date; a counted sign-off says `Approved with conditions` while no condition is recorded | Fix the blocker, or have a named person grant a time-bound exception where one can lift it (§ Exceptions). Talk to the signer who rejected. Record each condition with its owner and due date. |
| `Review` | A sign-off record, or a not-applicable mark, was given on other content (its stored content hash differs from the state's), or before G3 was last reopened | Every role named signs again after the review (§ Change after G3). |
| `Not signed` | Any one of these: an applicable role has no counted sign-off; a checklist line is neither `Done` nor `N/A` with a reason; an earlier gate is not met; a critical entry is not confirmed (§ Critical entries) | Work through the problems the engine lists. |
| `Approved with conditions` | Everything above passes, and at least one condition is recorded (a counted decision of `Approved with conditions` reads this status only once a condition exists) | The SDD may start. The handoff guide carries every condition. |
| `Approved` | Everything above passes, with no condition | The SDD may start. |

The G3 result also lists `missingRoles` (the role keys still to sign, in register order) and `problems`: every reason the engine found, not only the one behind the status. Show the person all of them.

**The label and authorization.** The engine's gate label is what chunk 00, chunk 11, chunk 12, and the master's gate line show. The first that applies wins, in this order:

- `Discovery` in quick mode, always (a quick Pre-SDD claims no gate);
- `Draft` while G0 is not met, even when G3 is already `Blocked` (the default hard rows start `Open`). So a new Pre-SDD reads `Draft` until G0 is met. The blueprint's `gate_status` reads `draft` while G0 is not met (in quick mode too, where the label stays `Discovery`);
- `Blocked` when G3 is `Blocked`;
- `G3 Approved` or `G3 Approved with conditions`;
- else the highest gate met: `G2`, `G1`, or `G0`.

The Pre-SDD is authorized for the SDD only when G3 reads `Approved` or `Approved with conditions`, and never in quick mode. The engine still computes G0 to G3 in quick mode, for display.

---

## Decision rules DT-01 to DT-15

The Standard's decision rules apply with their STOP and BLOCK outcomes (Standard § 9.3). The engine checks five of them: DT-01, DT-02, DT-03, DT-11, and DT-15. A hit on one of these five is a validation blocker with the ID shown. G2 then reads `blocker` and G3 `Blocked` until it is fixed, or lifted by a valid exception where the table says one can. The engine supports the others with its numbers (DT-04 in part, through the options' hard filter and the `RESIDENCY-region` blocker, which carry no DT ID) or does not check them. The skill applies them in the write-up and the reviewer checks them. Chunk 09's decision tree lists every rule with what fired, its evidence, and the response, citing the engine's IDs.

| Rule | Observable condition | Standard outcome | Engine |
|---|---|---|---|
| DT-01 | Business outcome or owner is missing | **STOP**; identify the owner and the success criterion. Evidence: a signed brief | `DT-01-STOP` while the primary entry of BUS-01 or HDR-02 is `Open`. An exception on that entry lifts the blocker, but G0 still needs the entry answered, so G0, and every later gate, is not met until it is. |
| DT-02 | User-facing p99 not defined for a latency-critical journey | **BLOCK** agreement on that SLO; do not pick instance types based on guesses. Evidence: the journey SLI target and its measurement location | `DT-02-BLOCK@CAP-07.<n>` for each CAP-07 entry with priority `Must` and no p99 held (`Open`, or `N/A`). An exception on that entry lifts it. |
| DT-03 | RPO or RTO unknown for critical data or function | **BLOCK** DR commitments; perform a business-impact analysis. Evidence: RPO and RTO per scope and scenario | `DT-03-BLOCK@unknown` while the primary REL-05 entry is `Open`; `DT-03-BLOCK@<scope>` for each named failure scope without a held RTO or RPO. An exception on that REL-05 entry lifts it. |
| DT-04 | A hard residency or compliance restriction excludes an option | Remove the candidate; obtain a compliance authority review if ambiguity remains. Evidence: control and jurisdiction mapping | Partly: of the hard entries, the options' hard filter checks only HDR-08 and INT-08 against each option's shape (it also checks topology and DR against the failure scopes; `options-and-economics.md`). `RESIDENCY-region` blocks while DAT-04 says `yes` and no primary location is given. A person checks the other hard entries against each option at the G2 review stop. The person records an option that breaks one with `exclude-option` (the entry and the reason), so the engine fails it (`excluded`) and never shortlists it. |
| DT-05 | Expected peak exceeds proven system capacity | Add capacity, change the design, or negotiate the workload or SLO; test. Evidence: load model and headroom test | Not checked. The peak numbers come from the calculations (`CALC-02`, `CALC-03`, `CALC-16`); proven capacity is evidence a person gives (brownfield baseline, chunk 06). |
| DT-06 | Tight latency between components would span sites or clouds | Quantify RTT and co-location or async alternatives; do **not** assume cross-site calls will work. Evidence: dependency trace and measured RTT | Not checked. Hybrid boundary analysis (`classification-and-paths.md`) and INT-09; the SDD designs the mechanism. |
| DT-07 | The target must survive a stated fault domain | Consider independent failure domains and failover, shared dependencies included. Evidence: failure mode model or DR exercise | The DR strategy per REL-05 failure scope, and the shape's conflicts (`CONFLICT-*@<scope>`), which DT-15 then holds until they are closed or accepted. |
| DT-08 | The RPO implies stringent consistency | Assess synchronous against asynchronous data protection and the impact on write latency and availability. Evidence: replication trade-off ADR and test | The replication per scope (`synchronous` at RPO 0, `asynchronous` above, `TBD` when unknown) and `CONFLICT-rpo0@<scope>`. ADR-DATA-001 in chunk 09 records the decision. |
| DT-09 | The target platform needs unsupported technology or licensing | Exclude the option or budget the replatform or refactor; no "blind lift-and-shift". Evidence: compatibility matrix | Not checked. Path evidence (`classification-and-paths.md`) and, with the overlay, OVL-06 destination fit. |
| DT-10 | Cloud costs, lead times, service quotas, or skills violate limits | Revisit the plan, negotiate constraints, or choose another compliant path. Evidence: TCO and viability sign-off | Not checked. Each option's TCO (`CALC-21`) against the budget envelope (ECO-01), read by a person. |
| DT-11 | The migration destination differs from the source | Evaluate the 7 Rs **per workload**, dependency wave, cutover, and rollback. Evidence: migration workbook and runbook | `DT-11-BLOCK@WL-NN` while the overlay applies and a workload has no OVL-04 entry, or its OVL-04 entry is `Open`. The engine makes this a blocker. An exception on that OVL-04 entry lifts it (`migration-overlay.md`). |
| DT-12 | A critical design decision has more than one viable option | The ADR must compare them against approved criteria. Evidence: an accepted ADR | The weighted score (`CALC-22`) with approved weights; without them the comparison is flagged `UNWEIGHTED` (`options-and-economics.md`). |
| DT-13 | Only one feasible option exists | The ADR records the constraints that eliminate the others; validation is still required. Evidence: an accepted ADR | Each option's hard result and its failures name what eliminated it. |
| DT-14 | Mandatory security or DR acceptance cannot be tested | **BLOCK** production acceptance; define the verification and its responsible owner. Evidence: test plan and results | Not checked: production acceptance is G5, after the SDD. The Pre-SDD records each entry's verification method and owner, and G3-13 asks for the acceptance-test matrix. |
| DT-15 | Open high-severity risks are not approved | **BLOCK** Pre-SDD approval, or obtain an empowered, explicit, time-bound exception. Evidence: a risk acceptance record | `DT-15-BLOCK` while any other blocker or any conflict remains and checklist line G3-11 is not `Done`. Ticking G3-11 (only a person, or the fixture owner in a test run) removes DT-15 itself; every other blocker stays. |

So a conflict alone makes G2 read `blocker` through DT-15 until it is closed or a person ticks G3-11. Show it at the G2 review stop as a conflict to close or to accept formally, never as a failure of the shape.

Other validation blockers the engine raises:
- `OPEN-<entry>` (a hard entry that is `Open`);
- `INVALID-<entry>.value` or `INVALID-<entry>.<factor>` (a value the calculations cannot read);
- `DUPLICATE-SCOPE@<scope>` (two REL-05 entries with one scope);
- `OVERRIDE-reason` (an override without its written reason);
- with the overlay, `OPEN-migration-source`.

The validation fragment lists each with its message and owner (`register-and-entries.md` for the entry rules).

---

## The G3 checklist

The fourteen lines are the Standard's minimum Gate 3 checklist (§ 11.1), with IDs `G3-01` to `G3-14`. Each line is `Done`, `N/A` with a reason, or `Open`; a line never ticked is `Open`.

Only a person ticks a line: it is that person's attestation, not a choice. The skill shows the evidence for each line and asks; it never ticks one. An answer policy never ticks one. In a test run, the named fixture owner ticks in the person's place (`SKILL.md` § Answer policy, "Not the test-run policy"). G3-11 formally accepts the open hard-constraint conflicts and high risks, and lifts DT-15, as an exception does. So only an empowered owner ticks it.

| Line | Text | Evidence to show |
|---|---|---|
| G3-01 | A named business sponsor and product owner approved the problem, scope and success measures. | HDR-02, HDR-03, BUS-01, BUS-03, and their sign-offs |
| G3-02 | The Greenfield/Brownfield × On-prem/Cloud path is recorded (including mixed/hybrid logic where needed). | HDR-07, HDR-08, the path code, chunk 02 |
| G3-03 | Source-to-target migration direction is explicit, or `N/A` with reason. | HDR-09, HDR-10, the overlay switch and source |
| G3-04 | Every critical journey has measurable capacity and performance outcomes, including measurement methodology. | BUS-02 per journey, CAP-01, CAP-07, CAP-08, chunk 04 |
| G3-05 | Availability, RTO, RPO, data correctness and tolerated failure scopes have business approval. | REL-01, REL-03, REL-04, REL-05, REL-10, DAT-05, the DR strategy per scope |
| G3-06 | Security/privacy/legal/data residency requirements are mapped to owners and feasibility checked. | SEC-01 to SEC-08, DAT-03, DAT-04, DAT-06 |
| G3-07 | Integration/dependency graph and network boundary assumptions are validated. | INT-01 to INT-09 |
| G3-08 | Cost and delivery envelopes, operating model and team capability have owners. | ECO-01 to ECO-04, OPS-01, OPS-02, BUS-05 |
| G3-09 | For brownfield, baseline metrics, inventory, constraints and major defects are evidenced. | Chunk 06; `N/A` with a reason for greenfield |
| G3-10 | For migrations, per-workload 7R, dependency waves, data path, fallback and no-return point are documented. | Chunk 08; `N/A` with a reason without the overlay |
| G3-11 | All hard-constraint conflicts and high risks have been closed or formally accepted by an empowered owner. | Chunk 10's blockers, conflicts, and risks; the exceptions |
| G3-12 | The option comparison, recommended path, rationale, open PoCs and proposed ADRs are recorded. | Chunks 07 and 09 |
| G3-13 | SDD acceptance-test matrix and responsibilities are established. | Each entry's verification method and owner, OPS-08, chunk 12 |
| G3-14 | Required approvals, dates, conditions and next-review trigger are captured. | Chunk 11: the sign-off register, the conditions, the exceptions |

The checklist is part of the signed content, so tick every line before anyone signs.

---

## The sign-off register

Each applicable role of the Standard's sign-off register signs (§ 11.2). The engine knows the roles by these keys:

| Role key | Role | Signs for | Header row |
|---|---|---|---|
| `business_sponsor` | Business sponsor | Business outcome and trade-offs | HDR-02 |
| `product_owner_business_process_owner` | Product owner / business process owner | Journeys, NFRs, success | HDR-03 |
| `lead_principal_architect` | Lead / principal architect | Feasibility, design options, ADR linkage | HDR-04 |
| `infrastructure_platform_owner` | Infrastructure / platform owner | Hosting and capacity feasibility | |
| `network_owner` | Network owner | Connectivity, latency, and routing feasibility | |
| `security_and_privacy_compliance` | Security and privacy/compliance | Security, privacy, and regulatory constraints | |
| `data_owner` | Data owner | RPO, integrity, residency, retention | |
| `sre_operations` | SRE / operations | SLO monitoring and recoverability | |
| `finance_procurement` | Finance / procurement | TCO, budget, and procurement viability | |
| `migration_owner` | Migration owner (if relevant) | Transition and cutover approach | |
| `architecture_review_authority` | Architecture review authority | Decision acceptance | HDR-05 |

**Applicability.**
- The migration owner applies only while the migration overlay applies. Without the overlay the engine ignores any record for that role.
- Every other role applies unless a person (or the fixture owner in a test run) marks it not applicable, with the reason: a sign-off record with `applicable` false, a reason, and no decision. The skill never marks a role not applicable, and a stand-in never does (the engine refuses both).

**One person, several roles.** One person may hold several roles, and by default the owner holds them all. Ask once at the G3 stop who signs each role. When a header row names someone else for a role (the table's last column), ask whether that person signs it instead. A person who holds several roles signs each one: one record per role, each under their own name.

**Decisions.** A signer gives one decision per role: `Approved`, `Approved with conditions`, or `Rejected`. The engine stores, with the decision, the signer's name, the UTC time, and the content hash of the state the signer reviewed: signers sign the content they reviewed. A role holds one record; a new signature replaces the old one. Record each signature in `decision-log.md` § Sign-off record.

**Outcomes.** `Approved` and `Approved with conditions` both let the SDD load and lock the Pre-SDD. A `Rejected` sign-off makes G3 `Blocked` until the signer changes it.

**The Approver stand-in.** An answer policy that names an `Approver` stand-in lets the stand-in sign applicable roles at the G3 stop (`SKILL.md` § Answer policy, rule 6). The engine counts a stand-in's sign-off only when all of these hold:
- the run's current answer policy is valid and names `Approver` among its stand-ins;
- the record's name is the stand-in label of the current policy, `Stand-in: Approver (<policy>, set by <name>, <date>)`, so a stand-in that signed under an earlier policy no longer counts and signs again;
- nothing else in G3 fails: with the stand-in sign-offs counted, G3 reaches an approved status. Otherwise none of them counts, and their roles stay in `missingRoles`.

So the stand-in signs only when the engine's G3 result names no problem other than the roles still to sign. A stand-in's `Rejected` blocks G3 whether or not it counts. A stand-in never replaces a person's sign-off (the engine refuses). A person who signs a role replaces the stand-in's record for it. A stand-in never ticks a checklist line, never marks a role not applicable, and never grants an exception. A fixture owner never signs a decision (the engine refuses; it may mark a role not applicable). So a fixture run reaches G3 only through an answer policy's Approver stand-in.

---

## Critical entries

G3 needs a person's confirmation on the critical entries. The critical rows are the ones the Studio v2.2 critical fields map to: HDR-07, HDR-08, CAP-01, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-01, DAT-03, DAT-05, and INT-08. The engine derives the list from its v2.2 field map, so this list follows the engine.

Every entry of a critical row passes when it is one of:
- `Confirmed`, with who confirmed it and when;
- `N/A`, with a reason;
- `Open`, under a valid exception.

DAT-01 is also checked on its `storeKind` factor: unless its entry is `N/A` with a reason or `Open` under a valid exception, the factor itself must be `Confirmed` with who and when. Each failing entry or factor is a G3 problem that names it, and G3 reads `Not signed`.

---

## Conditions

A condition is what `Approved with conditions` rests on. It comes from a signer or the owner at the G3 stop, in their words. The skill records it with the `add-condition` op under the name of the person who stated it (the engine refuses the skill and an answer policy). The engine writes it as `COND-NN` with its text, its owner (a named person), and its due date (`YYYY-MM-DD`).

- A condition without an owner or a valid due date makes G3 `Blocked`, and so does a sign-off of `Approved with conditions` while no condition is recorded. Record each condition complete. To change one, use `set-condition` (its `id` and at least one of `text`, `owner`, and `due`). To drop one, use `remove-condition`. Both go under the name of the person who asked, and a removed `COND-NN` is never used again.
- Any recorded condition makes an otherwise approved G3 read `Approved with conditions`.
- Conditions are part of the signed content: record them after the checklist ticks and before the signatures. A condition added after a signature sends G3 to `Review`.
- The handoff guide carries every condition with its owner and due date, and the SDD shows the open ones as risks (`handoff-guide.md`).

---

## Exceptions

An exception lets an `Open` item pass for a stated time. Only a named person grants one, never a stand-in, an answer policy, a fixture owner, or the skill. The engine accepts the `add-exception` op only from a person actor. Ask the person accountable for the entry; record the exception under that person's name.

The engine writes it as `EXC-NN`, with the entry ID, the reason, who granted it and when, the expiry date, and the review date. It counts (is valid) only while:
- it was granted by a person (not a `Policy:`, `Stand-in:`, or `Fixture:` label);
- its expiry date is today or later (UTC);
- its review date is on or before its expiry date.

A valid exception on an entry lifts:
- `OPEN-<entry>`, the blocker for a hard entry that is `Open`;
- the DT-01, DT-02, DT-03, and DT-11 blockers that rest on that entry;
- the G3 critical-entry problem for that entry, when it is `Open`.

It lifts nothing else: not G0 or G1 (an `Open` entry still needs its owner and due date, and G0's rows still need answers), not `INVALID-*`, `DUPLICATE-SCOPE@*`, `OVERRIDE-reason`, `OPEN-migration-source`, or `RESIDENCY-region`, not a conflict, and not DT-15 (G3-11 does that). When an exception expires, the blocker comes back. The engine's message names the exception that no longer lifts it. A named person may also revoke an exception before it expires (`revoke-exception`, with the reason; the engine refuses anyone else). On a revoke, the engine removes it, the history keeps it with the reason, and the blocker comes back at once.

An exception on an OVL-04 entry lifts `DT-11-BLOCK@WL-NN`. But G2 still needs every workload's OVL-04 to hold a value for a `shortlist`. So G3 cannot reach an approved status under that exception alone: the workload's 7R still needs its answer (`migration-overlay.md` § DT-11). The same holds for DT-01, whose rows G0 still needs answered.

Exceptions are part of the signed content: one granted after a signature sends G3 to `Review`. Chunk 10 and chunk 11 list every exception with who granted it, its expiry, and its review date. The handoff guide carries the ones that did not block G3.

---

## Change after G3

Each sign-off stores the content hash of the state its signer reviewed. G3 goes back to `Review` when:
- **the project state changes.** The hash covers the project (its name, slug, and BRDs), the register, the options, the decisions, the checklist, the conditions, the exceptions, and the unknowns. Any change there gives a new hash, and every earlier sign-off reads as given on other content.
- **a chunk's content changes outside the state.** The skill marks it with the `reopen` op and its reason (for example, the chunk whose prose changed). Every sign-off given before that time reads as given before the reopening.

Outside the hash: the run fields, the sign-off records themselves, the reopen mark, the history, and the Pre-SDD version number. So writing signatures into chunks 11, 12, and 00, updating gate and status lines, filling chunk 00's Consuming SDD row, and bumping the version reopen nothing.

After a change, every applicable role signs again on the new content, at the G3 stop (step 13). After a change, a role marked not applicable is marked again too. The update bumps the version once (`SKILL.md` § Later requests). Until G3 is signed again, the label no longer reads approved and the SDD treats the new version as not signed, and an SDD that loaded an earlier signed version keeps that version locked.

A change after G3 rewrites these, from the new fragments after `compute`:
- the master's and chunk 00's gate lines (G3 `Review`, SDD authorized `No`);
- chunk 11;
- chunk 12 § 12.1;
- every chunk region whose fragment the change touches (for a value: its register chunk, chunk 12 § 12.2, and chunks 04 and 10 when their fragments change).

The SDD stops on the gate line and § 12.1, so both must read `Review` before the signers sign again. The full procedure is the update tail in `SKILL.md` § Later requests.

---

## The stops

**G1 review stop** (end of stage 2). Show the counts by status, the `Open` entries with owner and due date, the hard `Open` entries, the unknowns with owner and due date, and what stage 3 will assess. Say what to review. Update the master's progress table and the board row (`SKILL.md` § Status board). Then stop until the user says "continue". An answer policy passes this stop only when it names it. Never start stage 3 in the same turn.

**G2 review stop** (end of stage 3). Show the engine's G2 result with its `missing` list. Also show the DR strategy per failure scope, the target shape and its conflicts, the options with their hard results and TCO, and the hard entries the engine does not check against the options. An option the person finds breaking one of those entries is recorded with `exclude-option` (the option, the entry, and the reason), under that person's name, so the engine fails it. Say what to review, update the progress table and the board row, and stop until the user says "continue" (or an answer policy that names the stop). With `incomplete` or `blocker`, name what is missing and who owns it. G3 cannot reach an approved status until G2 reads `shortlist`.

**G3 sign-off stop** (step 13). Show the gate; then the person ticks the checklist, the conditions are recorded, and the signers sign, in that order. No answer policy passes this stop. When the signers are not ready, the stop waits: the board row says so, and the handoff summary says what G3 still needs.

---

## Who may do what

| Action | Op | Person | Fixture owner (test run) | Answer policy | Approver stand-in | The skill (agent) |
|---|---|---|---|---|---|---|
| Tick a G3 checklist line | `check` | Yes | Yes | No | No | No |
| Sign a role | `sign` | Yes | No | Only as its stand-in | When the conditions above hold | No |
| Mark a role not applicable | `sign` | Yes | Yes | No | No | No |
| Record a condition | `add-condition` | Yes | Yes | No | No | No |
| Change or remove a condition | `set-condition`, `remove-condition` | Yes | Yes | No | No | No |
| Grant an exception | `add-exception` | Yes | No | No | No | No |
| Revoke an exception | `revoke-exception` | Yes | No | No | No | No |
| Reopen G3 after a chunk change | `reopen` | Yes | Yes | Yes | Yes | Yes, with the reason |
| Set the answer policy | `set-policy` | Yes | Yes | No | No | No |

The Person column includes the skill writing a person's own tick, sign-off, condition, or exception under that person's name, as it does with any answer on the prompt path. The last column is the skill acting on its own, with its agent actor. The engine enforces every refusal in this table and says in plain words whom to ask instead. One rule it cannot check stays the skill's: only an empowered owner ticks G3-11.
