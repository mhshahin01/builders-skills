<!--
CHUNK: 00
TITLE: Metadata
PROJECT: Refunds Platform
VERSION: 1.4
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# Low-Level Design Document - Refunds Platform

| Field | Value |
| --- | --- |
| Document Title | Low-Level Design - Refunds Platform |
| Version | 1.4 |
| Status | Draft |
| Mode | from-sdd |
| Date | 2026-10-07 |
| Author(s) | Codex, under the fixed test PM policy |
| Reviewers | Codex, separate disk re-read pass |
| Approvers | Test PM policy for this fixture; production approval pending |
| Related BRD(s) | [REFUNDS 1.9](../brd-refunds-portal/refunds-portal-brd-master.md), [LOYALTY 1.8](../brd-loyalty-points/loyalty-points-brd-master.md) |
| Related SDD | [Refunds Platform 1.12](../sdd-refunds-platform/refunds-platform-sdd-master.md) |
| Source Code Path | Not applicable - Greenfield |

> **Production bug?** Start at [§19.9 Use-Case Traceability Index](./16-references.md#199-use-case-traceability-index).

## Mode Summary

From-sdd build target for all five modules. No source application or executable application tests exist in this run. Source SDD and BRD facts win over defaults; implementation choices are flagged. Full review and applied fixture answers join the initial 1.0 draft, not a second revision.

## Changes Log

| Version | Date | Author | Mode | Change Summary |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-10-06 | Codex | from-sdd | Initial LLD from SDD 1.3 and REFUNDS/LOYALTY 1.7; five modules, keyed workflow/test/route trace, Specs synthesis, separate disk review, and fixed test-PM decisions. Chunks: none (initial build). |
| 1.1 | 2026-10-06 | Codex | from-sdd | Approved CHK corrections: canonical Controllers tables, keyed references, exact annotation/register agreement, and targeted disk review; no business behavior added. Chunks: 04-implementation/customer-accounts.md, 04-implementation/loyalty-points.md, 04-implementation/refund-requests.md, 18 |
| 1.2 | 2026-10-06 | Codex | from-sdd | R3d combined refresh from SDD 1.5, REFUNDS 1.9 and LOYALTY 1.8: as-of report algorithms, nullable averages, owner-only measures, staff source/basis, current cap acceptance evidence, keyed test trace, Specs and disk delta review. Chunks: 01, 04-implementation/loyalty-points.md, 04-implementation/refund-requests.md, 06, 09, 11, 12, 13, 14, 16, 17, 18, decision-log.md |
| 1.3 | 2026-10-07 | Claude Code (lld-unifier) | from-sdd | Targeted refresh from SDD 1.5 to 1.7 (Changes Log rows 1.6 and 1.7); REFUNDS 1.9 and LOYALTY 1.8 unchanged, so no trace refresh. A-04 added for SDD §3 Assumption 8 and A-01 removed (its assumption and owner live in SDD §3); the API-07, API-08 and API-09 TODOs ask for the call pattern and call fields of SDD §15.6; the loyalty take-back keys (two Figure 27 relationships, four §8.2 rows with three FKs and five indexes), the take-back write order, the former-member deletion order with the `movement_id` clearing step, and its integration tests; steps 6a and 6b rerun, no trace or Specs change. Delta review by a cleared-context agent: OI-09 to OI-13, all accepted and applied (due periods oldest first with member rows last, the notice match, an always-locking purchase lock, per-record feed transactions and `importOpeningBalance`, the A-01 removal), with CONFIRM-23, CONFIRM-24 and TODO-38. Chunks: 01, 04-implementation/loyalty-points.md, 05, 06, 13, 15, 16, 18, decision-log.md |
| 1.4 | 2026-10-07 | Claude Code (lld-unifier) | from-sdd | Targeted refresh from SDD 1.7 to 1.12 (Changes Log rows 1.8 to 1.12; SDD chunks 01, 04, 05, 07, 08, 11, 13a, 13b, 13e, 16, 18, 19); REFUNDS 1.9, LOYALTY 1.8 and their chunk 14 rows unchanged, so no trace refresh. Carried: the five synchronous outside calls of SDD §8.1.1 (03 §6.4; the keycloakAdmin instance in 09 §12.3, TODO-31 reworded); an account-closure run that closes nothing after an incomplete read of the Keycloak sign-in events, with its alert and SDD §20.1.17, and both jobs' Keycloak calls outside any transaction (customer-accounts §7.3, §7.8; 10 §13.7), with TODO-39 for SDD OI-60 and TODO-41 for SDD OI-61, both Decided - pending application; the 5-minute branch assignment refresh and its 10-minute alert (refund-requests §7.3; 09 §12.1, §12.3; 10 §13.1, §13.7); BRANCH_MANAGER from the API-11 staff sign-in token (refund-requests §7.3; 06 §9.2; 09 §12.1; TODO-28 and TODO-29 reworded to the SDD federation markers); the card-paid amount left in the receipt lookup and 422 `NO_CARD_PAID_AMOUNT_LEFT` at submission (refund-requests §7.3 and the REFUNDS/UC-01 workflow), with TODO-40 for the customer message SDD §17.2 leaves open; the fixed business clock and the Keycloak container of SDD 13a Developer Notes, with tests for the new rules (13 §16.2, §16.3; the two recommended ports in customer-accounts §7.4); the SDD §20.1.15 export keyed by member (10 §13.8); the 10 §13.7 response homes brought in line with SDD §20, with TODO-42 for the two alerts §20 gives no procedure. CONFIRM-23 and CONFIRM-24 (routed by OI-09 and OI-10) answered by the SDD 1.11 Retention Policy and removed. Steps 6a and 6b rerun: no trace or Specs change. Delta review by a cleared-context agent: OI-14 to OI-23, all accepted and applied (the closure judged on the sign-ins its read returned, after a check of the realm's event settings; a per-user guard and a tenant filter for the Keycloak reconciliation, with the `IdentityProviderPort` operations; separate keycloakRequest and keycloakJobs instances; the first-session API-06 read limited to its staff id and the age gauge counted from the oldest `synced_at`; role-source tests; four more §13.7 alerts with no SDD §20 procedure; the §20.1.15 export also by refund reference; the two clocks of the closure), with TODO-43 and CONFIRM-25, TODO-31 and TODO-42 reworded; brought in line: the realm event-settings read of OI-15 among the §7.2 operations, and TODO-42 keeping its best guesses for the give-up and mismatch alerts (OI-21). Scoped application check of OI-14 to OI-23 by a fresh cleared-context agent: each applied text matches its recommendation; it raised OI-24 to OI-28, which stay Open for a new request. Chunks: 03, 04-implementation/customer-accounts.md, 04-implementation/loyalty-points.md, 04-implementation/refund-requests.md, 06, 09, 10, 13, 15, 16, 18 |

## Confidence Flag Summary

| Flag Type | Count | Notes |
| --- | --- | --- |
| TODO | 43 | See §18.2 |
| Confirm | 23 | See §18.3 |
| Drift / code-only / sdd-only / policy | 0 | Not applicable in from-sdd |


<!-- MASTER: refunds-platform-lld-master.md | PREV: none | NEXT: 01-purpose-and-scope.md -->
