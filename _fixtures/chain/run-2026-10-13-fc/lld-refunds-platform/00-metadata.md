<!--
CHUNK: 00
TITLE: Metadata & Changelog
PROJECT: Refunds Platform
VERSION: 1.2
PART OF: LLD - Refunds Platform
-->

# Low-Level Design Document - Refunds Platform

| Field | Value |
|-------|-------|
| **Document Title** | Low-Level Design - Refunds Platform |
| **Version** | 1.2 |
| **Status** | Draft |
| **Direction** | from-sdd |
| **Date** | 2026-10-10 |
| **Author(s)** | Implementation Designer agent (lld-unifier skill, Claude Code) |
| **Reviewers** | Not named yet |
| **Approvers** | Not named yet |
| **Related BRD(s)** | `REFUNDS` [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md); `LOYALTY` [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| **Related SDD** | [refunds-platform-sdd-master.md](../sdd-refunds-platform/refunds-platform-sdd-master.md) (v1.4) |
| **Source Code Path** (from-code / hybrid) | Not applicable |

---

## Direction Summary

> **How to read this LLD given its direction:**
>
> - **`from-sdd`** - every section was forward-designed from the SDD (and CLAUDE.md defaults). Treat as a build target for the implementer. Patterns are proposals annotated with their triggering CLAUDE.md rule.
>
> This LLD's direction is `from-sdd`: the SDD is a greenfield modular monolith (SDD §1 Project Type: Greenfield) and no code exists yet.

---

## Changes Log

| Version | Date | Author | Direction | Change Summary |
|---------|------|--------|-----------|----------------|
| 1.0 | 2026-10-10 | Implementation Designer agent (lld-unifier skill, Claude Code) | from-sdd | Initial LLD draft, derived from SDD v1.1 (REFUNDS v1.2, LOYALTY v1.3) via lld-unifier. Direction: from-sdd. The acceptance loop applied OI-01 to OI-25 (Recommended Answers accepted by the answer policy). Text brought in line with the applied answers: 16 § 19.3 (OI-21), 16 § 19.5 RB-04 row (OI-11), 07 § 10.6 Mechanics (OI-16), 10 § 13.1 `MSGHUB_RETRY_BASE_DELAY`/`MSGHUB_RETRY_MAX_DELAY` (OI-11, OI-13) and `PAYOUT_RECONCILIATION_CATCHUP_DAYS` (OI-09) and `PROCESSED_EVENT_RETENTION` (OI-03), the payout lease-expiry alert names (OI-18), the `AccessDeniedException` rows of refund-request and loyalty-points § 7.7 (OI-17), 05 § 8.6 cleanup rows (OI-03). The scoped application check raised OI-26 to OI-41: OI-26 to OI-28, OI-30 to OI-34, and OI-36 to OI-41 are decided by the answer policy and pending application (the next request that changes LLD content applies them first); OI-29 and OI-35 stay Open for the user (each needs a design choice). Chunks: none (initial build) |
| 1.1 | 2026-10-10 | Implementation Designer agent (lld-unifier skill, Claude Code) | from-sdd | Refreshed to SDD v1.4 (from v1.1; SDD Changes Log rows 1.2, 1.3, 1.4 list chunks 01-18) and to REFUNDS v1.5 and LOYALTY v1.7, as the SDD Source BRDs register names them, via lld-unifier (request "The SDD has a new version"; the step 3c refresh offer was accepted by the platform standing answer). BRD chunk 14: REFUNDS/MK-04 (branch refund report, no use case) added; BRD chunk 16 still `Locked` in both BRDs. Applied first the decisions that waited for application: OI-26, OI-27, OI-28, OI-30, OI-31, OI-32, OI-33, OI-34, OI-36, OI-37, OI-38, OI-39, OI-40, OI-41. Text brought in line with them: refund-request § 7.2 `RateLimiter` and the REFUNDS/UC-01 idempotency points and Summary (OI-27, OI-28); customer-notification § 7.4, § 7.7 and REFUNDS/UC-04 retry and error text (OI-31, OI-32); 07 § 10.6 `PayoutAttemptFailed` publication text (OI-13, OI-31); 10 § 13.3 gauge note for count gauges (OI-32); 10 § 13.5 job spans (OI-36); 09 § 12.4 redelivery job (OI-37). Refresh carried: card disputes (payout `HELD`, `CANCELLED`, API-09, the dispute events, the dispute copy), payout rounds and a Paid payout sent back, payout resolutions by two `PAYOUT_OPERATOR` staff with the operator endpoints and routes, API-08 `StaffDirectoryPort`, `sequence` ordering, the committed §14.10 DTOs, the four refund outcomes to Loyalty Points, pilot branches and product enablement, the new §11.4 alerts, the §7.3 entry points of REFUNDS/UC-02, REFUNDS/UC-04 and LOYALTY/UC-02, one IAM realm (ADR-07). Chunk 18: OI-05, OI-10, OI-13, OI-18, OI-31, OI-34 superseded (in part) by SDD v1.4; OI-20 reopened by SDD v1.4. The delta review raised OI-42 to OI-53; the acceptance loop applied OI-20 and OI-42 to OI-53 (Recommended Answers accepted by the answer policy); OI-29 and OI-35 stay Open (each needs a design choice; left for later). Text brought in line with them: refund-request § 7.7 Convention and the REFUNDS/UC-04 sequence diagram (OI-42); payout § 7.6 and the § 7.8 control flow (OI-43); payout `findOpenForUpdate`, § 7.7 `ResolutionConflictException` (OI-44, OI-45); 05 § 8.1 ERD and § 8.6 (OI-46, OI-50); customer-notification REFUNDS/UC-04 control flow and the 08 `Message` Summary and Confirm (OI-47); loyalty-points `PointsAccount.recordLeave`, service purposes, the Member leaves and retention control flows and the retention TODO (OI-48); 03 § 6.1 job labels, § 7.5 DI graphs, `RefundRequestGauges` (OI-49); 06 § 9.1 payout note, 10 § 13.1 `REFUNDS_PORTAL_ENABLED`, the 01 glossary guard term (OI-51). Step 6a fixes: two Workflow blocks moved into Participates in REFUNDS/UC-04 blocks (payout card dispute intake, loyalty-points payout sent back outcome), BRD keys on three BR-6 citations, three names brought in line. Chunks: 01, 02, 03, 04-implementation/customer-notification.md, 04-implementation/loyalty-points.md, 04-implementation/payout.md, 04-implementation/refund-request.md, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18 |
| 1.2 | 2026-10-10 | Implementation Designer agent (lld-unifier skill, Claude Code) | from-sdd | Applied the decisions that waited for application (request "Apply the decisions waiting for application in the Refunds Platform LLD (OI-54 to OI-60)"; decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08)): OI-54, OI-55, OI-56, OI-57, OI-58, OI-59, OI-60. SDD v1.4, REFUNDS v1.5, LOYALTY v1.7, and both BRDs' chunk 14 rows unchanged since v1.1 (step 3c: no refresh). The delta review raised OI-61 to OI-66; the acceptance loop applied them in the same update (Recommended Answers accepted by the answer policy); OI-29 and OI-35 stay Open (each needs a design choice; left for later). The scoped application check raised OI-67 (a design choice: it stays Open for the user and waits for a later request). Text brought in line with the applied items: payout `PayoutResolutionRepository.findApplicable` and the closing sentence of `applyOpenResolutions` (OI-55); loyalty-points service purposes, the § 7.2 Authorization member gate, the `recordLeave` SDD note, and the retention service purpose (OI-57); 10 § 13.3 age-gauge note (OI-61); 15 § 18 header note and § 18.5 counts (OI-61; TODO flags 74). Placement: the OI-54 sentence follows the sentence it extends; the OI-59 RB-02 step 4 reference rule sits after "(Idempotency-Key)", and the RB-02 text keeps the code block's plain style (no backticks); the OI-66 label edit reaches the `late` flag TODO in refund-request § 7.8, outside the review's listed files, as the OI-58 edit reached its two places. Chunks: 04-implementation/loyalty-points.md, 04-implementation/payout.md, 04-implementation/refund-request.md, 05, 07, 10, 13, 15, 18 |

---

## Confidence Flag Summary

| Flag Type | Count | Notes |
|-----------|-------|-------|
| `> Confirm:` (medium confidence) | 65 | See `15-open-questions.md` for index. |
| `> TODO: <best-guess> - verify` (low confidence) | 74 | See `15-open-questions.md` for index. |
| `⚠ drift` (hybrid only) | 0 | Not applicable (from-sdd). |
| `🆕 code-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⛔ sdd-only` (hybrid only) | 0 | Not applicable (from-sdd). |
| `⚠ policy` (every direction that reads code) | 0 | Not applicable (no code read). |

<!-- MASTER: refunds-platform-lld-master.md | NEXT: 01-purpose-and-scope.md -->
