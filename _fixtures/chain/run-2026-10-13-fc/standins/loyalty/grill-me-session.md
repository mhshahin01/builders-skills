# Grill-me session: Loyalty Points BRD v1.1 (key LOYALTY)

| | |
|---|---|
| **Date** | 2026-10-10 (fixture run FC) |
| **Run by** | Product Owner stand-in (platform helper agent), under the full-autonomous run policy set by Mahmoud on 2026-10-08 |
| **Skill** | grilling, read from disk: `C:\Users\negat\.claude\skills\grilling\SKILL.md` (`grill-me` is only a pointer to it) |
| **BRD** | `run\brd-loyalty-points\` (v1.1), read in full: master, chunks 00-14, decision-log.md, source-snapshot-v1.0 |
| **Started from** | 14-todo.md § Step 3: the ready-to-use handoff prompt (lines 166-177) and the "Take into the session" list (lines 158-164) |
| **What the stand-in may decide** | Only a BRD recommendation: an open item's Recommended Answer, or a `proposed` marker's proposal. Every other question stays open for the product owner. No fact was supplied. |
| **Files edited during the session** | None in the BRD. This file is the only output. |

## 1. Taken into the session

| Group | Items | Count |
|-------|-------|-------|
| Open questions and pending decisions | TD-01 to TD-31 (TD-28 taken in but not asked: it is kept for the product owner, 14-todo.md:105, :162, :172) | 31 |
| Unresolved consistency findings | None (14-todo.md:163) | 0 |
| Requirements to stress-test | UC-01 AC-1; UC-02 AC-1; NFR-01; NFR-02; NFR-05; UC-01 (Business Objective 2); UC-02 (Business Objective 1); UC-02 BR-3; UC-02 BR-4; UC-02 BR-5 (union of 14-todo.md:164 and :174) | 10 |
| **Total** | | **41** |

Open OIs with a Recommended Answer: none (chunk 13 has OI-01 to OI-19, all Accepted - applied). The BRD's only takeable recommendations are therefore the three `proposed` markers: TD-06 (03-definitions-and-domain-concepts.md:24), TD-13 (10-nfrs.md:19), TD-15 (08-integrations.md:19).

## 2. Design tree and rounds

Dependencies come from the BRD's own "Blocks" column in 14-todo.md where it states one, and otherwise from the question text (noted where so).

| Prerequisite (open) | Downstream question | Basis |
|---------------------|---------------------|-------|
| TD-02 rounding | TD-03 partial refund; N2; N8 | Points taken back on a partial refund need the rounding rule (question text) |
| TD-12 data-protection law | TD-09 detail retention; TD-10 deletion time | 14-todo.md:89: TD-12 blocks 03 / Keeping points history and 03 / Member leaves |
| TD-16 POS Records owner | TD-19 POS confirmed; TD-21 same-day check | Both questions need the POS Records owner (14-todo.md:96, :98) |
| TD-21 Assumption 1 | TD-13 NFR-03 proposal | 14-todo.md:98: TD-21 blocks NFR-03; the proposal reads "matching Assumption 1" (10-nfrs.md:19) |
| TD-22 baseline | TD-23 target; then TD-24 date | "go down from [baseline] to [target] by [date]" (01-executive-summary-and-context.md:32) |
| TD-17 Refunds Portal owner | N4 | Only the owner can confirm how soon a paid refund is reported |
| TD-01 sign-in; TD-11 leave event | N5 | Question text |
| TD-04 start date; TD-05 earlier program | N9 | Question text; applies only if TD-05 is yes |
| D2 (Refunds Portal row) | N11; N12 | Arise from the row as proposed |

**Round 1 (27 questions).** TD-01, TD-02, TD-04, TD-05, TD-06, TD-07, TD-08, TD-11, TD-12, TD-14, TD-15, TD-16, TD-17, TD-18, TD-20, TD-22, TD-25, TD-26, TD-27, TD-29, TD-30, TD-31; stress-test questions N1, N3, N6, N7, N10. Outcome: TD-06 and TD-15 settled by their BRD proposals (D1, D2); the other 25 stay open.

**Round 2 (2 questions).** Settling D2 unblocked N11 and N12. Both stay open.

**Never reached the frontier (13 questions).** TD-03, TD-09, TD-10, TD-13, TD-19, TD-21, TD-23, TD-24, N2, N4, N5, N8, N9: each depends on a round-1 question that stayed open, so asking it would mean guessing at an unheard answer (SKILL.md:8, :24).

**End state.** No question is left that can be answered with a BRD recommendation. The frontier is not empty: it is blocked by questions only the product owner can answer.

## 3. Numbered decision list

| # | Settles | Option taken | Where the BRD recommends it | Chunk and section it changes |
|---|---------|--------------|-----------------------------|------------------------------|
| D1 | TD-06; `proposed` marker at 03-definitions-and-domain-concepts.md:24 | Points do not expire in this release. | The marker's proposal (03-definitions-and-domain-concepts.md:24), placed by the OI-16 Recommended Answer, Option A (decision-log.md:358-361) | 03 / Points movement / Overview, "Expiry" line: the marker becomes "**Expiry:** Points do not expire in this release." |
| D2 | TD-15; `proposed` marker at 08-integrations.md:19 | Add a Refunds Portal row to Table 6: Business Purpose "Know which purchases are refunded, so the system takes their points back"; Information Exchanged "Refund reference, purchase reference, refunded amount, date the refund was paid"; Direction "We receive". | The marker's proposal (08-integrations.md:19); the information list comes from the OI-09 Recommended Answer (decision-log.md:210), kept open for confirmation (decision-log.md:214) | 08 / Integrations, Table 6: new Refunds Portal row; the marker is removed. The proposal names no Criticality (open: N11) and no Provider / Owner (the open TD-17 fact). |

Notes on the decisions:

- D1: 14-todo.md:82 and :87 show TD-05 and TD-07 block "03 / Points movement" as a section. Neither changes whether points expire, so D1 was asked in round 1. If TD-05 is answered yes, the "Opening balance" movement kind (decision-log.md:69) is also covered by D1 as worded.
- D2 takes the proposal as written. Its gaps are new questions N11 and N12, not changes to the proposal.

## 4. Questions left open for the product owner

Reason codes: **No rec** = the BRD holds no recommendation; **Fact** = a missing fact the BRD does not hold; **Blocked** = depends on an open question (never put); **Other** = explained in the row.

| Q | Question | Source | Reason |
|---|----------|--------|--------|
| TD-01 | Which use case, integration, or outside party signs the member in? | 06a-use-cases-member.md:44 (UC-01 Preconditions; UC-02 at :94) | No rec (a scope choice; no option is recommended) |
| TD-02 | When a purchase amount is not a whole number of euros, are points rounded down, up, or to the nearest whole point? | 03-definitions-and-domain-concepts.md:32 | No rec (three options, none recommended) |
| TD-03 | When only part of a purchase is refunded, how many points are taken back? | 06a-use-cases-member.md:111 (UC-02 BR-1) | Blocked by TD-02; No rec |
| TD-04 | From which date do branch purchases earn points? | 03-definitions-and-domain-concepts.md:38 | Fact |
| TD-05 | Do members have points from an earlier program that must show as an opening balance? | 03-definitions-and-domain-concepts.md:40 | Fact |
| TD-07 | When a complaint about points is upheld, how is the balance corrected? | 03-definitions-and-domain-concepts.md:26 | No rec. The Reviewer Notes scope proposal "staff correct a member's points" (13-open-items-and-clarifications.md:214) is not an OI Recommended Answer or a `proposed` marker, so it was not taken |
| TD-08 | Which team receives and decides member complaints about points? | 04-scope-and-personas.md:23 | Fact |
| TD-09 | How long are the purchase and refund details behind a movement kept? | 03-definitions-and-domain-concepts.md:44 | Blocked by TD-12; Fact |
| TD-10 | How long after a member leaves are their points history and purchase details deleted? | 03-definitions-and-domain-concepts.md:48 | Blocked by TD-12; Fact |
| TD-11 | Which system or team records that a member has left the program? | 03-definitions-and-domain-concepts.md:50 | Fact |
| TD-12 | Which data-protection law applies to members' points and purchase data? | 03-definitions-and-domain-concepts.md:52 | Fact |
| TD-13 | Confirm or replace the proposal that earned points show by the end of the purchase day. | 10-nfrs.md:19 (`proposed` marker) | Other: the proposal is takeable, but it is tied to Assumption 1 and TD-21 blocks NFR-03 (14-todo.md:98). TD-21 is still open, so taking it now would assume Assumption 1 holds. Take it once TD-21 is confirmed. |
| TD-14 | How many minutes per month may the points screens be unavailable, planned maintenance included? | 10-nfrs.md:20 | No rec (a business number) |
| TD-16 | Who owns POS Records? | 08-integrations.md:17 | Fact |
| TD-17 | Who owns the Refunds Portal dependency? (also the D2 row's Provider / Owner) | 02-glossary-assumptions-facts.md:54 | Fact |
| TD-18 | Is the Refunds Portal needed before the build of UC-02, before BAT sign-off, or before go-live? | 02-glossary-assumptions-facts.md:54 | No rec (three options, none recommended) |
| TD-19 | Is the POS Records dependency confirmed, with its owner and treatment agreed? | 02-glossary-assumptions-facts.md:55 | Blocked by TD-16; Fact |
| TD-20 | Is POS Records needed before the build of UC-01, before BAT sign-off, or before go-live? | 02-glossary-assumptions-facts.md:55 | No rec (three options, none recommended) |
| TD-21 | Confirm with the POS Records owner that every branch purchase by a member is known the same day. | 02-glossary-assumptions-facts.md:32 (Assumption 1) | Blocked by TD-16; Fact |
| TD-22 | How many calls about points do branches receive per month today? | 01-executive-summary-and-context.md:32 | Fact |
| TD-23 | How many branch calls about points per month is the target after go-live? | 01-executive-summary-and-context.md:32 | Blocked by TD-22; No rec |
| TD-24 | By which date must the branch-call target be reached? | 01-executive-summary-and-context.md:32 | Blocked by TD-23; No rec |
| TD-25 | What is the current state today, and what problem does Loyalty Points solve? | 01-executive-summary-and-context.md:25 | Fact |
| TD-26 | Which known facts drive the design of Loyalty Points? | 02-glossary-assumptions-facts.md:38 | Fact |
| TD-27 | Which known risks or data problems affect Loyalty Points? | 02-glossary-assumptions-facts.md:44 | Fact |
| TD-28 | What is the brand or key color? | 11-summary-and-uiux.md:19 | Other: not asked; kept for the product owner (14-todo.md:105, :162, :172; 13-open-items-and-clarifications.md:219) |
| TD-29 | How many movements does the history show at once, and how does the member reach older ones? | 11-summary-and-uiux.md:20 | No rec |
| TD-30 | Can the member filter the points history? | 11-summary-and-uiux.md:21 | No rec |
| TD-31 | Which languages, and which date and number formats, do the screens use? | 11-summary-and-uiux.md:24 | No rec |
| N1-N12 | See § 5 | | |

## 5. New questions raised by the session

Routing follows 13-open-items-and-clarifications.md:12: a question that needs a business choice can become an open item; a missing fact stays a TD item only. The routing below is a suggestion for brd-unifier, not a decision.

| Q | Question | Raised from | Reason open | Suggested routing |
|---|----------|-------------|-------------|-------------------|
| N1 | UC-01 AC-1 tests only a positive balance (120). Should an acceptance criterion cover the OI-19 case: a member whose movements add up to 0 sees 0 and the date of the last movement, without the A1 explanation? | Stress-test UC-01 AC-1 (06a-use-cases-member.md:53, :63) | No rec | Open item |
| N2 | UC-02 AC-1 tests a full refund (-50 of 50). Which acceptance criterion covers a partial refund? | Stress-test UC-02 AC-1 (06a-use-cases-member.md:119) | Blocked by TD-03 (and TD-02) | Open item, after TD-03 |
| N3 | NFR-01 says "The points balance is always right." Replace it with the reviewer's wording "The points balance always equals the sum of the member's points movements"? | Stress-test NFR-01 (10-nfrs.md:17; 13-open-items-and-clarifications.md:225) | Other: a Reviewer Note editorial, not an OI Recommended Answer or a `proposed` marker, so not takeable. It was also left out of CF-05, which covered 00, 01 and 02 only (14-todo.md:143) | Open item (Reviewer Note whose choice is needed) |
| N4 | NFR-02 promises take-backs within 1 hour of payment, but no assumption says how soon the Refunds Portal reports a paid refund (Assumption 1 covers only POS Records). Does it report soon enough, as confirmed with its owner? | Stress-test NFR-02 (10-nfrs.md:18; 02-glossary-assumptions-facts.md:32) | Blocked by TD-17; Fact | TD item |
| N5 | What does a person who has left the program see if they open their points? 03 says the balance closes, but UC-01 and UC-02 have no flow for it, and NFR-05 relies on knowing who the member is. | Stress-test NFR-05 (10-nfrs.md:21; 03-definitions-and-domain-concepts.md:48) | Blocked by TD-01, TD-11 | Open item |
| N6 | Who counts branch calls about points, before and after go-live, so the Objective 2 measure can be checked? | Stress-test UC-01 / Business Objective 2 (01-executive-summary-and-context.md:32; decision-log.md:92) | Fact | TD item |
| N7 | Members learn of a take-back only by opening the history. Add "Tell the member when points are taken back after a refund" to UC-02 / Future Enhancements? | Stress-test UC-02 / Business Objective 1 (13-open-items-and-clarifications.md:215) | Other: a Reviewer Notes scope proposal, not an OI Recommended Answer or a `proposed` marker. It also needs a way to send messages that the BRD does not name, and a new provider needs product-owner approval (:215) | Open item |
| N8 | With several partial refunds of one purchase, BR-3 takes each paid refund back once. Can the total taken back for one purchase ever exceed the points it earned, for example through rounding? | Stress-test UC-02 BR-3 (06a-use-cases-member.md:113) | Blocked by TD-02, TD-03 | Open item |
| N9 | If members carry points over from an earlier program, a refund of a purchase made before the start of points takes back nothing under BR-4, though its points may sit in the opening balance. Is that intended? | Stress-test UC-02 BR-4 (06a-use-cases-member.md:114; 03-definitions-and-domain-concepts.md:38-40) | Blocked by TD-05 (only if yes) and TD-04 | Open item |
| N10 | Under BR-5 a paid refund waits until its purchase earns points. What happens if the purchase never reaches Loyalty Points, or reaches it only after the member has left? | Stress-test UC-02 BR-5 (06a-use-cases-member.md:115; 03-definitions-and-domain-concepts.md:48) | No rec | Open item |
| N11 | What is the Criticality of the new Refunds Portal integration row? (02 lists the Refunds Portal as a Hard dependency; the proposal names no criticality.) | D2 (08-integrations.md:15-19; 02-glossary-assumptions-facts.md:54) | No rec | Open item |
| N12 | The D2 row lists the date the refund was paid but no refund outcome, while UC-02 BR-1, AC-4 and AC-9 rely on the Refunds Portal reporting rejected and cancelled refunds. Should the row also carry the refund outcome (paid, rejected, cancelled)? | D2 (06a-use-cases-member.md:111, :122, :127) | No rec | Open item (or a consistency finding at the step 2 recheck) |

## 6. Confirmation

The Product Owner stand-in confirms that the session took place on 2026-10-10 and hands back decisions D1 and D2, both taken from the BRD's own proposals under the full-autonomous run policy. The two decisions are understood the same way on both sides.

Shared understanding was not reached on the open questions above. The grilling skill ends a session only when the frontier is empty and the user confirms (SKILL.md:28), and that cannot happen here. Under 14-todo.md:155, the new questions N1 to N12 reopen steps 1 and 2. The product owner still has to answer the questions in §§ 4 and 5.

## 7. Where the skill or the handoff prompt was unclear or could not be followed

1. SKILL.md:8, :13-22: every question should carry "your recommended answer". The stand-in may voice only the BRD's recommendation, so questions without one were put with "None in the BRD".
2. SKILL.md:8, :24 against 14-todo.md:171: the prompt says "Grill me in this order", while the skill orders questions by frontier. The frontier was followed, keeping the prompt's order within each round.
3. SKILL.md:26: facts are to be found by a dispatched sub-agent. The BRD folder (including source-snapshot-v1.0) was read directly instead, and no sub-agent was dispatched. None of the open facts is in the BRD.
4. SKILL.md:8, :24, :28: "wait for the user's answers", "done when the frontier is empty" and "until the user confirms" assume a person who answers. Here the interviewer and the answering stand-in are the same agent. The frontier never empties, because 13 questions sit behind open ones.
5. 14-todo.md:164 against 14-todo.md:174: the prompt's stress-test list leaves out "UC-01 (Business Objective 2), UC-02 (Business Objective 1)", which the "Take into the session" table includes. The union was used.
6. 14-todo.md:166, :169: the prompt calls `/grill-me` (a pointer to grilling) and uses the relative path `./brd-loyalty-points/`. The BRD is at `run\brd-loyalty-points\`.
7. 14-todo.md:52 says "Decide TD-01 ..., then the P2 rows TD-02 to TD-24, then run /grill-me", but step 3 takes those same rows into the session (14-todo.md:162). The session was run as instructed.
8. 13-open-items-and-clarifications.md:214-216, :225: Reviewer Notes hold recommendations and suggestions that are neither an OI Recommended Answer nor a `proposed` marker. They were not taken (TD-07, N3, N7). If they count as BRD recommendations, N3 and N7 could be settled.
9. 10-nfrs.md:19 with 14-todo.md:98: TD-13 has a proposal, but the BRD's own Blocks column makes it depend on TD-21, so it was held open (see § 4).
