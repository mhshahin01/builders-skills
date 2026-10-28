# Gap rules

| Type | Meaning | Owner | Fix path |
|---|---|---|---|
| doc-gap | Docs don't say / contradict each other | brd-, pre-sdd-, sdd-, or lld-unifier (whichever owns the anchor; pre-sdd for capacity, availability and DR, hosting and tenancy isolation) | DU queued (doc-impact-rules.md); task waits if blocker |
| plan-gap | In-scope UC/AC/spec has no LLD unit or no task | lld-unifier (DU) or tracker (task) | DU for the LLD unit, or add task |
| doc-update | Code is right, doc is out of date or silent (doc-impact-rules.md § 2 decided) | owning doc skill (DU) | DU applied by the doc worker |
| code-drift | Code behaves differently from the doc | tracker | fix task |
| bug | Code defect against its own task's DoD | tracker | fix task (depends_on the original) |
| untested-ac | AC with no proving test | tracker | test task |
| missing-dep | Needs a task from another feature/platform that doesn't exist | other key | cross-key task |
| double-build | Same item owned or coded twice | tracker | merge; one task Dropped |
| untracked-code | Code with no owning task | tracker | adopt into a task or remove |
| doc-changed | Doc version bump changed a cited anchor | tracker | re-plan |
| layer-miss | A layer the task required (DB migration, endpoint, screen, security check) was not done | tracker | fix task; lesson |
| obs-gap | Required log, metric, audit-trail row or domain event missing or wrong | tracker | fix task; lesson |
| forced-start | Dependency override | user | re-check task |

**Severity:** `blocker` (stops a task) · `major` (wrong behaviour possible) · `minor`.
**Close** only with evidence (closing bug / code-drift / layer-miss / obs-gap / double-build /
untracked-code also writes its lesson - lessons-rules.md § 1): the commit, the doc version that fixed it, or the user's decision quoted.
**Doc-owned gaps** (`doc-gap`, `doc-update`, `doc-changed`, and `plan-gap` routed to lld-unifier) are written
together with their DU row (doc-impact-rules.md § 5) and close only when that DU is `Verified` (evidence: docs
commit + new version) or `Rejected` with a reason.

