# Lessons and change log

Goal: a mistake is made **once**. A direction change is applied **once** and never undone by accident.
Two registers, both in `./tracking/`:

| File | Holds | ID |
|---|---|---|
| `lessons.md` | What went wrong, why, and the checkable rule that prevents it | `L-NNN` (global, not per key) |
| `changes.md` | Direction / use-case / decision changes after work started | `CHG-NNN` (global) |

Templates: `templates.md` § lessons.md and § changes.md.

---

## 1. When a lesson is captured (automatic — never wait to be asked)

| Trigger | Detected by | Lesson kind |
|---|---|---|
| Audit finds a blocker/major | `done` → audit | the layer that was missed |
| `verify` fails an AC | `verify` | misread / untested AC |
| Task reopened (Done/Verified → In progress) | status change | why "done" was wrong |
| `bug`, `code-drift`, `layer-miss`, `obs-gap`, `double-build`, `untracked-code` gap **closed** | `gap close` | root cause of the gap |
| User corrects the agent in chat ("no, that's wrong", "you forgot the DB", "I told you…") | any command | the correction itself — quote it |
| Same error message / failing test seen twice in one task | `done`, `start` | the fix that worked |
| `forced-start` gap closed | `gap close` | was skipping the dependency right? |

The agent writes the lesson **in the same step** as the trigger. A trigger with no lesson is a
quality-check failure (SKILL.md § Quality checks).

## 2. What a valid lesson looks like

Each row has:

| Field | Rule |
|---|---|
| Trigger | What happened, with the task/gap/audit ID. One line. |
| Root cause | One of: `misread-doc` · `skipped-layer` · `stale-assumption` · `wrong-pattern` · `missing-test` · `env-tooling` · `direction-change` · `scope-creep` · `false-done`. Pick the deepest true one, not the symptom. |
| Rule | Imperative, starts with **Always** / **Never** / **Before X, do Y**. |
| Check | A concrete, mechanical check that proves the rule was followed: a grep, a command, a file that must exist, a test name. **No check → not a lesson, rewrite it.** |
| Scope | Layer(s) (`api` `db` `ui` `logs` `domain` `infra` `test` `security`), key (`*` = all), tags (owned-item kinds: `migration`, `endpoint`, `entity`, `screen`, `event`…). |
| Source | Task / gap / audit / CHG IDs, date, agent. |

**Make it executable.** Every Active lesson needs a `tracking/checks.json` entry, added in the same edit
(SKILL.md rule 1a)
(pre-flight fails while any Active lesson is uncovered). Three kinds (templates.md § checks.json):
a shell `cmd` with `expect` (and the `paths` it inspects); a `builtin` naming the pre-flight row that
already proves it (`P1` clean tree, `P5` tests, `P6` stack); or a `judgement` note for checks only the
auditor can make. Never hide a check's errors (`2>/dev/null`): list the paths instead.

Rejected (rewrite before saving): "be more careful", "remember the DB", "test better".
Accepted: "**Always** add a Flyway migration in the same task as any new/changed `@Entity` field.
**Check:** `git diff --name-only <start>..HEAD` contains `db/migration/V*.sql` when it contains `*Entity.java`."

## 3. Dedup and recurrence

Before adding: search `lessons.md` for the same root cause + overlapping scope.

- Same lesson exists → **do not add**. Increment `Hits`, append the new source, sharpen Rule/Check if the
  new case shows a hole.
- It existed and was **Active** when the mistake happened → this is a **recurrence**: the rule didn't work.
  Mark `Recurred`, and **promote** it (§ 4) one level immediately. Write in the row why the old
  check failed to catch it.

## 4. Lifecycle

| State | Meaning | Where it is enforced |
|---|---|---|
| Active | Normal lesson | printed in `start` brief; checked by audit |
| Promoted-DoD | Hit ≥ 2 or recurred once | auto-added to the DoD of every new matching task by `plan` |
| Promoted-rule | Recurred twice, or user says "always" | added to `config.md` § Standing rules **and** the code repo's agent rules block (ask once to edit AGENTS.md/CLAUDE.md); audit treats a violation as `blocker` |
| Retired | Superseded by a CHG, or the code/tool it is about is gone | not printed; kept for history with the reason |

Never delete a lesson. Retire it with a reason and the superseding CHG/L ID.

## 5. Recall: lessons are useless unless read before acting

| Command | Uses lessons how |
|---|---|
| `plan` | For each new task: matching Promoted-DoD lessons → DoD items `L-NNN: <rule>`; matching Active lessons → one line in **Why this way** if they change the design. |
| `start` | Task brief gets a **Lessons that apply** section: filter Active/Promoted by layer ∩ task layers, key, and tags ∩ owned-item kinds. **Max 4**, Promoted first, then by Hits. Lessons a pre-flight check already enforces mechanically (a `command` or `builtin` entry in `checks.json`, or P10) are left out: the script catches them. The card links each lesson (`[L-NNN](../../lessons.md#l-nnn)`), never copies its text. |
| `done` | Implementer must tick each listed lesson's Check; the audit re-runs them independently. |
| audit | Every applicable lesson's Check is run; violation of Promoted-rule = blocker, others = major. |
| `standup` | New lessons and recurrences since last entry. |

**Merge before adding.** Before a new lesson row, look for an Active lesson with the same root cause and
layer: sharpen its Rule and Check instead of adding a row (L-NNN keeps its ID, hits +1). When Active +
Promoted lessons pass 25, the next `standup` proposes merges and retirements (lessons a mechanical check
fully covers become `Retired: covered by <check id>`).

Read budget: `start`/`done`/audit read `lessons.md` filtered by scope — grep the Scope column, don't load
all of it when it is large.

## 6. Change log (`changes.md`) — direction changes

Opened whenever, **after a task has started**, any of these changes: a use case, an AC, a decision the
user made in chat, an approach the tracker or agent chose (pattern, library, schema shape), or scope.

| Field | Rule |
|---|---|
| What changed | From → To, concretely ("match score threshold from per-user to per-mode"). |
| Decided by | User quote, or doc version + anchor. Agents cannot decide direction alone. |
| Why | One line. |
| Affected | Tasks (status now), owned items, code files, lessons, earlier CHG rows. |
| Supersedes | Earlier CHG / planning decision / lesson IDs. |
| Follow-up | Rework tasks created (`depends_on` the affected ones), gaps routed (doc changes → owning doc skill as `doc-changed`/`doc-gap`). |

Effects:

1. Affected not-started tasks → `Stale`; affected Done/Verified → `Done-stale`; rework task created.
2. Superseded planning decisions and lessons → marked `Superseded by CHG-NNN` (not deleted).
3. **Anti-resurrection:** `start` and the double-build gate grep `changes.md` for every owned item; an item
   listed as removed/replaced in an active CHG → stop and show the CHG. Audit flags code that brings a
   superseded thing back (`code-drift`, major).
4. If the change happened because the earlier direction was a mistake (not new business need) → also
   capture a lesson with root cause `direction-change` or `misread-doc`.

The user can ask "why is it like this?" → answer from `changes.md` + planning decisions, newest first.
