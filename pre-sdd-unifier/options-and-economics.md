# Options and economics

Stage 3 compares the candidate shapes the system could take and what each costs. The Standard's trade-off worksheet sets the method (§ 9.4): first eliminate every candidate that cannot satisfy the hard constraints, then compare the rest with weights the business or architecture authority approved explicitly. Never invent a weight, and never call one option better without evidence.

The engine holds the options and computes every number: each option's hard-constraint result, its TCO (`CALC-21`), and its weighted score (`CALC-22`) (`computeOptions` in `studio/src/engine.js`). Chunk 07 carries the engine's options fragment unchanged. This file says what an option is, who gives which part of it, and how the engine compares them.

Read this file at step 9 (stage 3) and step 10 (stage 4, the chosen option).

---

## An option is a shape

An option is a shape-level candidate, never a product: for example "one region, multi-AZ" against "two regions, warm standby". It never names a product, a version, or the architecture style (for example monolith or microservices). `hybrid` below is a hosting or network value, never a style. An option names a provider only when the business makes the provider a hard constraint. The SDD picks the products within the chosen shape (`handoff-guide.md`).

The skill names each option with the `set-option` op: a name (a short shape-level summary) and a shape of five parts. The engine gives it the next `OPT-NN`.

| Shape part | Takes | Checked |
|---|---|---|
| `hosting` | `onprem`, `cloud`, or `hybrid` (`undecided` counts as not chosen) | Against a hard HDR-08, and for a `provider` failure scope |
| `topology` | `single`, `multiAZ`, `multiAZActive`, `regional`, or `active` | Against the named failure scopes |
| `dr` | `localHA`, `backup`, `pilot`, `warm`, or `active` | Against the named remote failure scopes (site, region, provider) |
| `network` | `public`, `private`, `hybrid`, or `partner` | Against a hard INT-08 |
| `data` | Shape words, for example "relational, strongly consistent, synchronous within the region" | Not checked; descriptive only |

Which options to name:
- The engine's target shape (chunk 05) as one option, so the comparison includes the shape the engine derives from the register.
- The credible alternatives the register leaves open, for example a stronger or a cheaper DR strategy for a scope, or another topology.
- With an undecided target (HDR-08 `undecided`), one option per placement the person allows, so the placements are compared before the path is classified (`classification-and-paths.md`).
- "Do nothing" or "retain" where it is meaningful (Standard § 10.2).

Use the same worksheet for every shape decision the Pre-SDD settles: hosting, topology, DR strategy, data shape, network shape, and, with the overlay, the migration approach (Standard § 9.4). Products and the deployment style stay with the SDD.

Rename or reshape an option with `set-option`, or leave it unchosen with its result shown. Renaming or reshaping an option sends its confirmed costs and scores back to `Estimated`, because they were confirmed for the old shape. A person (or a fixture owner) may remove an option with `remove-option`. The engine refuses it while the option is the chosen one (clear the choice first with `decide`, `option: null`). The removed option's `OPT-NN` is never used again.

---

## The hard-constraint filter

The engine checks each option against what its shape can express, never against the state's own decisions:

- **Hosting:** when HDR-08 holds `onprem`, `cloud`, or `hybrid` and its kind is `hard`, the option's hosting must equal it.
- **Network:** when INT-08 holds a value and its kind is `hard`, the option's network must equal it.
- **Topology and DR:** when at least one REL-05 entry names a failure scope, the engine runs its shape-conflict check with the option's topology, the option's DR strategy for every remote scope, and the option's hosting. Any conflict fails the option. For example, `localHA` with a remote scope fails as `CONFLICT-local-dr`, and two regions of one cloud provider fail a `provider` scope as `CONFLICT-provider`.
- **Excluded:** an option a person excluded with `exclude-option` fails, with the entry it breaks and the person's reason (below).

Each option's hard result is one of three:

| Result | When | Effect |
|---|---|---|
| `true` | No check fails and every applicable check could run (also when no check applies) | The option may be ranked and chosen. |
| `false` | At least one check fails | Never ranked, never chosen. Its `failures` name each check (`hosting`, `network`, `topology-dr`, or `excluded`), the entry or conflict it rests on, and the message. |
| `null` | No check fails, but a check could not run, because a shape part it needs is blank or outside its vocabulary | Not ranked until the shape is completed. Its unknowns name each check that could not run, and why. |

G2 needs at least one option whose result is `true` (`gates-and-signoff.md`).

**Hard entries the engine does not check.** A shape cannot express every hard entry. The defaults make these entries hard:
- BUS-07 (prohibitions);
- BUS-08 (commercial and legal obligations);
- SEC-01 (applicable laws and policies);
- SEC-04 (encryption and key custody);
- DAT-03 (sensitivity);
- DAT-04 (residency);
- DAT-06 (retention and erasure).

A person may make others hard. For each option, chunk 07 lists each hard entry the engine does not check and whether the option meets it, with the entry ID and the evidence. A person reviews that list at the G2 review stop. An option that breaks one is out (DT-04). The skill records it with `exclude-option` (the option, the entry it breaks, and the reason) under the name of that person. The engine then fails the option with the check `excluded`, so it is never ranked, chosen, or shortlisted, and the options fragment shows the failure. `include-option` lifts an exclusion that no longer holds. The engine refuses to exclude the chosen option: clear the choice first with `decide`. When ambiguity remains about a residency or compliance restriction, the Standard asks for a review by the compliance authority: record it as an unknown (`QD-NN`) with its owner and due date.

---

## The criteria

The criteria are the columns of the Standard's worksheet after "Hard constraints pass?", which is the hard result above.

| Criterion | Worksheet column |
|---|---|
| `nfr_fit` | Meets measurable NFRs? |
| `one_time_cost` | One-time cost |
| `recurring_tco` | Recurring TCO |
| `delivery_time` | Delivery time |
| `operability` | Operability/skills |
| `security_compliance` | Security/compliance |
| `reversibility` | Reversibility/lock-in |
| `uncertainty` | Uncertainty / PoC evidence |

---

## Who gives what

| Part | Op | Who gives it | Notes |
|---|---|---|---|
| The options and their shapes | `set-option` | The skill names them; a person may add or change one | Shape words only. |
| An option that breaks a hard entry | `exclude-option`, `include-option` | A person (or a fixture owner), at the G2 review stop | The entry it breaks and the reason; never the chosen option. |
| Removing an option | `remove-option` | A person (or a fixture owner) | Never the chosen option; its `OPT-NN` is never used again. |
| Scores, 1 to 5 per criterion | `set-score`, then `confirm` | The skill proposes each score with a one-line reason, as `Estimated` (the architect's assessment); a person confirms it | An answer policy never sets or confirms a score: the engine refuses it (decision 6). Once a score is confirmed, only a person (or a fixture owner) changes it. |
| One-time and monthly cost per option | `set-cost`, then `confirm` | A person (or a fixture owner in a test run) | A cost is a fact only a person gives: the engine refuses the skill and an answer policy, and never takes a cost from a worked example or a guess. |
| The TCO horizon, in months | `set-horizon` | A person (or a fixture owner) | ECO-03's owners, business and finance. A whole number of months, 1 or more. |
| The criterion weights | `set-weights` | A person (or a fixture owner), recorded with who approved them and when | Each weight is a number, 0 or more, and at least one is above 0. The engine refuses the skill and an answer policy. |
| The chosen option | `decide` (`option`) | A person (or a fixture owner), in stage 4 | Only an option whose hard result is `true`; `option: null` clears the choice. |

A score says how well the option does on that criterion. A score of 1 is the worst and a score of 5 the best. So on a cost criterion 5 is the cheapest, and on `uncertainty` 5 is the best evidence. A higher weighted score ranks higher. Each proposed score cites its evidence in its reason: the register entry, the calculation, or the conflict it rests on. A score the evidence cannot support stays unproposed, and its gap is an unknown.

Ask for the costs, the horizon, and the weights together, in the usual batches (`stages-and-input.md`). They are the person's numbers, never proposed. A missing cost or horizon leaves its result `TBD`. The engine names it among the option's unknowns. Record each as an unknown (`QD-NN`) with its owner and due date. Missing weights give no unknown: the comparison is flagged `UNWEIGHTED` (below), with no weighted score.

---

## TCO and the weighted score

**TCO** (`CALC-21@OPT-NN`, one row per option): one-time cost plus horizon months times monthly cost. It is undiscounted: no discount rate, inflation, or price change over the horizon. It reads `TBD` when the one-time cost, the monthly cost, or the horizon is missing, and the option's unknowns name the missing input. Show TCO beside the budget envelope (ECO-01) for the person to read (DT-10); the engine does not compare them.

**Weighted score** (`CALC-22@OPT-NN`): the sum of weight times score over the sum of the weights, counting every criterion with an approved weight above 0. A weight of 0 means the criterion does not count. The engine gives a weighted score only when all of these hold:
- the weights are approved: a weight above 0, who approved them, and a valid UTC time;
- the option's hard result is `true`;
- every counted criterion has a score.

Otherwise it is `TBD`, and the option's unknowns name each missing score. An option is never ranked while its hard result is not `true`.

**Flags.** The engine flags the comparison:
- `UNWEIGHTED`: no approved weights. The comparison shows the scores side by side, with no weighted score and no ranking, because the Standard forbids invented weights.
- `ESTIMATED-SCORES`: a score counted in a weighted score is still `Estimated`. The ranking stands only once those scores are confirmed.

Every held score counts, `Estimated` or `Confirmed`. Chunk 07 shows the flags with the comparison and states what they mean.

---

## Choosing an option

In stage 4 the person chooses the option with the `decide` op (`option`), and the engine refuses one whose hard result is not `true`. The skill writes the decision under the name of the person who decided (on the web path the Studio writes it). The engine refuses the skill acting on its own. An answer policy never chooses. The engine computes no recommended option for it to take, and refuses it.

- **More than one viable option (DT-12):** the comparison runs against the approved criteria and weights, and chunk 09's ADR candidates record the comparison and the reason for the choice.
- **Only one feasible option (DT-13):** chunk 09 records the constraints that eliminated the others, each from its option's failures; validation is still required.
- Record the reason for the choice, the technical assumptions, the pilots still needed, the cost sensitivities, and the condition that would reverse the decision (Standard § 9.4). Put them in `decision-log.md` and in ADR-DR-001 in chunk 09 (its option comparison, its decision and rationale, and its conditions and review trigger). They never go into the `decide` op. It takes `reason` only with a topology or DR override, as that override's reason. The engine refuses a `reason` with no override.

The chosen option is part of the decisions, so it is in the signed content: a change after G3 sends G3 back to review. The locked-items fragment carries it to the handoff guide.

---

## Light run

A light run (`SKILL.md` § Light run) keeps the engine run and the hard-constraint filter, and limits chunk 07 to:
- the recommended shape and one alternative;
- no weighted comparison unless the weights are already approved. Without approved weights, the two options are compared side by side and flagged `UNWEIGHTED`.

The options fragment lists every option in the project state, light run or not, and stands as the engine wrote it. In a light run the skill names only the two options, so the fragment holds those two.

The costs, the horizon, and the weights still come only from a person.
