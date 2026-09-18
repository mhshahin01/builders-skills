# Writing Style - Plain Language

An easy BRD is a requirement, not a nice-to-have. Every reader should understand every sentence on the first read: a business owner, a new team member, a tester, a reader whose first language is not English, and an AI agent.

**The style in four words: simple, clear, precise, easy.** Simplicity is essential. If a simpler way to say it exists, use it.

This style applies to everything the skill writes: all BRD chunks (00-13), the delivery chunks (14-17), table cells, diagram labels, Summary lines, open items, test cases, slides, and voiceover.

---

## The rules

| # | Rule | How |
|---|------|-----|
| 1 | Short sentences | One idea per sentence. Aim for 20 words or fewer. Split anything longer. |
| 2 | Common words | Pick the word a customer-service agent would use. See the word list below. |
| 3 | Active voice, present tense | "The manager approves the request." Not "The request shall be approved by the manager." |
| 4 | Name who does it | Every action has an actor: a persona, the system, or a named business partner. No "it is expected that". |
| 5 | Be precise | Use the number, the name, the date, the limit. "Within 30 days", not "in a timely manner". If the value is unknown, write `[NEEDS CLARIFICATION: ...]`; never hide it behind a vague word. |
| 6 | One term for one thing | Choose the Glossary term and use it everywhere. No synonyms for variety ("customer", "client", "user" for the same person). |
| 7 | Define once | Expand an acronym the first time it appears in a chunk and define it in the Glossary. |
| 8 | One action per step | A Main Flow step holds one actor action or one system response. |
| 9 | Lists and tables over long paragraphs | Three or more items become a list. Comparisons become a table. Paragraphs stay under about 5 lines. |
| 10 | Say it once | No filler, no warm-up sentences, no repeating the heading in the first line. |
| 11 | Positive and direct | "Only managers can approve." Not "It is not the case that non-managers are permitted to approve." No double negatives. |
| 12 | Clear obligation words | "must" for a rule, "can" for a permission, "may" only for a real option. Avoid "should" for a requirement. |
| 13 | No em dash | Use a comma, a colon, or a short hyphen with spaces. |

**Simple does not mean vague or incomplete.** Keep every number, date, name, rule, exception, and limit from the source. Keep the business's own domain terms when the business really uses them, and define them in the Glossary. Simplify the wording, never the requirement.

---

## Word list

| Instead of | Write |
|------------|-------|
| utilize, leverage | use |
| facilitate, enable the ability to | help, let |
| in order to | to |
| prior to / subsequent to | before / after |
| commence, initiate | start |
| terminate, cease | end, stop |
| approximately | about |
| in the event that | if |
| with regard to, pertaining to | about |
| is able to, has the capability to | can |
| at this point in time | now |
| functionality | feature |
| perform a verification of | check |
| provide a notification to | notify, tell |
| ensure that | make sure |
| in a timely manner | within [the stated time] |
| seamless, robust, best-in-class, state-of-the-art, user-friendly | delete, or state the measurable expectation |
| and/or | "or", or list both cases |
| etc. | name the items, or stop the list |

---

## Before and after

| Hard to read | Easy to read |
|--------------|--------------|
| "Upon successful completion of the authentication process, the user shall be redirected to the dashboard whereupon pending items requiring attention will be presented." | "The user signs in. The system opens the dashboard and shows the items that need attention." |
| "The system should facilitate the efficient management of refunds in a timely manner." | "The manager approves or rejects a refund request. The customer is told the decision within 1 working day." |
| "In the event that the payment partner is unavailable, appropriate error handling will be leveraged." | "If the payment partner is unavailable, the system tells the customer the payment did not go through and keeps the order for 30 minutes." |

---

## The plain-language pass (mandatory)

After writing the body and again after writing the delivery chunks, reread every chunk and fix what fails these checks:

- [ ] Could a new team member with no background understand each sentence on the first read?
- [ ] Is any sentence longer than about 20 words, or does it carry two ideas? Split it.
- [ ] Is there a simpler word with the same meaning? Use it.
- [ ] Is any word vague ("fast", "easy", "flexible", "appropriate", "as needed")? Replace it with the fact, or flag it with `[NEEDS CLARIFICATION: ...]`.
- [ ] Is the same thing called by two names? Keep the Glossary term.
- [ ] Does every step and rule say who does what?
- [ ] Did simplifying drop a number, a rule, or an exception? Put it back.

The pass does not rewrite the fixed wording of the skeletons, identifiers, links, file names, or citation strings such as `UC-04 AC-3`. It rewrites the sentences the skill authored.

When a transform source uses heavy or legal wording, rewrite it in plain language and keep the facts exactly (numbers, dates, names, commitments).
