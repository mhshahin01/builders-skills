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
| Related SDD | [Refunds Platform 1.8](../sdd-refunds-platform/refunds-platform-sdd-master.md) |
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
| 1.4 | 2026-10-07 | Claude Code (lld-unifier) | from-sdd | Targeted refresh from SDD 1.7 to 1.8 (Changes Log row 1.8: 13a, 18); REFUNDS 1.9 and LOYALTY 1.8 unchanged, both chunk 16 suites Up to date and every chunk 14 Mockup coverage row equal to 14 §17.3, so no trace refresh. The 13a Developer Notes Testing bullet: the customer-accounts code-rule unit tests run on a fixed business clock (SDD §19), so the 15-minute expiry is deterministic (13 §16.2); the sign-up flow and its Keycloak user lifecycle compensations run against Testcontainers PostgreSQL and Keycloak (13 §16.3); §16.6 names the business clock. The other LLD destinations of 13a checked and retained; SDD 18 is input only, with no open, deferred or pending item. 16 §19.1 records SDD 1.8; step 6a rerun, no trace change; step 6b not due (no §1, §6 or §13 change). Delta review by a cleared-context agent: OI-14 to OI-19, all accepted and applied under the request's answer policy (the expiry test asserts `expires_at` itself, with `sent_at` read when the code rows are written and the REFUNDS/TC-ACC-08 and REFUNDS/TC-ACC-14 tags; the destination guard named as an advisory lock with two Testcontainers cases; a forward-only test clock for the integration suites; seven named Keycloak lifecycle cases on a `GenericContainer` loading the realm export; the `BUSINESS_CLOCK_OFFSET` row with its Prod start refusal; `IdentityProviderPort` with its Keycloak adapter, OI-19 also correcting the retained claim of the decision log), with CONFIRM-25 for the two-clock reading of `last_sign_in_at`. Scoped application check by a cleared-context agent: the six answers read as plain implementation text; OI-20 to OI-27 raised on the applied passages, Open and waiting for a later request. Chunks: 04-implementation/customer-accounts.md, 09, 10, 13, 15, 16, 18, decision-log.md |

## Confidence Flag Summary

| Flag Type | Count | Notes |
| --- | --- | --- |
| TODO | 38 | See §18.2 |
| Confirm | 25 | See §18.3 |
| Drift / code-only / sdd-only / policy | 0 | Not applicable in from-sdd |


<!-- MASTER: refunds-platform-lld-master.md | PREV: none | NEXT: 01-purpose-and-scope.md -->
