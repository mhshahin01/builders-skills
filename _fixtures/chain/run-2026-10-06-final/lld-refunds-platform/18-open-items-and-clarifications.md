<!--
CHUNK: 18
TITLE: Open Items and Clarifications
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# Open Items & Clarifications

## How to read each item

This is the separate Codex disk re-read pass after body and Specs, under resume-codex.md's outside-Claude-Code rule. It has no independent model/context reset. Existing author flags in chunk 15 were excluded from findings; internal inconsistencies and missed boundaries below are distinct findings. Fixed test PM answers are applied within initial version 1.0.

## Open Items

### OI-01: Draft class and signature drift

- **Where:** all modules §7.2/§7.3; frontend §17.3
- **Type:** Inconsistency
- **Concern:** The disk draft used handle1-style signatures without resource ids, different pseudocode class names, and hyphens in three TypeScript identifiers. These cannot be a coherent build target.
- **Options:**
  - **A.** Use one named service implementation and explicit resource/subject/query arguments; normalize proposed component identifiers.
  - **B.** Keep shorthand signatures and let each implementer reconcile them; smaller document but contradictory wiring.
- **Recommendation:** A; corrected signatures, class names and identifiers.
- **Why:** The implementation template requires load-bearing method signatures and an internally consistent class map; clearer wiring costs a few additional lines.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-02: API-14 replay must bind to the source message row

- **Where:** notifications §7.3; §12.2
- **Type:** Contract drift
- **Concern:** Generic request-hash conflict wording had leaked into API-14, whose source errors and schema contain no such error or notifications idempotency_record table. The first success/error replay fields were unstated.
- **Options:**
  - **A.** Bind replay to message_key, status, last_error_code and ended_at; return first result/error and preserve source errors.
  - **B.** Add a new replay table/hash-conflict error; more uniform REST logic but changes the port contract.
- **Recommendation:** A; source-message binding and explicit first error/result replay applied.
- **Why:** SDD API-14 repeats the first outcome, and 13d provides its message row; source fidelity wins over a uniform generic rule.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-03: Late rejoin replay needs a lock-order boundary

- **Where:** loyalty-points §7.3
- **Type:** Concurrency hazard
- **Concern:** The notice pseudocode immediately reevaluated held purchases after period mutation, without releasing the member lock. That can invert the stated purchase-before-member order against a concurrent refund.
- **Options:**
  - **A.** Commit notice/period work, then re-drive each held purchase in a fresh purchase-first transaction and recheck period under lock.
  - **B.** Hold member and purchase locks across all replay; simpler orchestration but a deadlock cycle.
- **Recommendation:** A; phase boundary and concurrency test plan applied.
- **Why:** SDD 13e mandates purchase-first locking and durable late-notice reconciliation; the tradeoff is a crash-recoverable two-phase implementation within existing behavior.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-04: Report screen text was mistaken for a UC mapping

- **Where:** global §17.3 and §19.9
- **Type:** Traceability gap
- **Concern:** [LOYALTY/MK-04](../brd-loyalty-points/14-todo.md#mockup-coverage) says None, then cites [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) as report provenance. The draft parsed that citation as the screen UC and gave the report route use_case.
- **Options:**
  - **A.** Read only the mapping before the None report explanation; report keeps [LOYALTY/MK-04](../brd-loyalty-points/14-todo.md#mockup-coverage) screen only.
  - **B.** Infer [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) from provenance; easy drill-down but contradicts the BRD screen row.
- **Recommendation:** A; corrected route data, workflow Screens and index.
- **Why:** The trace rule reads the screen UC cell and explicitly separates report workflows; it accepts screen-only telemetry.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-05: Entry-point matching must compare complete paths

- **Where:** refund-requests §7.2
- **Type:** Traceability gap
- **Concern:** Substring matching incorrectly treated POST /v1/refund-requests as an entry point of cancellation and decision UCs too. The source lists distinct full paths.
- **Options:**
  - **A.** Compare the full method/path token from SDD §7.3; preserve row order only for genuine shared endpoints.
  - **B.** Keep prefix matching; less parsing work but wrong use_case spans/logs.
- **Recommendation:** A; exact matching applied and all named entry-point annotations rechecked.
- **Why:** sdd-to-lld trace checks require exact entry points; path prefixes are not the same operation.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-06: Copied confidence text needs rebased links

- **Where:** global §18.3
- **Type:** Traceability gap
- **Concern:** Five index descriptions retained ../../ SDD paths copied from module files, so their links resolved outside the run when read from chunk 15.
- **Options:**
  - **A.** Rebase only the copied index description links to its directory and validate every local file/anchor.
  - **B.** Remove source links from index text; fewer links but loses provenance.
- **Recommendation:** A; descriptions rebased; source module flags unchanged.
- **Why:** The skill requires every relative link to resolve; rebasing keeps provenance without duplicating a different fact.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-07: Notifications template and publication roles were generic

- **Where:** notifications §7.4; payouts §7.4
- **Type:** Pattern misapplication
- **Concern:** The initial diagram assigned a fictitious HTTP controller to provider-only modules and gave notifications an outgoing durable registry writer even though it publishes no catalog event. Runtime template selection also lacked its own pattern roles.
- **Options:**
  - **A.** Use actual port/callback adapters, incoming message-work/inbox roles and a type/channel template Strategy.
  - **B.** Leave generic controller/outbox diagrams as examples; concise but misleading production wiring.
- **Recommendation:** A; module-specific adapter/work diagrams and template Strategy applied.
- **Why:** SDD 13c/13d expose provider/port entry points and 13d names runtime templates; CLAUDE.md asks for appropriate Strategy and composition.
- **Status:** Resolved - accepted recommendation applied in initial 1.0

### OI-08: Broad UI defaults would add release behavior

- **Where:** frontend §17.9; source BRD 11
- **Type:** Missing scenario
- **Concern:** CLAUDE.md table defaults include bulk actions and persistent preferences, plus export. Applying all of them would add behavior absent from these BRDs; points-history export is a future enhancement.
- **Options:**
  - **A.** Keep source paging/sorting, report exports and existing cancellation/decision actions only.
  - **B.** Add bulk actions, persistent preferences and points-history export to satisfy every general table default; increases product scope.
- **Recommendation:** A; reject the new behavior proposed in B and retain the source scope.
- **Why:** Both BRD 11 chunks and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) define this release; the fixed test PM policy overrides a broad technical default.
- **Status:** Rejected - out of scope for this release (test-fixture policy)

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
| --- | --- | --- | --- |
| OI-01 | 2026-10-06 | 04-implementation and 14-frontend.md | Resolved; A; corrected signatures, class names and identifiers. |
| OI-02 | 2026-10-06 | 04-implementation/notifications.md and 09-cross-cutting.md | Resolved; A; source-message binding and explicit first error/result replay applied. |
| OI-03 | 2026-10-06 | 04-implementation/loyalty-points.md and 13-testing.md | Resolved; A; phase boundary and concurrency test plan applied. |
| OI-04 | 2026-10-06 | 14-frontend.md and 16-references.md | Resolved; A; corrected route data, workflow Screens and index. |
| OI-05 | 2026-10-06 | 04-implementation/refund-requests.md | Resolved; A; exact matching applied and all named entry-point annotations rechecked. |
| OI-06 | 2026-10-06 | 15-open-questions.md | Resolved; A; descriptions rebased; source module flags unchanged. |
| OI-07 | 2026-10-06 | 04-implementation/notifications.md and 04-implementation/payouts.md | Resolved; A; module-specific adapter/work diagrams and template Strategy applied. |
| OI-08 | 2026-10-06 | 14-frontend.md §17.9; out of scope for this release (test-fixture policy) | Rejected; A; reject the new behavior proposed in B and retain the source scope. |

## Reviewer Notes

| Service | Risk surface | Checked | Findings | What was checked |
| --- | --- | --- | --- | --- |
| customer-accounts | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/customer-accounts.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| customer-accounts | Transactions | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| customer-accounts | Idempotency | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| customer-accounts | Multi-tenancy | Yes | No issue found | 04-implementation/customer-accounts.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| customer-accounts | Outbox | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| customer-accounts | Saga compensation | Yes | No issue found | 04-implementation/customer-accounts.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| customer-accounts | Retry and backoff | Yes | No issue found | 04-implementation/customer-accounts.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| customer-accounts | Observability | Yes | No issue found | 04-implementation/customer-accounts.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| customer-accounts | Test coverage | Yes | No issue found | 04-implementation/customer-accounts.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| customer-accounts | Schema versioning | Yes | No issue found | 04-implementation/customer-accounts.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| customer-accounts | Duplication | Yes | OI-01 | 04-implementation/customer-accounts.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| loyalty-points | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/loyalty-points.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| loyalty-points | Transactions | Yes | OI-03 | 04-implementation/loyalty-points.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| loyalty-points | Idempotency | Yes | No issue found | 04-implementation/loyalty-points.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| loyalty-points | Multi-tenancy | Yes | No issue found | 04-implementation/loyalty-points.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| loyalty-points | Outbox | Yes | No issue found | 04-implementation/loyalty-points.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| loyalty-points | Saga compensation | Yes | No issue found | 04-implementation/loyalty-points.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| loyalty-points | Retry and backoff | Yes | No issue found | 04-implementation/loyalty-points.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| loyalty-points | Observability | Yes | No issue found | 04-implementation/loyalty-points.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| loyalty-points | Test coverage | Yes | No issue found | 04-implementation/loyalty-points.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| loyalty-points | Schema versioning | Yes | No issue found | 04-implementation/loyalty-points.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| loyalty-points | Duplication | Yes | OI-01 | 04-implementation/loyalty-points.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| notifications | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/notifications.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| notifications | Transactions | Yes | OI-02 | 04-implementation/notifications.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| notifications | Idempotency | Yes | OI-02 | 04-implementation/notifications.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| notifications | Multi-tenancy | Yes | No issue found | 04-implementation/notifications.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| notifications | Outbox | Yes | OI-07 | 04-implementation/notifications.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| notifications | Saga compensation | Yes | No issue found | 04-implementation/notifications.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| notifications | Retry and backoff | Yes | No issue found | 04-implementation/notifications.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| notifications | Observability | Yes | No issue found | 04-implementation/notifications.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| notifications | Test coverage | Yes | OI-02 | 04-implementation/notifications.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| notifications | Schema versioning | Yes | No issue found | 04-implementation/notifications.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| notifications | Duplication | Yes | OI-01 | 04-implementation/notifications.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| payouts | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/payouts.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| payouts | Transactions | Yes | No issue found | 04-implementation/payouts.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| payouts | Idempotency | Yes | No issue found | 04-implementation/payouts.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| payouts | Multi-tenancy | Yes | No issue found | 04-implementation/payouts.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| payouts | Outbox | Yes | OI-07 | 04-implementation/payouts.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| payouts | Saga compensation | Yes | No issue found | 04-implementation/payouts.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| payouts | Retry and backoff | Yes | No issue found | 04-implementation/payouts.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| payouts | Observability | Yes | No issue found | 04-implementation/payouts.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| payouts | Test coverage | Yes | No issue found | 04-implementation/payouts.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| payouts | Schema versioning | Yes | No issue found | 04-implementation/payouts.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| payouts | Duplication | Yes | OI-01 | 04-implementation/payouts.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| refund-requests | Error envelope (RFC 9457) | Yes | No issue found | 04-implementation/refund-requests.md; §7.7 and §12.6 checked against SDD §15.1/module Error Handling; port error mapping kept separate |
| refund-requests | Transactions | Yes | No issue found | 04-implementation/refund-requests.md; §7.3/7.6 lock order, rollback, provider I/O outside DB transaction; API-12/13 read-only and API-14 own outcome transaction |
| refund-requests | Idempotency | Yes | No issue found | 04-implementation/refund-requests.md; §7.3 business unique keys, inbox and replay fields vs source Tables Design; unknown provider identity preserved |
| refund-requests | Multi-tenancy | Yes | No issue found | 04-implementation/refund-requests.md; §7.2 guards, §8.4 FORCE RLS, credential/host/token tenant, jobs and port context; no cross-schema reads |
| refund-requests | Outbox | Yes | No issue found | 04-implementation/refund-requests.md; §7.3/7.4 and §12.4 compared with SDD §11.1; atomic registry publication and separate durable module work |
| refund-requests | Saga compensation | Yes | No issue found | 04-implementation/refund-requests.md; §7.3 compared with SDD outcomes; no 2PC/reversal; Keycloak orphan compensation and payout final/late failure |
| refund-requests | Retry and backoff | Yes | No issue found | 04-implementation/refund-requests.md; §12.3 instance rows against SDD INT rows and module poison/provider rules; unresolved timeouts remain flagged |
| refund-requests | Observability | Yes | OI-05 | 04-implementation/refund-requests.md; Source metric homes, sanitized JSON/MDC/span, source tenant on replay and context finally restore |
| refund-requests | Test coverage | Yes | No issue found | 04-implementation/refund-requests.md; §16 planned concurrency/crash tests, keyed BRD cases and designed e2e specs; no executable pass claimed |
| refund-requests | Schema versioning | Yes | No issue found | 04-implementation/refund-requests.md; §8.5 and §10.2 compared with source migration/listener identity rules; no topic registry invented |
| refund-requests | Duplication | Yes | OI-01 | 04-implementation/refund-requests.md; Module implementation deltas only; sourced §8.2/§9.6/§10.6 views; source scope/payload/role homes linked |
| global | Contract drift (SDD §14/§15/§16) | Yes | OI-02, OI-07 | Ten catalog rows and DTO ownership; three exact port contracts; all endpoint/port tokens checked against source register |
| global | Specs-body | Yes | No issue found | Mission SDD §1; stack §6.3 vs Specs; five phases/modules and Greenfield source type; no local pins |
| global | Use-case traceability | Yes | OI-01, OI-04, OI-05, OI-06 | Nine source rows, eight workflows/specs, all 154 source cases, nine screens/fifteen routes; exact owner/entry/Related UC and resolving links |

Author flags remain implementation verification work, not reopened reviewer findings. Mermaid was checked as text only; no renderer/Miro/external tool was used. Review disposition applies to this documentation fixture, not production code or legal approval.


## CHK correction review - 2026-10-06

User approved the CHK triage. Codex re-read the corrected files from disk in this context. This is one LLD update, version 1.1. Existing TODO/Confirm flags remain source/implementation questions and are not new reviewer findings.

- Canonical Controllers columns restored in all five modules; all 15 registered entry points retain their source annotations, including the event and scheduled trigger.
- Removed three extra annotations from profile, movement-detail and branch-detail reads because SDD section 7.3 does not register those endpoints for the named UCs. Endpoint behavior and permission checks are unchanged.
- Six bare BRD IDs in API/review prose now use keyed source links. Historical OI meanings and decisions are unchanged.
- The 58 original reviewer coverage rows remain. Targeted checks cover annotation/register equality, route mappings, source case links and parent lineage; checker parser corrections are tracked in the CHK stage log.
- No new business scenario was added. No new person-only decision or mockup change was required by these LLD edits.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 17-specs.md | NEXT: none -->
