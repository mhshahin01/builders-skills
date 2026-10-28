# Tutorialize Unifier

The Mentor / assistant (Software Development & Delivery) in the unifier company. It is a companion skill, not a numbered stage of the product documentation chain: it turns an interview scenario or a technical concept into a teaching package. It reads `unifier-status.md` for context only and never writes it. See the repo-root `README.md` ("Companion skill: tutorialize-unifier") for how it sits beside the chain.

---

## What

`tutorialize-unifier` answers and teaches an interview scenario (system design, architecture, migration, customer advisory) or explains a technical concept as a tutorial. One run produces one consistent package:

1. A spoken-style answer in chat ("as you would in the room").
2. The concepts behind the answer, explained one by one.
3. One to three interactive diagrams shown inline.
4. An exported tutorial: one Markdown file plus one standalone HTML file per diagram, linked together.

It has two modes, picked in step 0:

| Mode | Input | Example |
| ---- | ----- | ------- |
| Scenario | An interview prompt | "Scenario N: ...", "walk me through", "how would you advise" |
| Concept | A topic | "explain CQRS", "teach me the strangler fig" |

The audience ranges from the user preparing for senior interviews to juniors they teach, so the wording stays simple and clear.

## Why

- **One package, one voice.** The chat answer, the decision log, the diagrams and the exported file all come from the same content, so they never disagree.
- **No duplication.** Each fact lives in one place in the Markdown file; other sections link to it. Decisions carry IDs that the diagrams and later sections cite.
- **Teaches, not only answers.** Every answer comes with its concepts, and the diagram patterns are chosen to show how the system works, how options compare, or how data moves for beginners.
- **Checked before delivery.** The skill verifies its own output: the em dash, diagram behavior in light and dark mode, and links (step 6).
- **Same everywhere.** Claude (claude.ai and the desktop app), Claude Code, Codex and Kimi Code follow the same steps and produce the same output; only the tools differ.
- **Plain files.** Deliverables are Markdown plus standalone HTML diagrams, never Word unless asked.

## How

### Usage

```text
tutorialize-unifier
```

The skill takes no arguments. Describe the scenario or the concept in plain words. It does not ask questions unless the prompt is truly ambiguous; it states its assumptions inside the answer instead.

Invocation prefix depends on the agent: `/tutorialize-unifier` in Claude Code, `$tutorialize-unifier` in Codex, `/skill:tutorialize-unifier` in Kimi Code. Or describe the task in plain words ("walk me through this system design scenario") and the agent picks the skill from its description.

`SKILL.md` has a "Running in different agents" section that maps the tools for the Claude app against the terminal and IDE agents: the chat message, the inline diagram, the task list, file delivery, and the browser check. A tool missing from one column never fails a step; the skill uses the other column.

Follow-up requests are handled in the same way, and `SKILL.md` lists them at its end: an interactive view of the chosen approach, an infrastructure and application component view, a beginner explanation, a decision list, how one decision is implemented, and an export of the conversation.

### The workflow

0. **Pick the mode and the file name.** Scenario or concept mode, and the next free file name. When `unifier-status.md` is present it is read for context only, to frame the answer.
1. **The chat answer.** Part 1 is the answer in the room (scenario mode) or a step-by-step lesson (concept mode); Part 2 is the concepts behind it (scenario mode) or related concepts (concept mode).
2. **Interactive diagrams.** One to three widgets, chosen from three patterns: Scenario explorer, Architecture stepper, and Follow-the-data junior view. Each widget's code is also saved to a file so it can be exported unchanged.
3. **Decision log.** One table of decisions with IDs, the decisions needing business sign-off, and the three to name out loud in the interview.
4. **Export the tutorial.** One Markdown file with the question, the answer, the decision log, the implementation, walkthroughs, failure cases, a concepts glossary and an interview cheat sheet.
5. **Export the diagrams.** Each saved widget is wrapped in a standalone HTML page with shared CSS that works in light and dark mode.
6. **Verify before delivering.** An em dash check, a browser run of every diagram with screenshots, and a link and decision-ID check.
7. **Deliver.** The files are sent or written next to each other, with a short closing: the recommendation, what each diagram lets the user do, and what was checked.

The exact content of each step lives in `SKILL.md`, not here.

### Outputs

- Scenario mode: `interview-NNN.md`, where NNN is the next number after any existing `interview-*.md` in the working folder or a connected folder (it starts at 001).
- Concept mode: `concept-<slug>.md`.
- One standalone HTML file per diagram, named with the Markdown file's stem, for example `interview-NNN-diagram-1-<slug>.html`. The widget bodies are first saved under `build/`.
- Keep the Markdown and HTML files in the same folder so the links work.
- In the Claude app the files are attached to the chat; in Claude Code, Codex and Kimi Code they are written to the working directory (or the folder the user named) and their paths are listed.
- This skill keeps no row on the status board and never writes `unifier-status.md`. It feeds no other skill.

### Reference files

| File | Contents |
| ---- | -------- |
| `SKILL.md` | The whole skill: modes, the eight steps (0 to 7), the diagram patterns, the shared HTML shell and CSS, the status board section (read only for this skill), and the follow-up requests |
