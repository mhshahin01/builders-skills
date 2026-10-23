# Band role files resync (2026-10-23)

The Band Desktop files moved from `C:\Users\negat\Downloads\` into this repo as `band-unifiers/` (renamed [`hivantic-org-unifier/`](../../hivantic-org-unifier/) the same day; see [org-unifier-2026-10-23.md](org-unifier-2026-10-23.md)), on the user's word, and were resynced to the skills at `39d410c`. The previous sync was against `82306cd` (2026-10-08; records in `step7-band/`, `step8-band/` and `step9-band/`). In between, f960c46 (answer policies, light runs, stand-ins, phase-based BRDs, fixture run FA), adc40a0 (fixture run FB), 5bec229 (FC rulings), 314d75c (source authority) and the step 10b fixes c6d41f2, 5351490 and c60bb6a changed what the skills ask, write and stop for.

**Method:** six read-only checker agents, one per file (the five agent files and the team guidelines). Each diffed its skill folder and `README.md` across `82306cd..39d410c` and returned exact replacements, each with the skill line that requires it. Claude Code applied every proposal by script, each current text matched exactly once; two long Product Strategist replacements were split into separate bullets without changing their content. Pre-edit copies are kept in the session scratchpad only.

| File | High | Medium | Low | Main changes |
|---|---|---|---|---|
| Product Strategist | 2 | 3 | 0 | Light runs; what an answer policy may answer; no Excel after a light run or by a policy; the generate-or-transform stop; the done-when inventory |
| Business Analyst | 4 | 5 | 1 | `light` and `phase=N`; answer policy and stand-ins; Approver stand-in sign-off; the brand color never asked under a policy; "later" in the acceptance loop; apply-pending, sign-off and start-the-next-phase rows |
| Solution Architect | 3 | 4 | 1 | Light runs; answer policy limits; after a review, open items only for design choices; the candidate-events exception; sign-off row; project defaults; phase-based BRDs; `AP` IDs |
| Tech Lead | 4 | 2 | 2 | Light runs; the acceptance loop; decisions after the application check wait as `Decided - pending application`; answer policy on the mode and direction prompts; phase-based Roadmap; mode and direction wording |
| Review Lead | 5 | 7 | 3 | Answer policy and the SME stand-in; the SDD edit boundary; markers for remainders; hand-offs a policy names; lineage rows and step 5 diagrams stay with their owners |
| Team guidelines | 2 | 8 | 1 | Answer policies and stand-ins; SDD open items only for design choices; the LLD acceptance loop; the sign-off stop; Markdown by default; derived views; long SDD first builds; one question per marker |

Total: 57 edits, 20 High, 29 Medium, 8 Low.

## Team changes

- **Sixth agent:** `agent-delivery-lead-impl-tracker-unifier.md` (stage 6, `impl-tracker-unifier`), written from the skill's `SKILL.md` and README. The Delivery Lead was added to every team table and team paragraph, to the Business Analyst, Solution Architect and Tech Lead hand-offs (doc gaps come back; a new version goes to the Delivery Lead for `sync`), and to the guidelines: members, chain, routing, the humans' decisions, hand-offs, upstream changes, folders and IDs. The Delivery Lead implements a task only when a human assigns it, and the guidelines' "outside this team" line now names that exception and its audits.
- **Room rules:** one new bullet, **Answer policies**, approved by the user. The block is byte-identical in all six agent files: SHA-256 prefix `fdf038edc2e1cdbe` (was `4d75258455a4b9d8`).

## Also fixed in README.md

From the checkers' notes: `[light]` and `[phase=N]` in How to use each skill; where the review panel states its light rule; the LLD's phase-based roadmap exception; the review close list (the rejections a policy took); the SDD long-build version rule; the bump-nothing list (the SDD `**Review passes:**` line and sign-off); and a Band Desktop pointer to `band-unifiers/`.

## Open

- **Skill gap:** brd-, sdd-, lld- and business-reviewer-unifier name a "residue report" for unsourced behaviour a policy adds, but none defines one. Not fixed here: it is a skill change.
- **No run evidence:** no Band room has exercised the answer-policy, stand-in or Delivery Lead wording yet.
- **Left out on purpose:** light runs and phase-based BRDs in the guidelines (no statement is false without them), combined-mode file locations in the routing table, and LLD-owner remainders in the review row.
- **Checker housekeeping:** two checkers wrote scratch diffs into the session scratchpad despite read-only instructions; neither touched the repo or a Band file.
