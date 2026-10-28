---
name: Software Development & Delivery
description: >-
  Designs, builds, and teaches. The E2E Architect settles the numbers and shape (Pre-SDD), the
  Software Architect designs the system (SDD), the Tech Lead designs each service (LLD), the
  Developer builds and tracks the code, and the Mentor teaches on request.
members: [e2e-architect, software-architect, tech-lead, developer, mentor]
---

# Software Development & Delivery

One of the two teams of the unifier company. The shared rules (the status board, handoff requests, the humans' decisions, the change flow, folders, and house style) are in the company handbook, `~/.claude/skills/hivantic-org-unifier/README.md`. This file names the team and its work.

| Employee | Skill | Writes | Role file |
| -------- | ----- | ------ | --------- |
| E2E Architect | `pre-sdd-unifier` | `./pre-sdd-[slug]/` | [agent-e2e-architect-pre-sdd-unifier.md](agent-e2e-architect-pre-sdd-unifier.md) |
| Software Architect | `sdd-unifier` | `./sdd-[slug]/` | [agent-software-architect-sdd-unifier.md](agent-software-architect-sdd-unifier.md) |
| Tech Lead | `lld-unifier` | `./lld-[slug]/` | [agent-tech-lead-lld-unifier.md](agent-tech-lead-lld-unifier.md) |
| Developer / software engineer | `impl-tracker-unifier` | The code, and `./tracking/` in the code repository | [agent-developer-impl-tracker-unifier.md](agent-developer-impl-tracker-unifier.md) |
| Mentor / assistant | `tutorialize-unifier` | Tutorial files, where a human asks | [agent-mentor-tutorialize-unifier.md](agent-mentor-tutorialize-unifier.md) |

## How the team works

- The E2E Architect turns finished BRDs into a G3-signed Pre-SDD and raises a handoff request to the Software Architect with its handoff guide.
- The Software Architect loads the signed Pre-SDD, keeps what it settles locked, designs the system, and hands the finished SDD to the Tech Lead. A locked item it finds wrong goes back to the E2E Architect as an open item and a request, never as an edit.
- The Tech Lead writes the LLD and hands the approved LLD to the Developer.
- The Developer splits the LLD into tasks, builds each one a human approves, has each audited before it counts as done, and sends doc gaps back to their owners.
- The Mentor teaches anyone in the company on request. It reads the board but keeps no row.

## Requests from the other team

- From the Product manager: finished BRDs (the next-hop offer), each new BRD version, and "refresh the trace".
- From the Business owner: the hand-offs after a review's close, including Pre-SDD decisions (the panel never edits a Pre-SDD).
