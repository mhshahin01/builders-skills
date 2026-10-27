# Unifier status board

Run mode: solo

## Employees

| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |
|---|---|---|---|---|---|---|---|---|
| Business development | Product Management & Business Development | pre-brd-unifier | - | Not started | - | - | - | - |
| Product manager | Product Management & Business Development | brd-unifier | - | Not started | - | - | - | - |
| Business owner | Product Management & Business Development | business-reviewer-unifier | - | Not started | - | - | - | - |
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | pre-sdd-refunds-platform/ | Done v1.0 | 1.0 | 2026-10-27 19:11 | Handed off: HR-003 to the Software Architect (Later); see pre-sdd-refunds-platform/12-sdd-handoff-guide.md | - |
| Software Architect | Software Development & Delivery | sdd-unifier | sdd-refunds-platform/ | Done v1.0 | 1.0 | 2026-10-27 21:39 | E2E gate Locked: waits on OI-23 and OI-24 (HR-004, HR-005) and OI-27 (product owner); OI-37 and OI-38 pending application; see sdd-refunds-platform/refunds-platform-sdd-master.md | E2E Architect (HR-004); E2E Architect (HR-005) |
| Tech Lead | Software Development & Delivery | lld-unifier | - | Not started | - | - | - | - |
| Developer / software engineer | Software Development & Delivery | impl-tracker-unifier | - | Not started | - | - | - | - |

## Handoff requests

| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |
|---|---|---|---|---|---|---|---|---|
| HR-001 | E2E Architect | Product manager | BRD REFUNDS v1.5: state the seconds for an everyday portal action (REFUNDS/NFR-05), the retention periods (REFUNDS/NFR-06) and the countries the branches operate in (REFUNDS/NFR-07) | The Pre-SDD runs on a policy-accepted proposal for CAP-07.1 (QD-02) and on fixture values for DAT-06.1; only the BRD owner can state these business values | 2026-10-27 18:36 | Open | - | C:/Users/negat/AppData/Local/Temp/claude/C--Users-negat--claude-skills/5cecb36b-03d8-4e5a-8cf5-681dd1950497/scratchpad/tools/runs/run-2026-10-27b-psdd/brd-refunds-portal/10-nfrs.md |
| HR-002 | E2E Architect | Product manager | BRD LOYALTY v1.7: state the minutes per month the points screens may be unavailable (LOYALTY/NFR-04), confirm when earned points show (LOYALTY/NFR-03) and state the retention periods (LOYALTY 03) | The Pre-SDD runs on a policy-accepted proposal for REL-01.2 (QD-01) and on fixture values for DAT-06.1; only the BRD owner can state these business values | 2026-10-27 18:36 | Open | - | C:/Users/negat/AppData/Local/Temp/claude/C--Users-negat--claude-skills/5cecb36b-03d8-4e5a-8cf5-681dd1950497/scratchpad/tools/runs/run-2026-10-27b-psdd/brd-loyalty-points/10-nfrs.md |
| HR-003 | E2E Architect | Software Architect | Hand-off: Pre-SDD refunds-platform v1.0 is G3-signed | G3 Approved with conditions (COND-01; EXC-01 on SEC-01.1 until 2027-12-31); the SDD may load and lock the Pre-SDD | 2026-10-27 19:11 | Done | 2026-10-27 21:39 | C:/Users/negat/AppData/Local/Temp/claude/C--Users-negat--claude-skills/5cecb36b-03d8-4e5a-8cf5-681dd1950497/scratchpad/tools/runs/run-2026-10-27b-psdd/pre-sdd-refunds-platform/refunds-platform-pre-sdd-master.md |
| HR-004 | Software Architect | E2E Architect | Pre-SDD refunds-platform v1.0: decide SDD OI-23, zone-scope replication and RPO (PSDD/REL-04.2, PSDD/REL-05.2) against PSDD/REL-10.1 | Asynchronous zone replication with a 5 s RPO can lose acknowledged refund requests and payout states; the SDD keeps the locked values and its e2e gate stays shut until the E2E Architect answers | 2026-10-27 21:20 | Open | - | C:/Users/negat/AppData/Local/Temp/claude/C--Users-negat--claude-skills/5cecb36b-03d8-4e5a-8cf5-681dd1950497/scratchpad/tools/runs/run-2026-10-27b-psdd/sdd-refunds-platform/18-open-items-and-clarifications.md |
| HR-005 | Software Architect | E2E Architect | Pre-SDD refunds-platform v1.0: decide SDD OI-24, the locked peak request rate (PSDD/CAP-02.1) against the locked 300 peak active users (PSDD/CAP-03.1) | At 0.2292 req/s, 300 active users make one request every 22 minutes; the SDD cannot size or load-test the ingress edge on a locked rate it contradicts; its e2e gate stays shut until the E2E Architect answers | 2026-10-27 21:20 | Open | - | C:/Users/negat/AppData/Local/Temp/claude/C--Users-negat--claude-skills/5cecb36b-03d8-4e5a-8cf5-681dd1950497/scratchpad/tools/runs/run-2026-10-27b-psdd/sdd-refunds-platform/18-open-items-and-clarifications.md |
