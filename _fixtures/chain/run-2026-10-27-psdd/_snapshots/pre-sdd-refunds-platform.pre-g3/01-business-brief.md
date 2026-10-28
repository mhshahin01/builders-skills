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
| HDR-01.1 | TBD | Refunds Platform | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-02

**Business sponsor**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-02.1 | TBD | Head of Retail | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-03

**Product owner**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-03.1 | TBD | Refunds and Loyalty Product Owner | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-04

**Lead architect**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-04.1 | TBD | Lead Architect, Retail IT | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-05

**Architecture review authority**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-05.1 | TBD | Architecture Review Board | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-06

**Business budget owner**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-06.1 | TBD | Finance Director | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-07

**Change type**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-07.1 | TBD | greenfield | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:35:16.514Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-08

**Intended target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-08.1 | TBD | cloud | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:35:16.514Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-09

**Source platforms**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-09.1 | TBD | None: there is no source platform; refunds are on paper and by phone today | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |

### HDR-10

**Migration direction**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| HDR-10.1 | TBD | none | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:30.023Z) | Fixture: Product Owner stand-in (test-run policy) | TBD | TBD |
<!-- /ENGINE-FRAGMENT -->

## 1.2 Outcome and Why

The Refunds Platform is one system built from two BRDs: the Refunds Portal ([REFUNDS 01](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives)) and Loyalty Points ([LOYALTY 01](../brd-loyalty-points/01-executive-summary-and-context.md#business-objectives)). Its outcome is BUS-01.1: refunds move from paper and phone to a recorded online flow, the average time from request to payout falls from 10 days to 3 days, no refund request is lost, and members trust and check their points balance without calling a branch. The complaint and portal-share targets of REFUNDS Business Objectives 4 and 5 and the branch-call targets of LOYALTY Business Objective 2 are not stated in the BRDs; BUS-01.1 records them as not stated.

## 1.3 Scope

| In scope | Out of scope | Source |
|----------|--------------|--------|
| Online refund requests for branch purchases, follow and cancel, branch manager decisions in full or in part, payout to the original card, email and SMS messages, refund outcomes to Loyalty Points, a daily branch refund report | Refunds for online-shop purchases, cash refunds, a customer mobile app | [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) |
| Points earned on branch purchases, points balance and history, points taken back after a paid refund | Redeeming points, handling points complaints, correcting points by hand | [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope) |

BUS-03.1 holds the scope as the register states it. The Refunds Portal starts in a pilot group of branches; Loyalty Points goes live in all branches at once; neither waits for the other.

## 1.4 Critical Journeys

| Journey | Entry | Failure impact | Priority | Targets |
|---------|-------|----------------|----------|---------|
| Request a refund (REFUNDS/UC-01) | BUS-02.1 | The customer cannot record a refund request online; without the receipt lookup the customer is asked to try again later | TBD | CAP-07.1, REL-01.1, REL-03.1, REL-03.2 |
| Track a refund request (REFUNDS/UC-02) | BUS-02.2 | The customer cannot see where a request stands (Business Objective 2) | TBD | CAP-07.1, REL-01.1 |
| Cancel a refund request (REFUNDS/UC-03) | BUS-02.3 | The customer cannot withdraw a Submitted request | TBD | CAP-07.1, REL-01.1 |
| Approve or reject a refund, and the payout (REFUNDS/UC-04) | BUS-02.4 | Decisions and payouts wait; a failed payout is tried again and the branch manager is told after one day | TBD | CAP-07.1, REL-01.1, REL-03.1, REL-04.1 |
| View the points balance (LOYALTY/UC-01) | BUS-02.5 | The member is asked to try again later and is never shown a balance of 0 | TBD | CAP-07.2, REL-01.2 |
| View the points history (LOYALTY/UC-02) | BUS-02.6 | The member cannot see where the points come from | TBD | CAP-07.2, REL-01.2 |
| Earn points on a branch purchase (LOYALTY 03) | BUS-02.7 | Points show late; a purchase that arrives late keeps its purchase date | TBD | CAP-01.1, CAP-09.1 |

No BRD gives a journey priority, so the Priority column reads TBD.

## 1.5 Business Constraints and Obligations

- **Prohibitions (BUS-07):** BUS-07.1: payouts go only to the card used for the purchase, and the non-goals of both BRDs stand ([REFUNDS 02](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints), [REFUNDS 04](../brd-refunds-portal/04-scope-and-personas.md#out-of-scope), [LOYALTY 04](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope)).
- **Obligations (BUS-08):** BUS-08.1: no customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider. The tax records of [REFUNDS/NFR-07](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) wait on the countries of operation (QD-05).
- **Dates and windows (BUS-05):** BUS-05.1 is `Open` (Refunds and Loyalty Product Owner, 2026-11-20; QD-01). **[NEEDS CLARIFICATION: What is the launch date of each part, and the pilot group, length and branch order of the Refunds Portal?]**

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 00-cover-and-changelog.md | NEXT: 02-classification-and-path.md -->
