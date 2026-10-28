<!--
CHUNK: 11
TITLE: Gate and Sign-off
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03a-10
PART OF: Pre-SDD - [Project Name]
-->

# 11. Gate and Sign-off

<!-- Rules: gates-and-signoff.md. The gates are the Standard's: G0 Initiate, G1 Discover, G2 Assess, and G3 Approve, with the 14-line G3 checklist (§ 11.1) and the sign-off register (§ 11.2). G3 is signed in chat only, at the skill's G3 stop, after the write-up and the review; the Studio shows the register read-only. Only a person ticks a checklist line; only a named person, never a stand-in, grants an exception; the skill never signs. Rewrite this chunk from the new fragment after every signing: writing a signature here is not a content change, so it reopens nothing and bumps nothing. -->

## 11.1 Gate Result

<!-- The engine renders the gate from the project state (fragment `11-gate.md`): G0, G1, and G2 with what each still misses; the G3 status (Not signed, Blocked, Review, Approved, or Approved with conditions) and every problem it names; the gate label and whether the SDD is authorized to start; the G3 checklist G3-01 to G3-14, each Done or N/A with its reason, or Open, with who ticked it and when; the sign-off register, one row per applicable role (the migration owner only with the overlay), each with its signer, decision, and UTC time, or not applicable with the reason, or Not signed, and whether it counts, a stand-in marked as one; the conditions COND-NN with owner and due date; and the exceptions EXC-NN with the entry, who granted it, the reason, the expiry, and the review date. Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 11-gate.md -->
| Gate | Result | Missing |
|------|--------|---------|
| G0 Initiate | [Met / Not met] | [What is missing] |
| G1 Discover | [Met / Not met] | [What is missing] |
| G2 Assess | [shortlist / blocker / incomplete] | [What is missing] |
| G3 Approve | [Not signed / Blocked / Review / Approved / Approved with conditions] | [Problems] |

**Gate label:** [Draft / G0 / G1 / G2 / Blocked / G3 Approved / G3 Approved with conditions]

**Authorized to start the SDD:** [Yes / No]

**G3 checklist**

| Line | Text | Status | Reason (N/A) | Ticked by | At |
|------|------|--------|--------------|-----------|----|
| G3-01 | A named business sponsor and product owner approved the problem, scope and success measures. | [Done / N/A / Open] | [Reason] | [Name] | [UTC] |

**Sign-off register**

| Role | Name | Decision | At | Comments |
|------|------|----------|----|----------|
| Business sponsor | [Name, or Stand-in: Approver (policy, set by name, date)] | [Approved / Approved with conditions / Rejected / Not applicable: reason / Not signed] | [UTC] | [Counted / Not counted][, stand-in] |

**Conditions**

| ID | Condition | Owner | Due |
|----|-----------|-------|-----|
| COND-01 | [Condition] | [Owner name] | [YYYY-MM-DD] |

**Exceptions**

| ID | Entry | Reason | Granted by | Expires | Review | Valid |
|----|-------|--------|------------|---------|--------|-------|
| EXC-01 | [Entry ID] | [Reason] | [Name] | [YYYY-MM-DD] | [YYYY-MM-DD] | [yes / no] |
<!-- /ENGINE-FRAGMENT -->

## 11.2 SDD Initiation Authorized By

<!-- One line, written from the gate fragment after every signing: when the engine reads G3 Approved or Approved with conditions (authorized), the signers by role, the latest signature time, and the conditions the SDD carries; otherwise "Not authorized:" and the G3 status with the problems still named. A quick Pre-SDD claims no gate and authorizes no SDD (this chunk is not written in quick mode). -->

**SDD initiation authorized by:** [Each signer with the roles they signed, YYYY-MM-DD; with conditions COND-NN] | [Not authorized: G3 <status>; see § 11.1]

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 10-validation-risks-unknowns.md | NEXT: 12-sdd-handoff-guide.md -->
