# Decision Log - Refunds Platform LLD

**Version:** 1.1 | **Date:** 2026-10-06 | **Runtime:** Codex

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
