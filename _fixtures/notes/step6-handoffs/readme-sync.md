# Handoff: sync the root README with the skills (step 6, stage RM)

Work in the git repo `C:\Users\negat\.claude\skills` (branch `fix/unifier-fix-round`). It holds five documentation skills: `pre-brd-unifier`, `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`. The root `README.md` describes them for the people who use them.

**Goal:** make `README.md` fully consistent with what the skills support today, and in sync with the output each skill is specified to produce: folders, file names, chunk lists, section numbers, IDs, versions, gates, registers, questions, stops, and hand-offs.

## Ground rules

- Write only two files: `README.md` (repo root) and your log, `_fixtures/notes/step6-handoffs/readme-sync-log.md`. Edit nothing else.
- Use no git command that changes state: no commit, push, add, stash, checkout, restore, or reset. `git status`, `git diff`, `git show`, and `git log` are fine. The working tree already holds about 100 uncommitted changes from this round. Leave them alone.
- Other agents are editing files inside `brd-unifier/`, `sdd-unifier/`, and `lld-unifier/` while you work. They only replace em dash characters with other punctuation, and a heading that contains an em dash may get renamed. Read those files freely; never write them. Cite a heading as it reads when you read it. List in your log every README reference to a heading that still contains an em dash; it gets checked again after their pass.
- `README.md` uses CRLF line endings and UTF-8 without a BOM. Keep both, including on the lines you add. If your edit tool writes LF, normalize at the end with: `python -c "p='README.md'; d=open(p,'rb').read().replace(b'\r\n',b'\n').replace(b'\n',b'\r\n'); open(p,'wb').write(d)"`
- No em dash (U+2014) or en dash (U+2013) anywhere in `README.md`. Use commas, colons, parentheses, or " - ".
- Style: plain English and short sentences in the README's existing voice. Keep its table shapes and its Markdown and Mermaid style. Keep names, IDs, numbers, and file names exact.
  - The README is an overview. Add only what a reader needs at that level of detail; a clause beats a paragraph. Never paste skill internals.
  - The BRD is business language only, so keep anything technical out of what the README says a BRD contains.
- Source of truth, in this order: each skill's `SKILL.md`, then its templates (`chunks/*.md`, `TEMPLATE-COMBINED.md`, the master template), then its other reference files. The saved runs under `_fixtures/chain/` and `_fixtures/scenarios/` predate this round. Use them only as supporting evidence of output shape, never over the skill text.
- When the README and a skill disagree and the skill itself looks wrong, or the fix needs a policy choice, do not edit. List the item in the log under "For the user", with both texts and your recommendation.
- Leave unchanged any third-party fact the repo cannot confirm, such as the claude.ai upload path or the Codex and Kimi skill folders. Note it in the log instead.

## Already applied: verify, do not redo

An earlier agent applied four edits before it was stopped. See `git diff HEAD -- README.md`:
- the Review row of the chain table (adds `review-panel-findings.md`)
- the "One fact, one home" bullet (LLD derived views)
- the "Cleared-context review" bullet (delta reviews, the chunk 19 faithfulness check, settled items)
- a new "One update, one version" bullet

Check each one against the skills like any other statement.

## Part 1: the known list

Apply the "README statements now wrong" sections (and their "incomplete, not wrong" items) of four reports:
- `_fixtures/notes/step6-consistency/cross.md`: items R-1 to R-13, with exact replacement text
- `_fixtures/notes/step6-consistency/brd.md`, `sdd.md`, and `lld.md`: suggested wording

These reports came before the user's decisions C1 to C11 (`_fixtures/notes/step6-consistency/decisions.md`), which the skills now carry. Check every suggested replacement against the current skill text. Adjust it wherever the skill now says otherwise.

Two more items were found since:
- **LL-1, wrong since before this round.** In the "SDD to LLD" table, the row `12 §16 Roles` sends authorization to "04 §7.7". LLD §7.7 is Error Handling; authorization lives in each service file's §7.2 `### Authorization`. Evidence: `lld-unifier/sdd-to-lld.md` (the 12 §16 row) and `lld-unifier/chunks/04-implementation-template.md` ("### Authorization" under "## 7.2"). New destination cell: "11 §14 Security; 09 §12.1; 04 §7.2 Authorization".
- **LL-2.** In the "SDD to LLD" table, the last cell of the row `00 § Document Lineage` names only three Child LLDs columns. The columns are LLD, Scope (§13 services), Direction, Version, SDD version (the SDD version the LLD's content reflects, as its 16 §19.1 records it), and Link. Evidence: `sdd-unifier/chunks/00-cover-and-changelog.md` and `lld-unifier/sdd-to-lld.md`. New cell: "The row (scope, Direction, version, the SDD version its content reflects, link) is the LLD's only write outside its folder".

## Part 2: full audit

Then check every statement in `README.md`, section by section, and fix what is wrong, stale, or misleading. Cover at least these sections.

**The chain at a glance:** the table and the diagram.

**Shared conventions**, every bullet against all five skills:
- the `<!-- CHUNK: ... -->` comment and `<!-- MASTER: ... | PREV: ... | NEXT: ... -->` footer formats, and which skills use them
- master file names, and which masters record progress so a run can resume
- merge and re-chunk support per skill
- the Open Items chunk numbers, and who walks the items
- `decision-log.md`
- the flag formats
- ID ownership and the BRD key rule
- the em dash rule, the Miro rule, and the tech defaults

**How the skills link together:**
- the link diagram and "Who owns what" (every chunk and § number against the templates)
- the three hand-off tables, row by row, against `sdd-unifier/brd-to-sdd.md` and `lld-unifier/sdd-to-lld.md`
- the trace diagram

**Lineage and change flow:**
- the request phrases, exactly as the skills word them: "BRD `KEY` has a new version", "the SDD has a new version", "refresh the trace", "update the todo", "the business review changed this SDD"
- what each owner does on such a request: version bump, back-fill, settled and superseded items, delta review, `Stale` marks on SDD 19 and BRD 15-17, the LLD's single offer, and the review hand-offs in chain order

**Each skill section, 1 to 4:**
- usage and arguments
- the chunk table: every file name exactly as the template and `chunking.md` name it, § numbers, and the Written and "In merged BRD" cells
- the "How the chunks relate" diagram and bullets
- the gates: BRD G1-G5 in `brd-unifier/delivery-chunks.md`, SDD E1-E4 in `sdd-unifier/SKILL.md` step 8b
- What to expect: provide, asks, stops, never, done when
- Key behaviors and Feeds into
- Reference files: every reference file listed, none missing. The pre-BRD section has no Reference files line yet, so add one.
- Check whether `pre-brd-unifier` also transforms or reformats an existing pre-BRD (it has `transform-detection.md`), and whether the BRD and SDD "It asks you" rows cover the one short question on an unqualified "HLD" request.

**5. Business reviewer:** its phases, its two files, the personas, when a pre-BRD is in scope, the re-dispatch of a reviewer asked for more, what it may and may not edit, version bumps, and the close with its hand-offs.

**Installation and usage:**
- each `SKILL.md` `description` is a YAML block scalar (`description: >-`) under 1024 characters (measure them)
- each `SKILL.md` has a "Running outside Claude Code" section
- the argument lists, the invocation table, and the tips

**Suggested workflow.**

**Known gaps:** this section is stale. The four paths it names were run as fixture scenarios in step 3 (`_fixtures/README.md` § Scenarios). Rewrite it to say what is untested now:
- This round's changes have not yet run on a sample chain; the chain rerun is planned. These are the versions and `Chunks:` lists, delta reviews, the chunk 19 faithfulness check, the marker walk, BRD `Stale` marks, the review hand-offs, and `Needed before`.
- The fixture BRDs predate the current brd-unifier template (`_fixtures/README.md`, last paragraph).

Keep it short.

## Log

Write `_fixtures/notes/step6-handoffs/readme-sync-log.md` as you go, so a stopped run still leaves a usable record:
1. One row per change: README section, old text (short), new text (short), and the skill evidence as `file:line`.
2. "Checked, no change": one line per section.
3. "Headings with an em dash": the README references to them.
4. "For the user".

## Final checks (run from the repo root)

1. `python -B _fixtures/notes/step6-handoffs/check_readme.py` must print `0 problems`. It checks table-of-contents anchors, file references, table cell counts, dashes, the BOM, and CRLF on every line.
2. Each Mermaid block still parses by reading: balanced brackets and quotes, and node IDs defined before use.
3. `git status --short`: compared with the start, the only changes are `README.md` and your log.

End with a short summary: the number of changes, the items for the user, and the check results.
