# Sync and drift

1. Read each doc master's version (cover/changelog). Compare with `config.md` baseline.
2. Bumped → read the changelog rows since the baseline; collect changed anchors / IDs.
3. Every task citing a changed anchor → `Stale` / `Done-stale`; gap `doc-changed` with the
   changelog line quoted.
4. Ownership check: each owned item of a Done task still exists in code (grep). Missing → `code-drift`.
5. Untracked code: new classes under feature packages, new migrations, new routes not in
   `ownership.md` → `untracked-code`.
6. Commits since last sync without `Task:` → listed in next standup.
7. Ask the user once whether to move the baseline to the new versions (re-plan), a direction-level question.
8. Re-run the code inventory and diff it with the previous one (discovery-rules.md § 5).
