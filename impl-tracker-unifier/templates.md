# Templates

Exact templates for every file the skill writes in `./tracking/`. Replace `<rel>` with the relative path from the written file to the doc heading.

## `tracking/config.md`

~~~markdown
# Tracking config

| Key | Value |
|---|---|
| Code root | . |
| Docs root | ../acme-platform |
| Board | ../acme-platform/unifier-status.md |
| Current phase | AUTOAPPLY: P1 |
| Commit trailer | Task: <KEY/T-NNN>; tracking-only commits of no single task: Tracking: <reason> |

## Audit checks

| Check | Command | Layer |
|---|---|---|
| Migrations valid | <e.g. ./mvnw flyway:validate> | db |
| API spec diff | <e.g. oasdiff breaking api/openapi.yaml build/openapi.yaml> | api |
| Frontend types | <e.g. npx tsc --noEmit> | ui |
| Log/security rules | <e.g. semgrep --config .semgrep/> | logs, security |

## Preflight

| Item | Value |
|---|---|
| Compose file | <e.g. docker-compose.yml, or -> |

## Preflight suites

| Suite | Command | Reports | Required when |
|---|---|---|---|
| backend | <e.g. cd api && mvn -B -q clean test> | <e.g. api/target/surefire-reports/TEST-*.xml> | paths: api/ |
| frontend-app | <e.g. cd web && npx ng test app --watch=false --reporters=junit --output-file=test-results/app.xml> | <e.g. web/test-results/app.xml> | paths: web/ |
| frontend-admin | <e.g. cd web && npx ng test admin --watch=false --reporters=junit --output-file=test-results/admin.xml> | <e.g. web/test-results/admin.xml> | paths: web/ |

Prefer `paths:` over `always`, so a suite runs only when its own code changed; `paths: web/; not: web/e2e/` excludes prefixes (e2e specs never re-run the unit suites). Required suites run in parallel, so no two suites share a build directory or a report file (pre-flight
deletes each suite's `Reports` matches before its run). Split independent projects (two Angular apps) into
their own rows so they run side by side.

## Always-run tests

Run by `preflight.py --quick` (and first in the full pre-flight) with the task's own test classes, the test
classes that name a table the task's migrations write (P16), and the covering tests of its changed classes:
cross-cutting rules a task can break without touching their files (module/architecture rules, schema version
gates, full table or index lists). List here only what those three cannot find.

| Test class | Why |
|---|---|
| <e.g. ModuleArchitectureTest> | <module and adapter boundaries> |

## Mutation suites

| Suite | Command | Report | Path prefix | Ext | Exclude |
|---|---|---|---|---|---|
| backend | <e.g. cd api && mvn -B -q test-compile org.pitest:pitest-maven:mutationCoverage -DtargetClasses={classes} -DoutputFormats=XML -DtimestampedReports=false -Dthreads=4> | <e.g. api/target/pit-reports/mutations.xml> | api/src/main/ | .java | <optional globs, e.g. `*Constants.java`> |
| frontend | <e.g. cd web && npx stryker run --mutate {files} --reporters json> | <e.g. web/reports/mutation/mutation.json> | web/ | .ts | <optional globs, e.g. `*-constants.ts`> |

Pre-flight P10 runs these after the test suites pass, **only on the task's changed production files**
(`{classes}` = Java class names, `{files}` = paths relative to the prefix), so a run takes minutes, not an
audit round. A mutant that survives fails P10 unless the card's `## Equivalent mutants` lists its
`File.ext:line` with a reason. Quote the line's code in a second backtick group (P10 prints it): the
entry then also matches after the line moves, so an edit above it never forces a rerun. `--mutate` runs
the same suites locally on the task's own tests first (minutes, L-060). The full P10 targets the covering
tests (the task's tests, tests naming a changed class or its interfaces, tests in its package); survivors
are re-checked against the suite default for their classes only (Spring beans and constructors run only
while a context starts), so a run takes minutes. This replaces the hand sweep (L-046): the builder fixes survivors before the
audit; the auditor reads the report. PIT needs the `pitest-maven` plugin with `pitest-junit5-plugin` in
the pom; Stryker needs `@stryker-mutator/core` and its runner. No table → P10 is INFO (not checked).

What P10 skips (L-054); everything else still needs a killing test or a reasoned card line:
- **Files with no logic** are never mutated: `*-options.ts`, `*.routes.ts`, `guides.ts`, `index.ts`, tool
  configs, plus the suite's `Exclude` globs (comma-separated, matched on the file name or the path).
- **Starting values (auto):** a surviving BooleanLiteral, ArrayDeclaration or ObjectLiteral mutant on a field or
  constant declaration line (`readonly x = signal(false)`, `o = { … }`, `private y: T | null = null`), and a
  StringLiteral there only inside `signal(…)`, `model(…)` or `input(…)`. The P10 row lists them as
  `auto (initial values, L-054): file:line mutator` so the auditor still sees them; they never fail P10.
- **Still checked:** number literals (limits), constant strings (UI messages), `computed(…)` and arrow-function
  fields, and every condition, call, return and statement in components, services and pages.

## Verify worktree

| Item | Value |
|---|---|
| Path | <e.g. ../verify: a permanent `git worktree add --detach`, outside the checkout the IDE runs; or -> |

Pre-flight runs here, never in the checkout the user runs from the IDE. Move it to the head before each
pre-flight; only dependency folders survive, so installs run only when the lock file changed:

```bash
V=<path>; H=<task head sha>; OLD=$(git -C "$V" rev-parse HEAD)
git -C "$V" clean -ffdx -e '**/node_modules'   # first: a report left from the last run would block the checkout
git -C "$V" checkout --detach "$H" && test "$(git -C "$V" rev-parse HEAD)" = "$(git rev-parse "$H")"
git -C "$V" diff --quiet "$OLD" "$H" -- '*package-lock.json' || (cd "$V/<frontend dir>" && npm ci)
```

Copy `tracking/<KEY>/preflight/<T-NNN>-<sha>.md` back into the main tracking folder before committing it.

## Delivery

| Item | Value |
|---|---|
| Push after Done | ask, or `auto (user: "<quote>", <date>)`: push once after each wave's last Done task, only when `--push-check` passes |

## Doc updates (doc-impact-rules.md § 4)

| Item | Value |
|---|---|
| LLD | auto |
| SDD | auto |
| BRD | ask, or `auto (user: "<quote>", <date>)` |
| SoW | ask |
| Docs repo | ../acme-platform (the worker commits there with `Docs: KEY/DU-NNN`; never pushes) |

## Slices (slice mode only)

| Key | Order | Current |
|---|---|---|
| PLATFORM | S-01, S-03, S-05, S-06 (user: "<quote>", <date>) | S-01 |

`auto` is valid only as `auto (user: "<quote>", <date>)`, written when the user says so in chat; any other
value means ask.

## Standing rules (promoted lessons)

| Lesson | Rule | Check |
|---|---|---|

## Features

| Key | BRD master | SDD §7.3 | LLD master | LLD 04-implementation | Baseline (BRD / SDD / LLD) | Mode |
|---|---|---|---|---|---|---|
| AUTOAPPLY | features/job-manager/brd-acme-autoapply/acme-autoapply-brd-master.md | tech/sdd-acme-platform/03-users-and-use-cases.md#73-… | tech/lld-acme-autoapply/acme-autoapply-lld-master.md | tech/lld-acme-autoapply/04-implementation/autoapply.md | v1.3 / vX / v1.4 | layer |
~~~

## `tracking/index.md` (generated - one line per task)

~~~markdown
| ID | Title | Phase | Slice | Layer | Status | depends_on | UC | Agent | Updated |
|---|---|---|---|---|---|---|---|---|---|
| AUTOAPPLY/T-001 | Flyway: autoapply schema baseline | P1 | - | data | Done | - | - | codex | 2026-10-18 |
| AUTOAPPLY/T-014 | RoutingServiceImpl.route (Review only) | P2 | - | domain | Planned | T-009, T-011 | UC-23 | - | 2026-10-19 |

Slice is `-` for keys in layer mode. In slice mode, a second table follows: `| Slice | Order | Title | Status | Tasks done / total | Delivered |`.
~~~

## Task card `tracking/AUTOAPPLY/tasks/T-014-routing-service-route.md`

~~~markdown
# AUTOAPPLY/T-014 - RoutingServiceImpl.route (Review mode)

| Field | Value |
|---|---|
| Status | Planned |
| Phase / Layer | P2 Review mode / domain |
| Slice | - (slice mode: `KEY/S-NN` title) |
| depends_on | AUTOAPPLY/T-009 (CapCalculator), AUTOAPPLY/T-011 (match repository) |
| Unblocks | AUTOAPPLY/T-017, AUTOAPPLY/T-022 |
| Size | M (one session) |
| Risk | high (concurrency: send-record claim) |
| Agent / started / finished | - |
| Start commit | - |
| Layers to touch | api (LLD 6.2) · db (LLD 5.1) · logs (LLD 11.3) |

## Goal
Route a new match to Quick Review or drop it, per Review-mode rules.

## Realises
- [AUTOAPPLY/UC-23](<rel>#uc-23-route-a-new-match) steps 1-4; AC-1: score at threshold approves; A1: review queue full
- Test cases: [AUTOAPPLY/TC-RTE-01](<rel>), [AUTOAPPLY/TC-RTE-03](<rel>)

## Implements (LLD / SDD)
- [LLD 7.3 `RoutingServiceImpl.route`](<rel>#routingserviceimplroute)
- [LLD 7.4 Pattern: Chain of Responsibility](<rel>#pattern-chain-of-responsibility-posting-filters)
- [SDD 13e autoapply service](<rel>)

## Why this way
- Chain of Responsibility because the LLD fixes filter order and each filter can stop routing (LLD 7.4).
- Hybrid/Auto branches are **not** built here: they ship in P5/P6 behind the per-mode release switch
  (LLD 17-specs Roadmap) - building them now would be built twice.

## Owns
- class `RoutingServiceImpl`, interface `RoutingService`
- file `autoapply/src/main/java/.../routing/RoutingServiceImpl.java`

## Touches (files outside Owns this task may change, with the reason)
- `autoapply-api/pom.xml` - adds the AWS SDK dependency this task needs

## Definition of done
- [ ] Owned items exist; ArchUnit rules pass
- [ ] Unit tests named in LLD 16.2 for UC-23 written and green
- [ ] Commit(s) carry `Task: AUTOAPPLY/T-014`

## Tests
- `route_hybridScoreEqualsThreshold_approves` - AUTOAPPLY/UC-23 AC (LLD 16.2)
- `route_reviewQueueFull_doesNotKeepMatch` - AUTOAPPLY/UC-23 A1

## Lessons that apply (filled by start)
- [L-004](../../lessons.md#l-004) - links only; the rule and Check live in lessons.md (never copied, so never stale)

## Template bindings (P11: each behaviour binding this task adds to an .html template)
- `[disabled]="busy()"` → `disablesSaveWhileSaving`
- `(click)="pickOpen.set(true)"` → `opensPickerOnPick`

## Removals (risk high: every Design check guard, tagged with its invariant; run `preflight.py --removals`)
- `api/src/main/java/.../RoutingServiceImpl.java` `requireOwner(account, offer);` → `RoutingServiceTest#refusesAnotherAccountsOffer` (I1)
- `api/src/main/java/.../OfferJob.java` `ON CONFLICT (day) DO NOTHING` → `OfferJobIT#twoRunsAtOnceTheSecondSendsNothing` (I4)
- I6: no guard line: kept by absence (the job writes no other table; diff review)

Every `I<n>` of the Design check has a tagged guard or a `no guard line: <reason>` bullet (P14). The named
test is the one that exercises the invariant: for a race or at-most-once rule, the interleaving test, never a
neighbour test that happens to fail.

## Equivalent mutants (only if P10 reports survivors that no test can kill)
- `RoutingServiceImpl.java:42` `if (score >= threshold) {` ConditionalsBoundary - `>=` and `>` give the same result: the value is never equal here

## Doc updates (DUs this task raised; P15)
- [AUTOAPPLY/DU-004](../../doc-updates.md#autoapplydu-004) - LLD 7.3 tie-break rule (fill-silence, LLD, Verified)

## Evidence (filled by done/verify)
| Date | Agent | Commits | Tests | Audit | Note |
|---|---|---|---|---|---|

## History
| Date | Agent | From → To | Reason |
|---|---|---|---|
| 2026-10-19 | claude-opus-5-5 | - → Planned | plan AUTOAPPLY/P2 |
~~~

## `tracking/AUTOAPPLY/plan.md`

~~~markdown
# AUTOAPPLY implementation plan

**Baseline:** BRD v1.3 · SDD vX · LLD v1.4 · planned 2026-10-19 by <agent>
**Scope:** P1-P2

## Phases
| Phase | Tasks | UCs | Status |
|---|---|---|---|

## Slices (slice mode; replaces Phases as the build order)
| Order | Slice | Use cases | Tasks | High risk | Demo |
|---|---|---|---|---|---|

## Dependency graph
```mermaid
flowchart LR
  T001["T-001 schema"] --> T009["T-009 CapCalculator"] --> T014["T-014 route"]
```

## Coverage
| UC | ACs | Tasks | e2e spec | Exists (Match / Partial / Missing) | Covered? |
|---|---|---|---|---|---|

## Planning decisions (local, decided by the tracker)
| # | Decision | Reason |
|---|---|---|
~~~

## Slice card `tracking/PLATFORM/slices/S-01-create-account-and-sign-in.md`

~~~markdown
# PLATFORM/S-01 - Create account and sign in, end to end

| Field | Value |
|---|---|
| Status | Planned |
| Order | 1 (config.md § Slices) |
| Use cases | [RESUME/UC-01](<rel>#uc-01-create-an-account-and-sign-in) |
| Tasks | PLATFORM/T-001, PLATFORM/T-002, … (n) |
| E2E specs | `e2e/resume-uc-01-create-an-account-and-sign-in.spec.ts` |
| Delivered | - |

## Demo
A new visitor creates an account, verifies the email and signs in to the home page.

## Out of scope (later slices or follow-ups)
- …

## Delivery evidence (filled by slice deliver)
| Check | Result | Link |
|---|---|---|

## History
| Date | Agent | Change |
|---|---|---|
~~~

## `tracking/journal/report-2026-10-21.md` (report)

~~~markdown
# Delivery report - 2026-10-21

**Delivered:** Create account and sign in (2026-10-21): a new visitor creates an account, verifies and signs in.
**In progress:** Admin portal: first Super Admin and admin sign-in (3 of 5 tasks done).
**Next:** Home hub and landing page; Upload CV from my computer.
**Blockers:** none.
~~~

## `tracking/gaps.md`

~~~markdown
| ID | Type | Severity | Found (date, agent, during) | Where (doc anchor / code) | Description | Owner | Fix task | Status |
|---|---|---|---|---|---|---|---|---|
| AUTOAPPLY/GAP-003 | doc-gap | major | 2026-10-19, codex, T-014 | LLD 7.3 route | Tie on score not defined | lld-unifier (DU-004) | - | Open |
~~~

## `tracking/doc-updates.md`

~~~markdown
| ID | Status | Level | Kind | Task | Gap | Anchors | What (from → to) | Decided by | Docs | Docs commit | Verified | Parent | Updated |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AUTOAPPLY/DU-004 | Verified | LLD | fill-silence | AUTOAPPLY/T-014 | AUTOAPPLY/GAP-003 | [LLD 7.3 route](<rel>#routingserviceimplroute) | tie on score: undefined → older match first (code `RoutingServiceImpl.java:57`) | LLD silent; code fills it (§ 2) | LLD v1.4 → v1.5 | 9f3e2a1 | PASS 2026-10-20 (5/5 checks) | - | 2026-10-20 |
| AUTOAPPLY/DU-005 | Waiting-decision | BRD | doc-conflict | AUTOAPPLY/T-022 | AUTOAPPLY/GAP-008 | [BRD UC-23 AC-2](<rel>#uc-23-route-a-new-match) | review queue limit: 50 (BRD) vs 100 (LLD 7.3) | - (BRD mode `ask`) | BRD, LLD | - | - | - | 2026-10-20 |
~~~
`Status`: Queued, Running (worker started <time>; in `team` run mode, the board request and its State), Applied, Verified, Waiting-decision, Rejected (<reason>),
Failed. `Verified`: the verifier's verdict and date. A failed verification appends its findings to `What`.

## `tracking/ownership.md` (generated)

~~~markdown
| Item | Kind | Owner task | Status |
|---|---|---|---|
| RoutingServiceImpl | class | AUTOAPPLY/T-014 | Planned |
| autoapply.match | table | AUTOAPPLY/T-003 | Done |
| POST /api/autoapply/profile/mode | endpoint | AUTOAPPLY/T-030 | Planned |
~~~

## `tracking/journal/2026-10-19.md`

~~~markdown
# Standup 2026-10-19

## Done since 2026-10-18
- AUTOAPPLY/T-009 CapCalculator - codex - 3 commits - unblocked T-014, T-015

## In progress
- AUTOAPPLY/T-011 - claude-opus-5-5 - since 2026-10-18

## Next
1. AUTOAPPLY/T-014 - critical path, unblocks 2
2. AUTOAPPLY/T-015

## Blockers
- T-020 waits on T-011 (in progress)

## Gaps
- New: AUTOAPPLY/GAP-003 (doc-gap, major) → DU-004
- Closed: -

## Doc updates
- Verified: AUTOAPPLY/DU-004 (LLD v1.5)
- Open: 1 Queued, 0 Running, 1 Waiting-decision

## Untracked commits
- a1b2c3d "fix mail parser" - no Task trailer → which task?

## Needs your decision
- GAP-003: tie-breaking rule on equal scores
- DU-005 (BRD): review queue limit 50 or 100 → `docs approve AUTOAPPLY/DU-005` or `docs reject …`
~~~

## `tracking/inventory.md` (generated)

~~~markdown
# Code inventory - 2026-10-19 (stack: Spring Boot + Next.js)

| Kind | Name | File:line | First / last commit | Key guess | Claimed by |
|---|---|---|---|---|---|
| endpoint | POST /api/autoapply/profile/mode | ProfileController.java:42 | a1b2c3d 2026-09-02 / f4e5d6c 2026-10-01 | AUTOAPPLY | AUTOAPPLY/T-030 (Adopted) |
| screen | /autoapply/review | web/app/autoapply/review/page.tsx:1 | … | AUTOAPPLY | AUTOAPPLY/T-033 (Partial) |
| migration | V007__match.sql | db/migration/V007__match.sql | … | AUTOAPPLY | - → GAP-011 untracked-code |
~~~

## `tracking/lessons.md`

~~~markdown
| ID | State | Trigger | Root cause | Rule | Check | Scope (layer · key · tags) | Hits | Source | Updated |
|---|---|---|---|---|---|---|---|---|---|
| L-004 | Promoted-DoD | AUTOAPPLY/T-014 audit-1: entity field added, no migration | skipped-layer | Always add a Flyway migration in the same task as any new/changed @Entity field | `git diff --name-only <start>..HEAD` has `db/migration/V*.sql` when it has `*Entity.java` | db · * · entity, migration | 2 | T-014 audit-1, T-022 audit-1 (recurred) | 2026-10-19 |
~~~

## `tracking/changes.md`

~~~markdown
| ID | Date | What changed (from → to) | Decided by | Why | Affected | Supersedes | Follow-up | Status |
|---|---|---|---|---|---|---|---|---|
| CHG-002 | 2026-10-19 | Score threshold per user → per mode | user: "make it per mode" | Hybrid needs its own bar | T-014 (Done-stale), table autoapply.profile | Plan decision #3, L-002 | T-041 rework; GAP-007 → DU-006 (direction, BRD) | Active |
~~~

## Audit report `tracking/AUTOAPPLY/audits/T-014-audit-1.md`

~~~markdown
# AUTOAPPLY/T-014 audit 1 - FAIL

Auditor: <agent/model> · risk <low|high> · 2026-10-19 · commits <shas> · export <head>
Time: started <HH:MM> · finished <HH:MM> · <n> min (budget 25; delta 10)
Pre-flight: [T-014-<sha>.md](../preflight/T-014-<sha>.md) · auditor verdict <as written> · recomputed <verdict>
Tests: <full run in export | reused pre-flight <file> (tree = head) + ran <classes>> · Scope: <full | delta of audit-<n>> · Export: <fresh | reused, clean, HEAD = <sha>>

## Layers
| Layer | Applies | Result | Evidence |
|---|---|---|---|
| API | yes | pass | RoutingController.java:41 matches LLD 6.2 |
| DB | yes | FAIL | MatchEntity.java:58 new `routedAt`; no migration in diff |
| Frontend | no | n/a | no UI in LLD 14 for UC-23 steps 1-4 |
| Logs / audit | yes | FAIL | LLD 11.3 requires `match.routed` event; not emitted |
| Security | yes | pass | … |
| Tests | yes | pass | 2/2 green |
| Lessons | yes | FAIL | L-004 violated |

## Trace (UC-23 step 2)
UI - n/a → DTO RouteRequest.java:12 → RoutingServiceImpl.java:77 → MatchEntity.java:58 → **migration missing** → log **missing**

## Findings
| # | Layer | Severity | Expected | Actual | Fix | Gap |
|---|---|---|---|---|---|---|
| 1 | db | blocker | LLD 5.1 match.routed_at | no V*.sql | add V014__match_routed_at.sql | GAP-008 layer-miss |

## Lesson candidates
- skipped-layer · (recurrence of L-004)
~~~

## Agent rules block (added to the code repo's AGENTS.md / CLAUDE.md)

~~~markdown
## Implementation tracking

- Before coding, run `impl-tracker-unifier next` (or read `tracking/index.md`). Work only on a task that is
  `In progress` under your name. Never start a task whose depends_on are not Done.
- Build only what the task's **Owns** lists. Need something else → it's another task or a gap.
- Every commit ends with exactly one `Task: <KEY/T-NNN>` trailer; never two tasks in one commit.
- Change files outside the task's **Owns** only when the card lists them under `## Touches`.
- Before coding, read the brief's **Lessons that apply** and **Layers to touch**; touch every layer listed
  (API, DB migration, UI, logs/audit trail) or say why not.
- Never call a task done yourself: `done` runs pre-flight, then an independent audit; only a PASS makes
  it Done.
- Push only when the user said so, or `config.md` § Delivery reads `auto (user: "…")` and the push check
  passes.
- The user corrects you or changes direction → `impl-tracker-unifier lesson` / `change` before continuing.
- Finished → `impl-tracker-unifier done <id>`. Found a bug, missing rule, or doc conflict →
  `impl-tracker-unifier gap`; the tracker queues the doc update and a background doc worker applies it.
  Never edit BRD/SDD/LLD yourself, and never to make code fit.
~~~

## `tracking/checks.json` (every Active lesson needs an entry; pre-flight runs them)

~~~json
[
  {"id": "no-env-skips", "lessons": ["L-003"], "keys": ["*"], "description": "no Testcontainers opt-out",
   "cmd": "grep -rn disabledWithoutDocker api/src/test", "paths": ["api/src/test"], "expect": "empty"},
  {"id": "clean-tree", "lessons": ["L-011"], "builtin": "P1"},
  {"id": "cache-concurrency", "lessons": ["L-007"], "judgement": "each cache has a concurrent test asserting its limits"}
]
~~~
`expect`: `empty` = the command prints nothing and exits 0 or 1; `exit0` = the command exits 0. Commands run
with bash (`set -o pipefail`) from the code root; exit ≥ 2 is an error; `2>/dev/null` is refused;
`paths` must exist. `builtin`: `P1` clean tree, `P5` tests, `P6` local stack.
