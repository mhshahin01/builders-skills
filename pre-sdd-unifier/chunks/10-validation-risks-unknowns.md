<!--
CHUNK: 10
TITLE: Validation, Risks and Unknowns
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03a-03h (quick mode); 03a-09 (full mode)
PART OF: Pre-SDD - [Project Name]
-->

# 10. Validation, Risks and Unknowns

<!-- Written in quick and full mode. In quick mode this chunk closes the discovery: the stage 1 values by status come from the register chunks, and the unknowns register below lists every open question with its impact, owner, and due date. -->

## 10.1 Validation and Unknowns

<!-- The engine renders the validation from the project state (fragment `10-validation.md`): the blockers (including the DT STOP and BLOCK findings), the conflicts (a failure scope the shape cannot satisfy, a hard entry an option breaks), and the advisories, each with its ID, message, owner, and entry; then the unknowns QD-NN, the open ones with their entry, impact, owner, and due date, and the closed ones with their resolution. A conflict is never smoothed over in prose. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 10-validation.md -->
**Blockers**

| ID | Message | Owner | Entry |
|----|---------|-------|-------|
| [Finding ID] | [Message] | [Owner] | [Entry ID, or none] |

**Conflicts**

| ID | Message | Owner | Entry |
|----|---------|-------|-------|
| [Finding ID] | [Message] | [Owner] | [Entry ID, or none] |

**Advisories**

| ID | Message | Owner | Entry |
|----|---------|-------|-------|
| [Finding ID] | [Message] | [Owner] | [Entry ID, or none] |

**Unknowns**

| ID | Question | Entry | Impact | Owner | Due | Status | Resolution |
|----|----------|-------|--------|-------|-----|--------|------------|
| QD-01 | [Question] | [Entry ID, or none] | [Impact] | [Owner name] | [YYYY-MM-DD] | [open / closed] | [Resolution, when closed] |
<!-- /ENGINE-FRAGMENT -->

## 10.2 Risks

<!-- The risks the register and the shape imply, beyond the engine's findings: each with likelihood, impact, mitigation, owner, and the IDs it rests on. A high risk still open at G3 must be closed or formally accepted by an empowered owner (G3-11, DT-15); never accept one in prose. -->

| Risk | Likelihood | Impact | Mitigation | Owner | Linked IDs |
|------|------------|--------|------------|-------|------------|
| [Risk] | [Low / Medium / High] | [Low / Medium / High] | [Mitigation] | [Owner] | [Entry, finding, or QD IDs] |

## 10.3 Hard Entries Still Open

<!-- Every hard entry (kind `hard`) that is Open, with its owner and due date, and the exception that lets it pass, if any (EXC-NN, who granted it, its expiry and review date, from the gate fragment in chunk 11). Only a named person grants an exception. In quick mode there is no gate: list the Open hard entries only. Write "None" when there are none. -->

| Entry | Owner | Due | Exception |
|-------|-------|-----|-----------|
| [Entry ID] | [Owner name] | [YYYY-MM-DD] | [EXC-NN: granted by <name>, expires YYYY-MM-DD, review YYYY-MM-DD; or "None"] |

<!-- Footer: in quick mode PREV is 03h-register-economics.md and NEXT is none, since chunk 10 is the last chunk quick mode writes. -->
<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 09-decisions.md | NEXT: 11-gate-and-sign-off.md -->
