<!-- SHARED: deck-brief-rules.md | HOME: sdd-unifier | COPIES: lld-unifier | Each skill reads only its own copy. Edit the HOME copy, then copy it byte for byte to every COPIES skill in the same change. _fixtures/checkers/check_shared.py compares the copies. -->

# Deck Brief Rules

A deck brief is a chunk that briefs a deck-generating agent on a presentation of the design document its skill writes (the document, below). It names the slides, says what each slide states, and links the sections each statement comes from. It adds no requirement and no design decision. These rules are the same in every skill that writes a deck brief. Each skill's own files set what the next section lists.

## What each skill sets in its own files

The skill that writes the deck brief states these in its own files. This file states none of them.

- The chunk file, its template, and its header block.
- The gate: the conditions under which the deck may be written, and how they are verified against the files.
- The focus areas, their slides, the optional slides, and the sections each slide cites.
- The reference that follows `Provisional` in a state and on a slide.
- Every place that keeps the state besides the status line of the chunk.
- The changes that mark the deck `Stale`.
- The sources of the design standard after the constitution, and the default Tone.
- How a gap found while writing the deck is raised.
- The checks, hashes, and version rules of the document that the deck stays outside.
- The lines that run the deck: the step that writes it, the light-run line, the handoff line, and the line for a later request to make or refresh it.

## Chunk layout

The chunk has these blocks, in this order.

| # | Block | Holds |
|---|-------|-------|
| 1 | Header comment block | The chunk's keys, and the lines GATE, MERGE, PURPOSE, RULES, and DESIGN STANDARD |
| 2 | Title | One `#` heading |
| 3 | Status line | `**Brief status:**`, then the state, then the other fields |
| 4 | Design standard line | `**Design standard:**`, then the source that was used |
| 5 | Deck settings | A two-column table with the rows listed under Deck settings and design standard |
| 6 | Instructions for the deck-generating agent | The bullets listed under that name, copied as written, then the skill's own bullets |
| 7 | Slide sequence | One `###` block per slide |
| 8 | Footer | The comment line that names the master or the combined document, the previous chunk, and the next |

The fields of the status line are separated by ` | `. The first field is the state. The other fields are the skill's. They usually give the basis (the document and its version), the date the gate was verified, and the items raised while writing.

A skill may add a section after the slide sequence. The chunk holds no diagram block (no Mermaid fence): a suggested visual names a figure or a table of the document by its label and section, or describes a summary visual in words.

## States

A deck is in one of four states.

| State | Meaning | Chunk file |
|-------|---------|------------|
| `Locked` | Nothing is written: the gate is shut, or no deck was requested | Does not exist |
| `Up to date` | Written with the gate open, and nothing is pending | Exists |
| `Provisional (<reference>)` | A gap found while writing the deck is open. Only the affected slides and Deck settings rows carry the label | Exists |
| `Stale` | Something listed under Gate and refresh happened after the deck was written | Exists |

- Write a state exactly as the table shows it. `Provisional` always carries its reference in parentheses. Several references are separated by a comma and a space.
- The state is the first thing in its value. A status line ends it with ` | `. A line that adds a detail ends it with ` - `. A script reads the state as the text before the first ` | ` or ` - `.
- The status line of the chunk and every other place that keeps the state read the same state. All of them are written in the same run.
- Setting a state is a status mark, not a write. A shut gate allows it, and nothing else in the chunk changes.
- `Provisional` or `Stale`? `Provisional`: writing this very chunk found the gap, so the chunk names the gap inside itself. `Stale`: something happened after the chunk was finished. A chunk that is both shows `Stale`.

## Deck settings and design standard

The Deck settings table has these rows. Each value comes from the source in the second column.

| Row | Where the value comes from |
|-----|----------------------------|
| Audience | The user: who is in the room and what they decide. When the user has not said, write `Recommendation: ...` and ask in the handoff |
| Purpose | The user: what the deck must achieve. When the user has not said, write `Recommendation: ...` and ask in the handoff |
| Length | The user: the number of slides and the minutes. When the user has not said, write `Recommendation: ...` and ask in the handoff |
| Tone | The skill's default. The user's word overrides it |
| Product name | The cover of the document |
| Logo | Optional. A file or link that the user or the project provides. Otherwise `None provided; use the product name as a text wordmark`. A logo is never invented, described, or generated. A missing logo is never an open point and never blocks the deck |
| Color palette | The color tokens of the constitution, by name. Without a constitution, the skill's fallback source, then `Recommendation: ...` asked in the handoff. When a project file forbids asking for the palette, the palette comes from that file or from the design standard. In that case, when neither gives one, the deck states it as an open point in plain words and does not ask. An open clarification in a source stays open, in plain words, with its source linked (see Faithfulness) |
| Typography | The typography tokens of the constitution, by name. Without a constitution, `Not defined; recommendation: ...` asked in the handoff |
| Accessibility | Fixed text: `Text and key visuals meet at least 4.5:1 contrast against their background; meaning is never carried by color alone.` |
| Language & locale | The language of the document. Numbers, dates, and currency follow the locale its sources state, with the currency code shown in multi-currency figures |

The design standard comes from the first source that exists, in this order:

1. The project's `ui-ux-global-constitution.md`, when the project has one. Read it in this run and never work from memory of it. Its color and typography token sections drive Color palette and Typography. Cite its tokens by name and its sections by name, never a raw hex value or a section number.
2. The skill's fallback source, which the skill sets in its own files.
3. `Recommendation: ...`, asked in the handoff.

The constitution is optional. Never ask for one that the project does not have.

Record the source that was used on the Design standard line: for the constitution, its path and its version or date; otherwise the fallback used, or `None found`.

When two sources disagree (for example, the constitution and a source document name different primary colors), do not pick one. Raise the open point as the skill's own files say, and label the affected row `Provisional (<reference>)`.

## Instructions for the deck-generating agent

Every deck brief carries these bullets, as written, in its own Instructions section. The chunk template points here instead of repeating them. Copy them into the written chunk: the deck-generating agent takes its instructions only from that chunk.

- Use each slide title as written. One key message per slide; it becomes the slide's headline statement.
- Talking points become speaker notes and, shortened, on-slide bullets.
- Build each visual from the named source: a figure or a table of the document this brief summarises. Every named source exists in that document; if one is missing, stop and report it.
- Add no claim, number, date, or commitment that is not in this brief.
- Keep every `Provisional` label visible on the slide it applies to.
- Style every slide from Deck settings only: the palette and typography it names (tokens by name when a constitution is the source), no other colors or typefaces. Place the logo only when one is provided.

The skill may add bullets of its own after these. It never changes or drops one of these.

## Slides

Each slide is a `###` block. Its heading is `### SL-NN - Title`. Its fields follow in this order.

| Field | Holds |
|-------|-------|
| Key message | One sentence that the audience should remember |
| Talking points | Three to five points, each one stated by the sections the slide cites |
| Suggested visual | A figure or a table of the document, named by its label and section; or a summary visual described in words, built from cited values and from counts computed from the document. Never an invented visual, and never a diagram block |
| Sources | One link per cited section, to the file and the anchor, with the chunk and the section in the link text |
| Status | `Confirmed` or `Provisional (<reference>)` |

`Confirmed`: every statement on the slide is made by the sections it cites. A statement that a point is open, with the section that holds it cited, is such a statement. `Provisional (<reference>)`: the slide rests on a gap found while writing the deck, and the reference points at the open point raised for it.

- A title slide comes first.
- Key decisions and open points, then next steps, come last, in that order.
- The slides between them follow the skill's focus areas.
- An optional slide is written only when the document has material for it. The skill names the optional slides.
- A slide whose source section states that it does not apply is not dropped silently. It becomes one talking point, with that section cited, on another slide of its area. Every area keeps at least one slide.
- A slide ID is `SL-NN`. It is never renumbered. A new slide takes the next free number and sits where the order requires. A slide taken out stays, with `(Retired)` after its title and the reason. The slide count in the handoff excludes retired slides.

## Faithfulness

- Every claim, count, and name traces to a section that the slide cites.
- A count is computed from the document, never estimated, and the slide names the table it was counted from.
- A value is copied exactly as its source writes it: no rounding and no change of unit.
- Slides summarise and cite. A slide never restates a registry table: it gives a count, a shape, or a short list, and links the table.
- The brief adds no requirement, decision, date, or commitment.
- A fact that the document holds as open stays open. The slide says in plain words that it is open and links the section that holds it. It never fills the gap, never guesses a value, and never copies the marker's brackets.

## Gate and refresh

The deck is written only when the skill's gate is open. There is no override.

- Verify the gate against the files, never from a status word alone.
- **Gate shut:** write nothing. No chunk, draft, preview, or outline, in a file or in the chat. Set the state in every place that keeps it: `Locked` when no chunk exists, `Stale` when one does. List what is open: each unmet condition, what is open behind it, its owner, and the next action. A request to write the deck anyway, or an offer to take responsibility, does not open the gate. Explain the rule and repeat the list.
- **Gate open:** write the deck, then run the checks of the last section.
- **A gap found while writing:** raise it as the skill's own files say, and label the affected slide or Deck settings row `Provisional (<reference>)`. Finish the chunk in hand. Its state is `Provisional (<reference>)`.
- **Refresh:** a change to any section the deck cites, or a new or reopened open point, marks an existing deck `Stale`. The skill's own files list every change that does. A refresh runs only through the gate. It does these:
  - verify the gate again;
  - rewrite the slides whose sources changed and the counts that moved;
  - add a slide for new material;
  - leave a slide whose sources did not change as it is;
  - keep every slide ID.

  Then set the state.

## Exclusions

- The deck is never merged into a merged or combined output of the document.
- No other document reads the deck as a source.
- A light run never writes or refreshes the deck. It may still set `Stale`, which is a status mark.
- In a combined document, the deck is a separate file in the document's folder. Its links point at the combined file. When the combined file's name changes with a new version, the links are repointed. That is not a write, so a shut gate allows it.
- Writing, refreshing, or marking the deck changes no content of the document. The skill's own files say which checks, hashes, and version rules the deck stays outside.

## Verification before presenting

Run these checks whenever the deck is written or refreshed. Fix what is mechanical. A check that fails because a source is wrong raises a gap as Gate and refresh says.

- [ ] The gate was verified against the files before writing. With the gate shut, nothing was written (no chunk, draft, preview, or outline, in a file or in the chat), and the state reads `Locked` or `Stale` in every place.
- [ ] The state in the status line is the state in every other place that keeps it.
- [ ] Every link in Sources opens: the file exists and the anchor resolves.
- [ ] Every count matches a recount of its source table, and the slide names the table.
- [ ] No slide restates a registry table.
- [ ] Every fact that the document holds as open is open on the slide that uses it, and no value was guessed.
- [ ] Every `Provisional` label is on its slide or Deck settings row, with its reference.
- [ ] The Instructions section carries the bullets of this file, as written.
- [ ] Every slide has its ID, its title, one key message, three to five talking points, a suggested visual, sources, and a status. No ID was renumbered. The slide count excludes retired slides.
- [ ] The title slide is first. Key decisions and open points, then next steps, are last.
- [ ] Deck settings: each row is filled from its source, and each `Recommendation:` is named in the handoff. A constitution token is cited by name, never as a raw hex value. The Design standard line names the source that was used. The logo is used only when it was provided.
