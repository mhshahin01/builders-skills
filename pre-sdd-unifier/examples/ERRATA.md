# Errata for the worked examples

The Examples README and the eight worked examples in this folder are verbatim copies of external documents (see `SOURCE.md`), and they stay unchanged. This file lists the issues in them that were verified against each example's own stated inputs, targets and text. Nothing that was only suspected is listed.

Quotes are verbatim, Markdown markup included, apart from one change: an em dash is written as ` - ` and an en dash as `-`. Every entry names the file and the section, so the original can be found.

## How each kind of issue was verified

- **Sizing figure:** recomputed with exact arithmetic from the example's own stated inputs and its own formula. A figure is listed when the printed value differs from the recomputed one by more than 1 percent.
- **PASS verdict:** listed when the example's own modeled numbers fail the example's own stated target.
- **Copy-paste leak:** a phrase that names another example's project, system or provider.

## Summary

| ID | Files | Section | Issue |
|---|---|---|---|
| ERR-01 | `PreSDD_GF_CL_Simple.md` | § 3.1 | Year-1 vCPU per domain printed as 4; the example's own formula gives 2 |
| ERR-02 | `PreSDD_BF_CL_Complex.md`, `PreSDD_Examples_README.md` | §§ 3.1, 3.4, 5 and 11; README scenario table | First-pass vCPU per domain printed as 20; the example's own formula gives 18, which changes the figures that follow from it |
| ERR-03 | Seven of the eight examples | § 10, row G6 | `MODELED PASS` although the example's own § 8 finance stress test is over the cap |
| ERR-04 | The four Complex examples | § 6.2, row `CAP-10` | "redemption/charging core" names the cores of two other examples |
| ERR-05 | `PreSDD_GF_OP_Simple.md`, `PreSDD_GF_CL_Simple.md`, `PreSDD_BF_CL_Simple.md` | § 6.6, row `INT-09` | "payroll" names the system of another example |

## ERR-01. GF_CL_Simple: year-1 vCPU per domain

- **File:** `PreSDD_GF_CL_Simple.md`
- **Section:** § 3.1 (Workload → CPU and concurrency), bullet "Year-1 expansion decision"

**Quoted text:**

> **Year-1 expansion decision:** +60% peak traffic raises modeled CPU demand from 0.75 to 1.20 busy cores; maintain a 60% modeled CPU ceiling and N-1 fault-domain tolerance by increasing from **2 → 4 app vCPU per domain**, i.e. **2 additional vCPU** overall in the first year.

**The example's own inputs:** 30 peak TPS at 25 ms CPU per transaction, so 0.75 busy cores (§ 3.1); +60% year-1 growth (§ 2), so 1.20 busy cores; a 0.60 CPU target and one fault domain; the § 3.1 rule `ceil(busy cores / 0.60)`, rounded to an even vCPU count.

**What the example's own numbers give:** `ceil(1.20 / 0.60) = ceil(2) = 2`, which is already even, so the year-1 figure is **2 vCPU per domain** and **0 additional vCPU**. The printed 4 is 100 percent above the recomputed 2. Two vCPU carry 1.20 busy cores at exactly 60%, which is within the stated 60% ceiling; `PreSDD_GF_OP_Complex.md` § 3.1 accepts the same exact point ("Surviving capacity 12 vCPU → estimated 60.0% CPU during peak after one domain loss").

**Correction:** "by increasing from **2 → 2 app vCPU per domain**, i.e. **0 additional vCPU** overall in the first year." These are the words the other three Simple examples print for their own year-1 case.

**Note:** the printed 4 is what binary floating-point arithmetic gives at this exact boundary: `0.75 * 1.6` evaluates to `1.2000000000000002`, which divided by 0.6 gives `2.0000000000000004`, rounds up to 3 and then to the even 4.

## ERR-02. BF_CL_Complex: first-pass vCPU per domain

- **File:** `PreSDD_BF_CL_Complex.md`; the figure is repeated in `PreSDD_Examples_README.md`
- **Section:** § 3.1 (Workload → CPU and concurrency), bullet "N-1 domain sizing"

**Quoted text:**

> **N-1 domain sizing:** `ceil(21.60 ÷ (2 surviving domains × 0.60 max modeled CPU))`, rounded up to even vCPUs = **20 vCPU per domain**, across 3 zones/racks (**60 allocated vCPU**). Surviving capacity 40 vCPU → estimated 54.0% CPU during peak after one domain loss

**The example's own inputs:** 1,800 peak TPS at 12 ms CPU per transaction, so 21.60 busy cores (§ 3.1); 3 fault domains, 2 of which survive one domain loss; a 0.60 CPU target; +50% year-1 growth (§ 2), so 32.40 busy cores; 4 GiB of memory per vCPU (§ 3.4).

**What the example's own numbers give:** `ceil(21.60 / (2 x 0.60)) = ceil(18) = 18`, which is already even, so the first pass is **18 vCPU per domain**. The printed 20 is 11.1 percent above the recomputed 18. These printed figures follow from it:

| Where | Printed text | Printed | Recomputed |
|---|---|---|---|
| § 3.1, N-1 domain sizing | `(**60 allocated vCPU**)` | 60 vCPU | 54 vCPU (18 x 3) |
| § 3.1, N-1 domain sizing | `Surviving capacity 40 vCPU → estimated 54.0% CPU` | 40 vCPU at 54.0% | 36 vCPU at 60.0% (21.60 / 36) |
| § 3.1, Year-1 expansion decision | `increasing from **20 → 28 app vCPU per domain**, i.e. **24 additional vCPU**` | 20 → 28, 24 additional | 18 → 28, 30 additional ((28 - 18) x 3); the 28 stands, since `ceil(32.40 / 1.20) = 27` rounds up to the even 28 |
| § 3.4, Memory envelope | `20 application vCPU/domain × 4 GiB/vCPU = 80 GiB/domain` | 80 GiB per domain | 72 GiB per domain (18 x 4) |
| § 3.4, Memory envelope | `multiply by 3 fault domains for **240 GiB total**` | 240 GiB | 216 GiB (72 x 3) |
| § 5, row `CAP-01/02/04` Demand | `Provision 20 vCPU per fault domain (3 domain(s))` | 20 | 18 |
| § 11, ADR-BF_CL_Complex-003: Scaling | `20 modeled vCPU/domain; 3 fault domain(s)` | 20 | 18 |
| `PreSDD_Examples_README.md`, table "Scenario comparison", row BF_CL_Complex | `20 vCPU × 3 domain(s) (first pass)` | 20 | 18 |

At 18 vCPU per domain the two surviving domains run at exactly 60.0%, within the stated 60% ceiling; `PreSDD_GF_OP_Complex.md` § 3.1 accepts the same exact point ("Surviving capacity 12 vCPU → estimated 60.0% CPU during peak after one domain loss").

**Correction:** 18 vCPU per domain, 54 allocated, 36 surviving at 60.0% CPU after one domain loss; year-1 18 → 28 vCPU per domain, 30 additional vCPU; memory 72 GiB per domain and 216 GiB in total; 18 in § 5, in ADR-BF_CL_Complex-003 and in the README row.

**Note:** the printed 20 is what binary floating-point arithmetic gives at this exact boundary: `21.6 / (2 * 0.6)` evaluates to `18.000000000000004`, which rounds up to 19 and then to the even 20.

## ERR-03. § 10 G6 says MODELED PASS although the § 8 stress test is over the cap

- **Files:** the seven examples in the table below
- **Sections:** § 10 (Decision Tree), row `G6: Economics/operations`; § 8 (Options appraisal and modeled 36-month economics), paragraph "Finance stress test"

**Quoted text:** each file's G6 outcome is quoted in the table. Each file's § 8 stress test reads as below, with that file's own amounts; this quote is from `PreSDD_GF_OP_Complex.md`, and the other six differ only in the two amounts:

> **Finance stress test:** if monthly run costs were 25% above this fictional allowance for all 36 months, modeled TCO would be **$1,850,000** versus $1,700,000 cap - **over budget; renegotiate, redesign or increase cap before final approval**.

**The example's own inputs and formula:** the one-time costs, the monthly run cost and the 36-month cap from § 8 "Preferred candidate TCO arithmetic" (the same figures as § 6.8 `ECO-01`); stress TCO = one-time costs + 36 x monthly run cost x 1.25.

**What the example's own numbers give:**

| File | § 10 G6 outcome as printed | One-time | Monthly | Cap | Stress TCO | Over the cap by |
|---|---|---:|---:|---:|---:|---:|
| `PreSDD_GF_OP_Complex.md` | `MODELED PASS: $1,562,000 < $1,700,000; vendor quotes / staffing not validated` | $410,000 | $32,000 | $1,700,000 | $1,850,000 | $150,000 |
| `PreSDD_GF_CL_Simple.md` | `MODELED PASS: $100,800 < $115,000; vendor quotes / staffing not validated` | $0 | $2,800 | $115,000 | $126,000 | $11,000 |
| `PreSDD_GF_CL_Complex.md` | `MODELED PASS: $4,608,000 < $5,000,000; vendor quotes / staffing not validated` | $0 | $128,000 | $5,000,000 | $5,760,000 | $760,000 |
| `PreSDD_BF_OP_Simple.md` | `MODELED PASS: $297,000 < $330,000; vendor quotes / staffing not validated` | $117,000 | $5,000 | $330,000 | $342,000 | $12,000 |
| `PreSDD_BF_OP_Complex.md` | `MODELED PASS: $1,488,000 < $1,600,000; vendor quotes / staffing not validated` | $480,000 | $28,000 | $1,600,000 | $1,740,000 | $140,000 |
| `PreSDD_BF_CL_Simple.md` | `MODELED PASS: $538,000 < $580,000; vendor quotes / staffing not validated` | $70,000 | $13,000 | $580,000 | $655,000 | $75,000 |
| `PreSDD_BF_CL_Complex.md` | `MODELED PASS: $5,680,000 < $6,000,000; vendor quotes / staffing not validated` | $460,000 | $145,000 | $6,000,000 | $6,985,000 | $985,000 |

In every row the expected model is under the cap, as G6 says, but the example's own stress case is over it, and the example's own § 8 concludes "over budget; renegotiate, redesign or increase cap before final approval". The printed stress amounts equal the recomputed ones. A `MODELED PASS` that does not carry that result reads as a pass the example's own numbers do not support.

**Correction:** report G6 as `CONDITIONAL`, as G4 is, and carry the stress result. For `PreSDD_GF_OP_Complex.md`: `CONDITIONAL: $1,562,000 < $1,700,000 as modeled, but the § 8 finance stress test (+25% run cost) gives $1,850,000, over the cap; renegotiate, redesign or increase cap before final approval; vendor quotes / staffing not validated`. The other six take their own amounts from the table.

## ERR-04. § 6.2 CAP-10 names the redemption and charging cores of other examples

- **Files:** the four Complex examples in the table below
- **Section:** § 6.2 (Capacity and latency), row `CAP-10`

**Quoted text** (identical in all four files):

> Assumed 70% reads / 30% writes across the API request mix (redemption/charging core still transactional); hot-key and burst skew require measured test.

**Whose names these are:** "redemption" names the project of `PreSDD_GF_CL_Complex.md` ("Real-Time Loyalty Credit Redemption API"), and "charging" names the project of `PreSDD_BF_CL_Complex.md` ("Cloud-to-Cloud Real-Time Usage Charging Migration"), whose § 9.2 lists its "Balance charging transaction core".

**What each example's own text gives:**

| File | The example's own critical journey (§ 1) | Name that is not this example's | Correction to the parenthesis |
|---|---|---|---|
| `PreSDD_GF_OP_Complex.md` | Confirm and reserve one production order without double allocation | redemption, charging | `(production-order reservation core still transactional)` |
| `PreSDD_BF_OP_Complex.md` | Accept one dispatch order exactly once during rack failure | redemption, charging | `(dispatch-order core still transactional)` |
| `PreSDD_GF_CL_Complex.md` | Deduct loyalty credits exactly once and return a redemption confirmation | charging | `(redemption core still transactional)` |
| `PreSDD_BF_CL_Complex.md` | Accept a charge and deduct a tenant balance once, with immutable trace | redemption | `(charging core still transactional)` |

## ERR-05. § 6.6 INT-09 names the payroll system of another example

- **Files:** the three Simple examples in the table below
- **Section:** § 6.6 (Integrations and networking), row `INT-09`

**Quoted text** (identical in these three files, and in `PreSDD_BF_OP_Simple.md`, where payroll is that example's own system):

> External HR/payroll/email dependency may be unavailable; fail only dependent noncritical functions and queue work.

**Whose name this is:** "payroll" names the project and the system of `PreSDD_BF_OP_Simple.md` ("Legacy Payroll Reporting Modernization"; its § 4 names its dependencies as "Payroll system of record and approved HR exports"). None of the three files below has a payroll system.

**What each example's own text gives:**

| File | The example's own dependency catalogue (§ 6.6, row `INT-01`) | Correction |
|---|---|---|
| `PreSDD_GF_OP_Simple.md` | `Dependencies: Corporate IdP; internal HR course roster (daily import)` | `External HR/email dependency may be unavailable; fail only dependent noncritical functions and queue work.` |
| `PreSDD_GF_CL_Simple.md` | `Dependencies: Email delivery service and analytics; queue and retry if provider fails` | `External email/analytics dependency may be unavailable; fail only dependent noncritical functions and queue work.` (its catalogue has no HR system either) |
| `PreSDD_BF_CL_Simple.md` | `Dependencies: Directory/SSO, HR roster, SMTP notification and archived KB connector` | `External HR/email dependency may be unavailable; fail only dependent noncritical functions and queue work.` |
