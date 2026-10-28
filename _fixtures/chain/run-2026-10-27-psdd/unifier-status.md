# Unifier status board

Run mode: solo

## Employees

| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |
|---|---|---|---|---|---|---|---|---|
| Business development | Product Management & Business Development | pre-brd-unifier | - | Not started | - | - | - | - |
| Product manager | Product Management & Business Development | brd-unifier | - | Not started | - | - | - | - |
| Business owner | Product Management & Business Development | business-reviewer-unifier | - | Not started | - | - | - | - |
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | ./pre-sdd-refunds-platform/ | Done v1.0 | 1.0 | 2026-10-27 17:27 | Handed off to the Software Architect (HR-006, Later) (pre-sdd-refunds-platform/refunds-platform-pre-sdd-master.md) | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Not started | - | - | - | - |
| Tech Lead | Software Development & Delivery | lld-unifier | - | Not started | - | - | - | - |
| Developer / software engineer | Software Development & Delivery | impl-tracker-unifier | - | Not started | - | - | - | - |

## Handoff requests

| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |
|---|---|---|---|---|---|---|---|---|
| HR-001 | E2E Architect | Product manager | Answer REFUNDS/NFR-05: within how many seconds must an everyday action in the Refunds Portal complete? | The Pre-SDD takes a P99 of 2000 ms (CAP-07.1) as the target until the BRD states it (unknown QD-03); only the BRD owner can settle it. | 2026-10-27 16:38 | Open | - | ./pre-sdd-refunds-platform/03b-register-capacity.md |
| HR-002 | E2E Architect | Product manager | Answer LOYALTY/NFR-04: how many minutes per month may the points screens be unavailable, planned maintenance included? | The Pre-SDD takes 99.9% (REL-01.2) as the target until the BRD states it (unknown QD-04); only the BRD owner can settle it. | 2026-10-27 16:38 | Open | - | ./pre-sdd-refunds-platform/03c-register-reliability.md |
| HR-003 | E2E Architect | Product manager | Name who confirms the applicable data-protection law (REFUNDS 02 and LOYALTY 02 Dependencies, owner not stated) and record the answer in both BRDs | SEC-01.1 is a hard entry that stays Open until the law is known (unknown QD-02, Legal Counsel, due 2026-11-20); the BRD dependency rows name no owner. | 2026-10-27 16:38 | Open | - | ./pre-sdd-refunds-platform/03e-register-security.md |
| HR-004 | E2E Architect | Product manager | Answer REFUNDS/NFR-07 and REFUNDS 11, LOYALTY 11: in which countries do the branches operate, and which languages, date and number formats and accessibility standard apply? | Unknown QD-05 (BUS-06.1); the countries can change residency (DAT-04) and the tax records (BUS-08); only the BRD owner can settle it. | 2026-10-27 16:42 | Open | - | ./pre-sdd-refunds-platform/03a-register-business.md |
| HR-005 | E2E Architect | Product manager | Answer REFUNDS 03 Customer identity and LOYALTY/UC-01 Preconditions: how does a customer prove who they are, and which party signs a member in? | Unknown QD-06 (SEC-02.1); the answer sets the identity sources and may add an integration; only the BRD owner can settle it. | 2026-10-27 16:42 | Open | - | ./pre-sdd-refunds-platform/03e-register-security.md |
| HR-006 | E2E Architect | Software Architect | Hand-off: Pre-SDD refunds-platform v1.0 is G3-signed | G3 reads Approved with conditions (COND-01, Refunds and Loyalty Product Owner, 2026-12-15; EXC-01 on SEC-01.1 until 2027-12-31); the SDD may start and loads chunk 12 first. | 2026-10-27 17:27 | Later | - | C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\5cecb36b-03d8-4e5a-8cf5-681dd1950497\scratchpad\tools\runs\run-2026-10-27-psdd\pre-sdd-refunds-platform\refunds-platform-pre-sdd-master.md |
