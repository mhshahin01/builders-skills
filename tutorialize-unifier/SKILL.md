---
name: "tutorialize-unifier"
description: "Use to answer and teach an interview scenario (system design, architecture, migration, customer advisory) or explain a technical concept as a tutorial: chat answer, concepts, decision log, interactive diagrams, and an exported Markdown file with HTML diagrams."
---

# Tutorialize Unifier

Turns an interview scenario or a technical concept into one consistent teaching package:

1. A spoken-style answer in chat ("as you would in the room")
2. The concepts behind it, explained one by one
3. 1 to 3 interactive diagrams shown inline
4. An exported tutorial: one Markdown file plus one standalone HTML file per diagram, linked together

You act as the Mentor / assistant (Software Development & Delivery) in the unifier company.

The audience ranges from the user preparing for senior interviews to juniors they teach, so everything is simple, clear and easy to follow.

## Running in different agents

This skill is shared by Claude (claude.ai and the desktop app), Claude Code, Codex and Kimi Code. The steps and output are the same everywhere; only the tools differ. Use whatever the current agent has:

| Need | Claude app (claude.ai / desktop) | Claude Code, Codex, Kimi Code (terminal or IDE) |
|---|---|---|
| Chat answer mid-task | `SendUserMessage` | Your normal reply text |
| Inline interactive diagram | visualize `read_me` then `show_widget` | No inline widgets: write the widget body straight to `build/<name>.html` and tell the user to open the exported page in a browser |
| Task list | `TaskCreate` / `TaskUpdate` | The agent's own plan or todo tool, if it has one |
| Deliver files | `SendUserFile` (display: attach) | Write the files into the current working directory (or the folder the user named) and list their paths |
| Browser check | Playwright with Chromium | Playwright if installed (`pip install playwright` then `playwright install chromium`); if it can't be installed, say the check was skipped |

Never fail a step because a tool from one column is missing: use the other column.

## House style (always)

- Never use the em dash character. Use commas, colons, parentheses or sentence breaks.
- Deliverables are Markdown (.md) plus standalone .html diagrams. Never Word/.docx unless explicitly asked.
- Plain, simple English. Short sentences. Define every acronym the first time.
- Sentence case for headings, buttons and labels.
- Mark invented numbers (latency, timings, percentages) as illustrative.
- No duplication: each fact lives in one place in the Markdown file; other sections link to it.

## Step 0: Pick the mode and the file name

- **Scenario mode:** the input is an interview prompt ("Scenario N: ...", "walk me through", "how would you advise").
- **Concept mode:** the input is a topic ("explain CQRS", "teach me the strangler fig").
- File name: scenario mode uses `interview-NNN.md` (look for existing `interview-*.md` in the working folder or connected folder and take the next number; start at 001). Concept mode uses `concept-<slug>.md`. HTML files use the same stem: `interview-NNN-diagram-1-<slug>.html`.
- Don't ask questions unless the prompt is truly ambiguous. State assumptions inside the answer instead.
- When the working folder or a connected folder holds `unifier-status.md`, read it for context only (which hops exist, their states, open handoff requests) and use it to frame the answer. This skill keeps no row and never writes the board; when the file is missing, carry on without it.

If the task has several tool calls, set up a short task list (answer + diagrams, export, browser check). In the Claude app, load `SendUserMessage` first.

## Step 1: The chat answer (sent as a chat message)

### Scenario mode: "Part 1: Simulated interview answer (step by step)"

Write it as spoken in the interview, with key lines in *italic quotes*. Use this skeleton and adapt step names to the scenario:

1. **Play back the real problem / clarify before designing.** Restate the hidden constraint (e.g. "two clocks, not one").
2. **Clarifying questions** as a table: `# | Question | Why it matters`. End with *"I'll assume reasonable answers and design from there."*
3. **What the constraints rule out**, or **do the math out loud** (latency budget, timeline, capacity). Use a table.
4. **Options table:** `Option | <each constraint> | Cost | Verdict`, with ✅ ❌ ⚠️ and the recommended row in bold.
5. **The recommendation:** architecture or plan, with numbered key ideas. Name real services (AWS etc.) and why each one.
6. **Prove it:** budget, timeline, capacity or risk table.
7. **Tradeoffs for the business / stakeholder handling:** `Tradeoff | Question for leadership`. If people conflict (CTO vs CFO), give the exact sentence to say and the techniques behind it.
8. **Phased rollout.**
9. **Closing statement** in one quoted paragraph.

Then **"Part 2: The concepts behind the answer"**: 15 to 20 numbered concepts, each as:

```
### N. Concept name
**What:** one plain sentence.
**Why it matters here:** one sentence tied to this scenario.
```

### Concept mode: "Part 1: Learn it step by step"

1. One-line definition
2. Everyday analogy
3. How it works, step by step (numbered)
4. Worked example with real-looking data
5. When to use / when not to use (table)
6. Common mistakes
7. How it shows up in interviews (likely questions + a model one-line answer)

Then Part 2: related concepts in the same What / Why format.

## Step 2: Interactive diagrams (inline)

Where an inline widget tool exists (the Claude app), call the visualize `read_me` silently first (modules: interactive, diagram), then `show_widget`. Elsewhere, build the same widget code and save it to a file only (see "Running in different agents"). Build 1 to 3 widgets. Pick from these proven patterns:

| Pattern | Use for | Must include |
|---|---|---|
| **Scenario explorer** | Compare options or what-if cases | Buttons per option/scenario, an SVG that highlights the active path, colored scorecard chips (pass/warn/fail), a live bar or slider (latency budget, timeline slip), a note explaining the lesson |
| **Architecture stepper** | Show how the system works or evolves | Boxes colored by layer (gray = people/sites, teal = infrastructure, purple = application), step buttons + prev/next, dimming of inactive boxes, animated dashed lines for active flows, chips per step, click any box for an explanation that cites its decision ID (AD-xx) |
| **Follow-the-data junior view** | Teach beginners | Plain names on top ("Front door", "Safe", "Mailroom") with the real service name underneath, a story stepper, and a "Data in hand" label that changes color as data moves from personal to masked to anonymous (or any state change) |

Widget rules:
- 680px wide viewBox, `role="img"` with title and desc, a hidden `h2.sr-only` summary, CSS variables for every color so dark mode works.
- No Tabler icons in widget code (use `&larr;` `&rarr;`), no `sendPrompt`, no external scripts, so the same code runs standalone.
- Check text widths so labels never overlap boxes or lines; put long labels outside bars and away from marker lines.
- Save each widget's code to a file (`build/<name>.html`) at the same time so it can be exported unchanged.
- Put explanation text in chat, not inside the widget. After each widget, write 1 to 3 short lines telling the user what to try first and which lesson to take.

## Step 3: Decision log

One table, IDs AD-01 upward:

`ID | Name | Description | Why | Consequences`

- 10 to 16 decisions. "Why" names the rejected alternatives for the core decision.
- Follow it with **Decisions needing business sign-off** (`ID | Question for leadership`).
- End with **The three to name out loud in the interview.**
- Diagram click-throughs and later sections reference these IDs.

## Step 4: Export the tutorial (Markdown)

Structure (adapt titles to the mode):

```
# Interview NNN: <title>
One-line description.
> About the diagrams: table of HTML files (link | what you can do | tutorial sections)
> Keep the HTML files in the same folder as this file so the links work.
## Table of Contents
## Part 1: The Question            (quote the prompt + "What the interviewer is really testing")
## Part 2: The Interview Answer, Step by Step   (the chat answer, with Mermaid diagrams)
## Part 3: The Decision Log        (+ sign-off table + three to name out loud)
## Part 4: How It Is Implemented (Cloud and Application)
     - building/plain-language analogy or "the picture" table
     - target architecture in Mermaid, green = infra, purple = app (classDef)
     - component table: Plain name | Service | Layer | What it does | Decision
     - implementation steps, runbooks, checklists, code/config snippets (IaC, JSON, IDs)
     - Who does what: Concern | Application (your code) | Platform (AWS)
## Part 5: Walkthroughs           (Mermaid sequence diagrams + step tables with a "Data in hand" or traffic column)
## Part 6: Scenarios and Failure Cases (what-if table + what goes wrong / what you do / prevention)
## Part 7: Concepts Glossary      (# | Concept | Simple explanation | Where it shows up)
## Part 8: Interview Cheat Sheet  (one-sentence answer, key one-liners, five standout points, likely follow-up questions)
```

Add `> **Interactive version:** [Diagram N](file.html)` under each section a diagram illustrates. Mermaid: use flowchart, sequenceDiagram; avoid gantt with numeric months.

## Step 5: Export the diagrams (standalone HTML)

Wrap each saved widget body in this shell, inlining the CSS below:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Short Title</title>
<style>/* SHARED CSS */</style>
</head>
<body>
<header>
<a href="interview-NNN.md">&larr; Back to the tutorial (interview-NNN.md)</a>
<h1>Diagram N: Name</h1>
<p>What you can do here. Tutorial sections: ...</p>
</header>
<main><!-- widget body --></main>
</body>
</html>
```

Shared CSS (supplies the widget host's variables and color classes, light and dark):

```css
:root{--surface-0:#FAF9F5;--surface-1:#F0EEE6;--surface-2:#FFFFFF;--text-primary:#1F1E1D;--text-secondary:#5E5D59;--text-muted:#8A8880;--border:rgba(31,30,29,.15);--border-strong:rgba(31,30,29,.3);--bg-accent:#E6F1FB;--text-accent:#185FA5;--border-accent:#85B7EB;--bg-success:#EAF3DE;--text-success:#3B6D11;--bg-danger:#FCEBEB;--text-danger:#A32D2D;--bg-warning:#FAEEDA;--text-warning:#854F0B;--radius:8px;--t:#8A8880}
@media (prefers-color-scheme:dark){:root{--surface-0:#1F1E1D;--surface-1:#2A2927;--surface-2:#30302E;--text-primary:#F5F4EE;--text-secondary:#C2C0B6;--text-muted:#9C9A92;--border:rgba(255,255,255,.12);--border-strong:rgba(255,255,255,.25);--bg-accent:#0C447C;--text-accent:#B5D4F4;--border-accent:#378ADD;--bg-success:#27500A;--text-success:#C0DD97;--bg-danger:#791F1F;--text-danger:#F7C1C1;--bg-warning:#633806;--text-warning:#FAC775;--t:#9C9A92}}
*{box-sizing:border-box}
body{margin:0;background:var(--surface-0);color:var(--text-primary);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6}
header,main{max-width:720px;margin:0 auto;padding:0 20px}
header{padding-top:24px}
header a{color:var(--text-accent);font-size:14px;text-decoration:none}
h1{font-size:22px;font-weight:500;margin:12px 0 4px}
header p{color:var(--text-secondary);font-size:15px;margin:0 0 16px}
main{padding-bottom:40px}
button{font:inherit;font-size:13px;background:transparent;color:var(--text-primary);border:.5px solid var(--border-strong);border-radius:var(--radius);padding:6px 10px;cursor:pointer}
button:hover{background:var(--surface-1)}
input[type=checkbox],input[type=range]{accent-color:#378ADD}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
svg text{font-family:inherit}
.t{font-size:14px;fill:var(--text-primary)}
.ts{font-size:12px;fill:var(--text-secondary)}
.th{font-size:14px;font-weight:500;fill:var(--text-primary)}
.box{fill:var(--surface-1);stroke:var(--border-strong)}
.node{cursor:pointer}
.node:hover>rect{stroke-width:1.5}
.c-gray>rect{fill:#F1EFE8;stroke:#5F5E5A}.c-gray>.th,.c-gray>.t{fill:#444441}.c-gray>.ts{fill:#5F5E5A}
.c-teal>rect{fill:#E1F5EE;stroke:#0F6E56}.c-teal>.th,.c-teal>.t{fill:#085041}.c-teal>.ts{fill:#0F6E56}
.c-purple>rect{fill:#EEEDFE;stroke:#534AB7}.c-purple>.th,.c-purple>.t{fill:#3C3489}.c-purple>.ts{fill:#534AB7}
.c-red>rect{fill:#FCEBEB;stroke:#A32D2D}.c-red>.th,.c-red>.t{fill:#791F1F}.c-red>.ts{fill:#A32D2D}
.c-green>rect{fill:#EAF3DE;stroke:#3B6D11}.c-green>.th,.c-green>.t{fill:#27500A}.c-green>.ts{fill:#3B6D11}
.c-amber>rect{fill:#FAEEDA;stroke:#854F0B}.c-amber>.th,.c-amber>.t{fill:#633806}.c-amber>.ts{fill:#854F0B}
@media (prefers-color-scheme:dark){
.c-gray>rect{fill:#444441;stroke:#B4B2A9}.c-gray>.th,.c-gray>.t{fill:#D3D1C7}.c-gray>.ts{fill:#B4B2A9}
.c-teal>rect{fill:#085041;stroke:#5DCAA5}.c-teal>.th,.c-teal>.t{fill:#9FE1CB}.c-teal>.ts{fill:#5DCAA5}
.c-purple>rect{fill:#3C3489;stroke:#AFA9EC}.c-purple>.th,.c-purple>.t{fill:#CECBF6}.c-purple>.ts{fill:#AFA9EC}
.c-red>rect{fill:#791F1F;stroke:#F09595}.c-red>.th,.c-red>.t{fill:#F7C1C1}.c-red>.ts{fill:#F09595}
.c-green>rect{fill:#27500A;stroke:#97C459}.c-green>.th,.c-green>.t{fill:#C0DD97}.c-green>.ts{fill:#97C459}
.c-amber>rect{fill:#633806;stroke:#EF9F27}.c-amber>.th,.c-amber>.t{fill:#FAC775}.c-amber>.ts{fill:#EF9F27}}
```

Build the pages with a short Python script that reads the CSS and each widget body and writes the final `.html` files next to the Markdown file.

## Step 6: Verify before delivering

1. `grep` every output file for the em dash character; the count must be 0.
2. Open each HTML file with Playwright and Chromium (preinstalled in the Claude app workspace; install it elsewhere, or say the check was skipped if that isn't possible) in light and dark color schemes. Click every button, slider and step via `page.evaluate`, collect `pageerror` events (must be none), and take full-page screenshots.
3. Look at the screenshots: no text crossing lines or boxes, no clipped labels, readable in dark mode. Fix and re-check.
4. Confirm every link in the Markdown points to a file that exists, and every AD-xx cited in a diagram exists in the decision log.

## Step 7: Deliver

- In the Claude app: send the `.md` and `.html` files together with SendUserFile (display: attach), with a one-line caption reminding the user to keep them in the same folder. If a folder on the user's computer is connected and they asked for files there, also write them there.
- In Claude Code, Codex or Kimi Code: write the files into the working directory (or the folder the user named), list their paths, and remind the user to keep them together.
- Close in a few lines: the one-sentence recommendation, what each diagram lets them do, and what was checked. No recap of steps.

## Status board

The chain skills hand work to each other through one shared file, the status board, and `tutorialize-unifier` reads it for context. Every skill that carries this section follows the same rules below, word for word.

- **File:** `unifier-status.md` in the project root, the folder that holds the hop folders (`./pre-brd-*`, `./brd-*`, `./pre-sdd-*`, `./sdd-*`, `./lld-*`). The first chain skill that runs creates it from the template below. Nobody deletes it.
- **Template:**

```markdown
# Unifier status board

Run mode: solo

## Employees

| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |
|---|---|---|---|---|---|---|---|---|
| Business development | Product Management & Business Development | pre-brd-unifier | - | Not started | - | - | - | - |
| Product manager | Product Management & Business Development | brd-unifier | - | Not started | - | - | - | - |
| Business owner | Product Management & Business Development | business-reviewer-unifier | - | Not started | - | - | - | - |
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | - | Not started | - | - | - | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Not started | - | - | - | - |
| Tech Lead | Software Development & Delivery | lld-unifier | - | Not started | - | - | - | - |
| Developer / software engineer | Software Development & Delivery | impl-tracker-unifier | - | Not started | - | - | - | - |

## Handoff requests

| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |
|---|---|---|---|---|---|---|---|---|
```

- **Times and text:** every time on the board is UTC. `Updated (UTC)`, `Raised (UTC)`, and `Closed (UTC)` use `YYYY-MM-DD HH:MM`. A cell with no value holds `-`. The board uses no em dash and no en dash.
- **Run mode:** the header line reads `Run mode: solo` or `Run mode: team`.
  - The skill that creates the board writes `solo`, unless its instructions say the project is run by a team.
  - Only the user changes it.
  - In `team` mode a hop never starts another skill. At a handoff it raises the request and stops, which keeps one owner per folder. The request waits for that employee.
  - In `solo` mode a hop offers to start the next skill in the same session. When the user accepts "now" and the runtime can start it (Claude Code can), the next skill starts in the same session. When the runtime cannot, the request waits for that employee. On "later", the raiser sets the request State to `Later` (Handoff requests table, below).
- **Employees table:** one row per employee, with the columns Employee, Team, Skill, Folder, State, Version, Updated (UTC), Next step, and Waiting on.
  - The board starts with a row for every current employee, marked `Not started`. A future employee adds its own row.
  - A skill writes only its own row, the one whose Skill cell names it.
  - The State cell holds one of: `Not started`; `In progress: <step>`; `Waiting on: <employee> (<request ID>)`; `Ready for handoff`; `Done v<X.Y>`; `Stale: <reason>`.
  - The Folder cell holds the path of the skill's output folder once that folder exists, and `-` until then.
  - The Waiting on cell holds `<employee> (HR-NNN)` for each pending request (`Open`, `Later`, or `Accepted`) whose answer this skill waits on to go on, separated by `; `, or `-` when it waits on none.
- **Handoff requests table:** one row per request, with the columns ID (`HR-NNN`), From, To, Request, Why, Raised (UTC), State, Closed (UTC), and Link.
  - The State cell holds one of: `Open`, `Later`, `Accepted`, `Done`, `Declined`.
  - The skill that raises a request writes its row, with State `Open`, or `Later` when the user chose later at the handoff offer, and owns every cell of it but State and Closed (UTC). On State, the raiser sets only `Open` or `Later`, and only on its own request while it reads `Open` or `Later`. The receiving skill alone sets `Accepted` when it takes the request (still pending: taken, not finished), then `Done`, or `Declined` when it declines it, with Closed (UTC), at the stop where it finishes it.
  - One request per blocker: before raising a request, the raiser looks for its own request to the same receiver about the same thing that is still `Open`, `Later`, or `Accepted`. When one exists, it raises no new request: it updates that request's Why, its Request wording when the blocker changed, and its own row's Waiting on cell, and uses that request at this stop.
  - When the user answers "later" at a handoff offer, the raiser itself sets State `Later` on the request it raised or reused at that stop; an `Accepted` request stays `Accepted`. A later run that offers again may move its own request from `Later` back to `Open`, for example when the user answers "now".
  - A new request takes the next number after the highest ID on the board. IDs are never reused or renumbered.
- **When a skill uses the board:**
  - At the start of every run it reads the board: its own row, the pending requests (`Open`, `Later`, or `Accepted`) addressed to it and the ones it raised, and the upstream states.
  - At every stop (a part checkpoint, a gate stop, a handoff, or a wait) it updates its own row.
  - At its handoff points it raises requests, or reuses its own pending one (Handoff requests table).
- **Concurrency:** there is no lock. Re-read the board just before writing, change only the cells you own, and keep the line structure (one table row per line, the column order) and the file's line endings. The accepted risk is two agents writing at the same instant.
- **Resuming inside a hop** still uses the skill's own master. The board's Next step points to it.
- **Writers outside the project root:**
  - `impl-tracker-unifier` runs in the code repo. It writes its row through the docs root its `tracking/config.md` records. When that path is unreachable, it skips the board update and says so in a note.
  - `tutorialize-unifier` only reads the board and has no row.

## Follow-up requests this skill should handle the same way

- "Visualize the selected approach interactively" leads to a Scenario explorer.
- "Show infrastructure and application components" leads to an Architecture stepper with layer views.
- "Explain like I'm a beginner / for juniors" leads to a Follow-the-data view plus a plain-language analogy table.
- "Give me a decision list" leads to the Decision log format above.
- "How is AD-xx implemented?" leads to numbered implementation steps covering both cloud and application, with config snippets and a one-sentence interview line.
- "Export the conversation" leads to the Step 4 + Step 5 export, merging duplicates and keeping every number and step.