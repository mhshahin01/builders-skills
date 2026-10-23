# The unifier company: hivantic-org-unifier (2026-10-23)

On the user's word, `band-unifiers/` was renamed [`hivantic-org-unifier/`](../../hivantic-org-unifier/README.md) and rebuilt as the company model of the pre-SDD design of 2026-10-23 (section 2, decisions 4, 5 and 15, and section 7): every skill is an independent employee, and employees work together only through files (their documents, the status board `unifier-status.md`, and the `HR-NNN` handoff requests on it).

## Employees

| Skill | Employee | Team | Role file | Change |
|---|---|---|---|---|
| `pre-brd-unifier` | Business development | Product Management & Business Development | `agent-business-development-pre-brd-unifier.md` | Renamed from Product Strategist |
| `brd-unifier` | Product manager | Product Management & Business Development | `agent-product-manager-brd-unifier.md` | Renamed from Business Analyst; hands off to the E2E Architect |
| `business-reviewer-unifier` | Business owner | Product Management & Business Development | `agent-business-owner-business-reviewer-unifier.md` | Renamed from Review Lead; reviews the Pre-SDD, never edits it |
| `pre-sdd-unifier` | E2E Architect | Software Development & Delivery | `agent-e2e-architect-pre-sdd-unifier.md` | New, written from the design (the skill is still being built) |
| `sdd-unifier` | Software Architect | Software Development & Delivery | `agent-software-architect-sdd-unifier.md` | Renamed from Solution Architect; loads a G3-signed Pre-SDD |
| `lld-unifier` | Tech Lead | Software Development & Delivery | `agent-tech-lead-lld-unifier.md` | Retitled to the company model |
| `impl-tracker-unifier` | Developer / software engineer | Software Development & Delivery | `agent-developer-impl-tracker-unifier.md` | Renamed from Delivery Lead; now builds the tasks it tracks |
| `tutorialize-unifier` | Mentor / assistant | Software Development & Delivery | `agent-mentor-tutorialize-unifier.md` | New; reads the board, keeps no row |

QA, DevOps, and other employees join later; nothing is built for them, and the board takes their rows when they do.

## Files

- `README.md` is the company handbook, rebuilt from `team-product-management-guidelines.md` (renamed with `git mv`): employees and teams, the chain, the status board and handoff requests, who takes what, the humans' decisions, the change flow with the Pre-SDD rows, folders, house style, and platforms.
- `team-product-management-and-business-development.md` and `team-software-development-and-delivery.md` replace the single team file; their frontmatter carries the members.
- Every role file has the role line "You act as the <Employee> (<Team>) in the unifier company", an eight-row company table, and no stage numbers (the README renumbering belongs to the pre-SDD work).

## Company rules

The user chose files-only hand-offs. The shared block, now **Company rules**, replaces "Mention to be heard" with three rules (work through files; wake-ups are not hand-offs; your cells only) and words hand-offs as handoff requests. It is byte-identical in all eight role files.

## Transition

`pre-sdd-unifier` and the skills' status-board section are not built yet. The handbook says so, and the Product manager and Software Architect role files say that until `pre-sdd-unifier` ships, a finished BRD goes straight to the Software Architect, as the skills do today. The pre-SDD design's housekeeping step for the Band files is done here; the session building pre-SDD was told.
