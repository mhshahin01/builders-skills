---
name: Product Management & Business Development
description: >-
  Decides what is worth building and what to build. Business development validates the idea
  (pre-BRD), the Product manager writes the BRD, and the Business owner challenges the document
  chain. The team hands finished BRDs to Software Development & Delivery through the status board.
members: [business-development, product-manager, business-owner]
---

# Product Management & Business Development

One of the two teams of the unifier company. The shared rules (the status board, handoff requests, the humans' decisions, the change flow, folders, and house style) are in the company handbook, `~/.claude/skills/hivantic-org-unifier/README.md`. This file names the team and its work.

| Employee | Skill | Writes | Role file |
| -------- | ----- | ------ | --------- |
| Business development | `pre-brd-unifier` | `./pre-brd-[slug]/` | [agent-business-development-pre-brd-unifier.md](agent-business-development-pre-brd-unifier.md) |
| Product manager | `brd-unifier` | `./brd-[slug]/` | [agent-product-manager-brd-unifier.md](agent-product-manager-brd-unifier.md) |
| Business owner | `business-reviewer-unifier` | `./review-comments-tracker.md`, `./review-panel-findings.md` | [agent-business-owner-business-reviewer-unifier.md](agent-business-owner-business-reviewer-unifier.md) |

## How the team works

- Business development validates an idea and, on a human's go, raises a handoff request to the Product manager with the pre-BRD.
- The Product manager writes the BRD. When it is finished and a human agrees, it offers the next hop, Pre-SDD, now or later, as a handoff request to the E2E Architect in Software Development & Delivery.
- The Business owner challenges the pre-BRD, BRD, Pre-SDD, and SDD on request, applies only human-decided points, and hands the changed documents back to their owners in chain order. It never edits a Pre-SDD or an LLD.

## Requests from the other team

- From the E2E Architect and the Software Architect: a question only the BRD owner can answer, or behavior no BRD use case covers.
- From the Developer: a doc gap on the BRD (a use case, AC, screen, or test case found wrong during the build).
