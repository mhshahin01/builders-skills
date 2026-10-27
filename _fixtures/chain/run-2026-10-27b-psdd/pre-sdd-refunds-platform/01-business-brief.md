<!--
CHUNK: 01
TITLE: Business Brief
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00
PART OF: Pre-SDD - Refunds Platform
-->

# 1. Business Brief

## 1.1 Project Header

<!-- ENGINE-FRAGMENT: 01-header.md -->
### HDR-01

**Solution name**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-01.1 | TBD | Refunds Platform | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-02

**Business sponsor**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-02.1 | TBD | Head of Retail | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-03

**Product owner**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-03.1 | TBD | Refunds and Loyalty Product Owner | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-04

**Lead architect**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-04.1 | TBD | Lead Architect, Retail IT | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-05

**Architecture review authority**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-05.1 | TBD | Architecture Review Board | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-06

**Business budget owner**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-06.1 | TBD | Finance Director | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-07

**Change type**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-07.1 | TBD | greenfield | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:30:32.144Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-08

**Intended target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-08.1 | TBD | cloud | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:30:32.144Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-09

**Source platforms**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-09.1 | TBD | None: there is no source platform; refunds are on paper and by phone today | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-10

**Migration direction**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-10.1 | TBD | none | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:36:57.386Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |
<!-- /ENGINE-FRAGMENT -->

## 1.2 Outcome and Why

The Refunds Platform covers two BRDs of one system. The Refunds Portal replaces paper refund records and phone approvals: it cuts the average time from refund request to payout from 10 days to 3 days, loses no request, and gives each branch manager one place to decide ([REFUNDS 01 Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives)). Loyalty Points lets members trust and check their points balance without calling a branch, measured as zero upheld balance complaints a month ([LOYALTY 01 Business Objectives](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives), [LOYALTY/NFR-01](../brd-loyalty-points/10-nfrs.md#non-functional-requirements)). BUS-01.1 holds the outcome. The complaint and portal-share targets (REFUNDS objectives 4 and 5) and the branch-call targets (LOYALTY objective 2) are still open in the BRDs: **[NEEDS CLARIFICATION: What are the target values and dates of REFUNDS Business Objectives 4 and 5 and LOYALTY Business Objective 2?]**

## 1.3 Scope

| In scope | Out of scope | Source |
|----------|--------------|--------|
| Online refund requests for branch purchases; customers follow and cancel their own requests; branch manager decisions in full or in part; payout to the original card; customer messages by email and SMS; refund outcomes sent to Loyalty Points; a daily refund report per branch manager | Refunds for online-shop purchases; cash refunds; a customer mobile app | [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) |
| Earning points on branch purchases; points balance and history for members; taking points back when a refund is paid | Redeeming points; handling member complaints about points and correcting points by hand | [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope) |

BUS-03.1 holds the scope. Each part goes live on its own date; the Refunds Portal starts in a pilot group of branches, and Loyalty Points goes live in all branches at once after business acceptance testing. Point-of-Sale Records (Retail IT team) and CardPay Ltd are hard dependencies (INT-09.1).

## 1.4 Critical Journeys

| Journey | Entry | Failure impact | Priority | Targets |
|---------|-------|----------------|----------|---------|
| Customer refund journey (REFUNDS UC-01 to UC-03) | BUS-02.1 | A lost request or a customer without status | Not stated in the BRDs | CAP-07.1, REL-01.1, REL-03.1, REL-03.2 |
| Branch manager decision and payout journey (REFUNDS UC-04) | BUS-02.2 | Refund money lost or paid twice (REFUNDS/NFR-01) | Not stated in the BRDs | CAP-07.1, REL-01.1, REL-04.1, REL-04.2, REL-10.1 |
| Member points journey (LOYALTY UC-01, UC-02) | BUS-02.3 | Members call branches and lose trust in the balance | Not stated in the BRDs | CAP-07.2, REL-01.2 |
| Points earned on a branch purchase (LOYALTY 03) | BUS-02.4 | A member's balance misses points | Not stated in the BRDs | CAP-09.1, REL-10.1 |

## 1.5 Business Constraints and Obligations

- **Prohibitions (BUS-07):** payouts go only to the card used for the purchase, and the non-goals of both BRDs stand (BUS-07.1, [REFUNDS 02 Constraint 2](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints), [REFUNDS 04 Out of Scope](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope), [LOYALTY 04 Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope)).
- **Obligations (BUS-08):** no customer-facing contract or penalty applies; payouts follow the refund terms agreed with CardPay Ltd (BUS-08.1). The applicable data-protection law (SEC-01.1) is open under EXC-01.
- **Dates and windows (BUS-05):** BUS-05.1 is Open (owner Refunds and Loyalty Product Owner, due 2026-11-20; QD-03).

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-classification-and-path.md -->
