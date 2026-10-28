# impl-tracker-unifier: init

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.

## init

1. Ask (one question block) for: code repo root (default: cwd), docs root (default: find
   `tech/features-map.md`), and the feature keys to track. Detect keys from BRD folders and
   `features-map.md`; propose them.
2. For each key, locate BRD master, SDD master (§7.3), LLD master, LLD `04-implementation/`,
   `13-testing.md` § E2E Spec Traceability, `17-specs.md` § Roadmap. Record paths in `config.md`.
3. Write `tracking/config.md` (incl. § Audit checks: detect migration tool, API spec, test, lint commands
   from the repo and propose them), empty `index.md`, `gaps.md`, `ownership.md`, `lessons.md`,
   `changes.md`, `doc-updates.md`, `journal/`; config § Doc updates with the defaults (LLD/SDD `auto`,
   BRD/SoW `ask`) and the docs repo path (doc-impact-rules.md § 4), and the `Board` row: `<docs root>/unifier-status.md` (§ The tracker's board row).
3b. **Inventory existing code** (discovery-rules.md § 1) → `tracking/inventory.md`. Print counts by kind
   and key guess ("found 14 endpoints, 6 screens, 9 migrations"). Nothing is marked done here.
4. Install the Stop audit hook (audit-rules.md § 7) in the code repo's `.claude/settings.json`: ask once, then
   merge it into existing `hooks.Stop` (create the file if missing; never drop other settings or hooks;
   skip if the same command is already there).
4b. Offer the post-commit lint hook (`hooks/post-commit-lint.sh` → the repo's `.git/hooks/post-commit`; ask
   once, never overwrite an existing hook): after every commit it lints the commit's `Task:` and prints only
   FAIL rows, so paperwork is fixed at commit time, never found by a pre-flight. It never blocks a commit.
5. Add the agent rules block (templates.md § Agent rules block) to `AGENTS.md` / `CLAUDE.md` of the
   code repo, if the user agrees.
