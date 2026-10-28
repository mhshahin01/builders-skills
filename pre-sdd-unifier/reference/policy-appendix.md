# Policy appendix: engineering defaults

Version: 1

## Purpose

The Pre-SDD Architecture Standard (`Pre-SDD_Architecture_Standard_v1.md`, in this folder) deliberately sets no defaults of its own, and its capacity check assumes no fixed headroom. Its revision and local policy note says:

> Organization-level guardrails and risk tiers should be added as a separately approved policy appendix rather than silently embedded as assumptions.

This file is that separately approved policy appendix. It holds the engineering factors the Pre-SDD engine uses in its calculations, and the project-rule defaults the engine pre-fills for two register items that are not business facts. The factor values come from the Studio v2.2 preset, and the owner chose to ship them.

## Engineering factors

Approved by Mahmoud (owner) on 2026-10-23 (UTC).

| Factor | Key | Default | Unit |
|---|---|---|---|
| Utilization target | `utilization` | 0.65 | ratio |
| Network overhead | `networkOverhead` | 1.2 | × |
| Index factor | `indexFactor` | 1.4 | × |
| Copies | `copies` | 2 | × |
| Mean latency | `meanLatencyMs` | 120 | ms |
| Calls per transaction | `callsPerTxn` | 3 | calls/txn |
| Request factor | `requestFactor` | 1.1 | × |

The key is the factor's name in the project state. A unit of × is a multiplier. Every project pre-fills these seven factors as `Estimated`, with the source `Default: policy appendix v1`. Each one is an assumption.

## Project-rule defaults

Approved with the build plan by Mahmoud (owner) on 2026-10-23 (UTC).

| Row | Default | When |
|---|---|---|
| OPS-04 | `dev, test, stage, prod` | No REL-05 entry holds `site`, `region` or `provider` |
| OPS-04 | `dev, test, stage, prod, dr` | A REL-05 entry holds `site`, `region` or `provider` |
| CAP-08 | `Ingress edge; successful and failed requests measured separately` | Always |

Every project pre-fills these two items as `Estimated`, of kind assumption, with the source `Default: project rule OPS-04` or `Default: project rule CAP-08`.

## How a project uses them

- A pre-fill never replaces an answer, a BRD value or a confirmation. It updates only values it wrote itself, under its own source text; a default or derived value that another agent cited stays as it is.
- A default that nobody has confirmed follows its rule. OPS-04 gains or loses `dr` as the REL-05 entries change, and a new appendix version updates the factors.
- A factor on an item marked N/A is not pre-filled.
- A person confirms them per group. The factors sit on rows CAP-02, CAP-04, CAP-06, CAP-07 and DAT-02, so they are confirmed with the Capacity and Data groups; OPS-04 and CAP-08 are confirmed with the Operations and Capacity groups. Under an answer policy, the policy may confirm them instead, and the policy is then recorded as the confirmer.
- A person may replace any default with a value for the project. To keep an item empty, a person clears it: the item stays open, and the pre-fill does not fill it again. To get the default or derived value back, a person reopens the item with `open`, and the next pre-fill fills it again.
- Once a person sets a kind of their own on a pre-filled item, the pre-fill stops maintaining the item's value. It no longer fills or updates the value, and when the inputs change, it clears the value for the person to fill. The person's kind stays. A kind that matches the pre-fill's own (assumption for a default, forecast for a derived value) does not stop the pre-fill.
- An agent or an answer policy may not change a kind that a person set. It may change any other kind, with a reason.
- An agent may propose a value beside an item a person left open, because a proposal helps exactly when the person does not know the value. Only a person may accept a proposal there.

## Changing the appendix

A change to any value or rule needs the owner's approval and a new appendix version. The engine holds the same version, approval and factor values in `APPENDIX`, and the same rules in its project defaults (`studio/src/engine.js`). `studio/tests/defaults.test.mjs` fails when either table and the engine differ.
