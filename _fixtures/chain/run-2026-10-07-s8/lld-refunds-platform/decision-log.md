# Decision Log - Refunds Platform LLD

**Version:** 1.3 | **Date:** 2026-10-07 | **Runtime:** Codex (1.0 to 1.2), Claude Code (1.3)

## Run choices

User brief authorizes R2 only, chunks, from-sdd, project Refunds Platform. All SDD §13 modules are in scope. Project Type Greenfield comes from SDD §1. Recommended/default choices are accepted; no new business behavior is authorized. No git state change. Body -> trace reconciliation -> Specs -> separate disk reviewer -> answer/apply -> indexes/handoff.

## Test-fixture clarifications

| ID | Question / source home | Fixture answer | Named owner | Application |
| --- | --- | --- | --- | --- |
| FX-01 | Tenant business zone, SDD §6 | America/Chicago for corrections and monthly report; branch dates retain their own configured zones | LOYALTY owner | §13.1 / ledger tests; parent SDD remains unchanged |
| FX-02 | Waiting-summary hour, SDD 13b | 09:00 branch local, once each business day | REFUNDS owner | §13.1; implements the stated daily message |
| FX-03 | Staff lawful basis, SDD §11.6 | Legitimate interests Article 6(1)(f) for staff operations/correction audit; source seven-year refund evidence uses the refund legal obligation | Data Protection Officer | §14.6 fixture clarification; not production approval |
| FX-04 | Human on-call assignment, SDD §20 | Retail Platform duty engineer, with REFUNDS/LOYALTY owners and DPO for their decisions | Retail Platform owner | §13.9; no new application role |

Technical version/provider/security-policy gaps remain source TODOs; they cannot be answered with invented library pins or provider interfaces. Existing approved mockups are consumed, not reopened by this LLD.

## Review decisions

Fixed test PM accepts recommended option A for OI-01 through OI-07; applied in initial 1.0. OI-08 rejects bulk actions, persistent preferences and points-history export: out of scope for this release (test-fixture policy). Each option, evidence and resolution is in [chunk 18](./18-open-items-and-clarifications.md). No source BRD/SDD behavior changed.

## Approved CHK correction update - 2026-10-06

The user approved the CHK proposals in Codex. Restore the canonical Controllers structure, qualify six bare BRD IDs by their owning BRD, and remove the three annotations that are absent from SDD section 7.3. Keep all 15 source-registered annotations. This is one LLD content update to 1.1; the parent SDD row records 1.1 and SDD 1.3. No endpoint, permission or business flow changed. Original fixture decisions and OI-08 rejection remain in force.

## R3d targeted refresh - 2026-10-06

The user's explicit R3d go and standing recommended-answer policy accept one combined CHUNKS / from-sdd refresh from SDD 1.3 to 1.5 and REFUNDS 1.7 to 1.9 / LOYALTY 1.7 to 1.8. Source versions agree with the parent register; both BRDs are In Review with chunk 16 Up to date, and the SDD is finished with E2E Open - Up to date. Every changed SDD chunk is mapped in the R3d audit, including destinations already faithful. Screen/UC mappings are read row by row; routes stay the same. One update, one LLD version bump to 1.2.

BO-01 and BO-02 refresh report algorithms, transport/presentation handling and tests; owner-only business calculations stay outside the product. BO-03 settles the shared Retail IT staff source, not API-06/API-11's provider-owned contracts. BO-04 keeps the existing cap lock/arithmetic and cites the current requirement and acceptance evidence. No source test is executed or signed off.

**FX-03 superseded by SDD v1.5:** [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default), BO-05, supplies the Data Protection Officer-owned fixture answer. The deciding branch-manager id uses the same staff legitimate-interest basis; the customer refund-record obligation supplies no separate staff basis. §14.6 now references that single home. The earlier row remains historical, not an active competing answer. This is not real DPO approval.

SME-05 stays Rejected: out of scope for this release (test-fixture policy). The portal-paid source and SDD R-09 gap remain. Existing OI-01 to OI-08 are checked against the refresh; none is settled, superseded or reopened by these changes. Author TODO/Confirm gaps remain technical implementation or provider gaps; none was answered by a business clarification.

**R3d delta review:** separate disk reread of existing OIs/flags, source deltas, refreshed body and Specs; eleven surfaces per changed module plus global contract/Specs/trace checks. Zero new OI; seven resolved and one rejected items remain closed. Mermaid text/manual heuristics only; no application test execution.

## SDD 1.7 targeted refresh - 2026-10-07

Request: "the SDD has a new version". Step 3c read SDD Changes Log rows 1.6 (Chunks: 01, 06, 13e, 18, 19) and 1.7 (Chunks: 01, 02, 11, 18, 19) since the recorded SDD 1.5. REFUNDS 1.9 and LOYALTY 1.8 equal the parent register and their masters, both chunk 16 suites stay Up to date, and every chunk 14 Mockup coverage row equals its 14 §17.3 rows, so no BRD trace refresh fired. The fixed test policy accepts the one refresh offer: one CHUNKS / from-sdd update, LLD 1.2 to 1.3, scope the LLD chunks the field mapping sends those SDD chunks to, plus 16 §19.1 and this LLD's Child LLDs row.

Mapped and changed: SDD 01 (§3 Assumptions 7 and 8) into 01 §3 A-01 and A-04; SDD 11 (API-07, API-08 and API-09 asked as calls, the API-09 secret per tenant) into the 06 §9.1 TODOs and their chunk 15 rows; SDD 13e (Figure 27, Tables Design keys and indexes, Retention Policy order) into 05 §8.1, §8.2 and §8.6, loyalty-points §7.3 and 13 §16.3. Mapped and retained after checking: SDD 01 §1 and §4 R-08 (Mission and loyalty matching unchanged), SDD 02 §6 Secrets Management (its Notes cell is not part of §6.3; every provider credential is already Vault per tenant), SDD 06 ADR-01 Why (03 §6.4 and 16 §19.2 cite ADR-01 only), the provider-side loyalty-points rows for API-07 to API-09 (already provider routes that map the credential to a tenant), and SDD 19 (02 §5.4 and the choreography sections cite no changed §24 text; notifications §7.3 already reads API-13 per recipient and channel). SDD 18 has no field mapping row. Steps 6a and 6b reran: no trace, route, index or Specs change. Existing OI-01 to OI-08 are checked against the change; none is settled, superseded or reopened.

**1.3 delta review:** a cleared-context reviewer agent (Claude Code) read chunk 18 first and reviewed the 1.3 Changes Log chunks and the SDD 1.5 to 1.7 change behind them: OI-09 to OI-13, none re-raising OI-01 to OI-08 and none settling, superseding or reopening them. The fixed test policy accepts each recommended option A, since none adds business behaviour that no BRD states: OI-09 (due periods oldest first, pre-start purchases in the first period's set, member rows last) and OI-10 (the same-day aware notice match and the last-period sweep) follow LOYALTY 03 and the SDD 13e Retention Policy, with the two cases that policy does not name routed to sdd-unifier as CONFIRM-23 and CONFIRM-24; OI-11 (an always-locking purchase_lock acquisition) and OI-12 (`importOpeningBalance`, per-record transactions for `LoyaltyFeedAdapter`, the error answer for a call with a failed record; the API-09 run mapping stays TODO-38 for its SDD home) are technical; OI-13 removes A-01, whose assumption and owner live in SDD §3. The retained provider-side rows above now carry the OI-12 transaction rule. No owner question was answered with a fixture value.
