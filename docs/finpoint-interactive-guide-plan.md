# Finpoint: interactive first-use and help plan

Brainstorm and proposed product behavior, 7 October 2026. Complements `finpoint-video-plan.md`. No application features are implemented by this document. The accompanying clickable concept only simulates one lesson with fictional data.

## Recommendation

Build **a small learning layer around real tasks**, with three ways to get help:

1. **Learn by doing:** a short optional practice lesson that ends with one complete Record.
2. **Help here:** a concise explanation beside the control or status that raised the question.
3. **Help & guides:** a permanent, searchable collection of task guides, examples, and troubleshooting.

The first-use experience should answer “What do I do next?” The contextual help should answer “What does this mean here?” The guide should answer “How do I do something I haven't learned yet?”

These serve different moments. Put them behind one consistent Help entry so users do not need to learn three disconnected systems.

### What success looks like

A newcomer can import supported activity, explain a purchase with a Record and Allocation, understand why something remains Pending, and retain a backup. They can stop the tutorial without losing their place and find the relevant explanation later.

They do not need to configure Categories, targets, Budgets, and Google Drive before using Finpoint. Starter Categories and buckets already exist and should support the first task.

## 1. First visit: one useful choice

Show a compact, dismissible welcome card on the Dashboard once the workspace is ready. Keep the app usable while data loads; do not add a boot gate.

Suggested content:

> **Make sense of your account activity**
>
> Import your Statements, explain them with Records, and see what still needs attention.

Actions:

- **Try a 2-minute example** — recommended for someone who has never seen Finpoint.
- **Import my Statements** — for someone ready with a supported export.
- **I already have a backup** — opens the existing restore workflow, preserving its review and replacement decision.
- **Explore on my own** — dismisses the welcome and leaves Help available.

“2 minutes” is an initial estimate to validate in usability checks, not a timed challenge. Do not show a countdown.

First-use detection must distinguish these states:

| State | Appropriate behavior |
|---|---|
| Workspace still loading | Wait for readiness before deciding whether to show welcome; keep normal placeholders. |
| Only seeded Categories/buckets exist | Offer the welcome card. Seeded defaults alone do not indicate an experienced user. |
| Imported Statements but no Records | Suggest explaining a Statement; do not send the user back through import. |
| Existing or restored workspace | Offer Help unobtrusively; do not require a first-run tour. |
| Lesson paused | Offer Resume from Help or the small setup card. |
| Welcome dismissed | Respect dismissal on later visits. |
| User deleted all financial data | Do not infer that they forgot how to use Finpoint. Offer a restart link, not a forced welcome. |

Keep “Restore backup” separate from “Import Statements.” They have different purposes and restore replaces browser data.

## 2. Practice lesson: one purchase, one clear result

### Proposed lesson: “Explain a $12 lunch”

Use a tiny fictional dataset: one Account, one imported-style Statement for −$12, and the needed starter Category. Show a persistent **Practice · sample data** label and an **Exit practice** action.

| Step | User action | Teaching content | Completion condition |
|---|---|---|---|
| 1. See the activity | Select the $12 lunch Statement. | “This Statement shows $12 left the Account.” | The intended sample Statement is selected. |
| 2. Explain it | Create a Record titled Lunch and choose Dining Out. | “A Record describes what the payment was for.” | A meaningful title and Category have been supplied. |
| 3. Assign the amount | Inspect Record amount −12 and Allocation −12. | “This Allocation assigns all $12 to Lunch.” | The proposed Allocation is valid for the Statement. |
| 4. Save and inspect | Save the practice Record. | “The amounts tally. This Record is Complete.” | Persisted practice state has at least one Allocation; its sum equals the Record amount; no amount remains allocable on this sample Statement. |
| 5. Continue by choice | Start with real data, try a split, or leave. | Explain the next task in one sentence. | No additional lesson is compulsory. |

Do not award completion just because the user clicked Next or opened the editor. Verify the relevant saved outcome.

### Let mistakes teach

If the user saves a −$10 Record with a −$12 Allocation, preserve that valid Pending state in the practice exercise and explain:

> **There is a $2 difference**
>
> Your Record says $10 paid, but its Allocation assigns $12 paid. For this lunch example, make both amounts $12 paid.

Actions: **Review amounts**, **Explain Pending**.

The lesson goal is a complete lunch Record. A Pending Record is nevertheless a valid app concept, not an invalid form simply because this exercise is unfinished.

If the Allocation exceeds the Statement's remaining capacity or has the wrong direction, use normal validation and explain the relevant constraint. Do not simulate a successful operation the real app would reject.

Avoid unexplained “Wrong!” messages, forced quizzes, stars, streaks, or grades. A helpful result is enough: “Lunch is explained. Nothing remains to allocate.”

### Practice must be separate from personal data

This is essential to the proposed design. **The current Load demo data action replaces the browser workspace. It cannot be reused as the first-use practice button.**

For an initial lesson, prefer a contained in-memory exercise with explicit sample data. It can reuse suitable presentational controls and pure domain calculations, but must not mount production providers or call the production database/sync mutation paths. Make the exercise's simplified interface clear. A full replica of the app is not required.

If a full practice workspace is later wanted, it needs a deliberately isolated data context and a hard separation from Drive, import/export, and production mutations. Merely changing a label or disabling one Sync button is not sufficient.

Rules:

- No practice Records or Statements enter the personal database.
- No practice changes trigger Drive sync or appear in personal backups.
- Practice starts without a bank export or Google connection.
- Exit preserves the real workspace and returns to where the user started.
- Restart resets only the exercise.
- “Use my own data” exits practice before navigating to the real Importer. Never copy sample Accounts into personal data.
- Do not promise cross-device tutorial progress; keep initial progress local.

## 3. Guided use with real data

After practice, offer a small checklist rather than a mandatory sequence of modal dialogs:

| Milestone | Action | What the guide checks |
|---|---|---|
| Bring in activity | Open Importer | An import succeeds and relevant Statements are available. An import with skipped duplicates may still be useful; inspect the outcome rather than demand a positive inserted count. |
| Explain one purchase | Open Allocator | The user deliberately selects an eligible Statement and saves a valid complete Record. |
| Check the result | Open that Record or Monthly Records | The saved explanation and Allocations are visible. Merely opening a route is not proof that the user understands it. |
| Understand backup | Open Sync | Show manual backup and optional Drive choices, with accurate status. |

Progress labels should reflect available evidence: **Imported**, **Record complete**, **Reviewed**, **Backup download requested**, or **Drive up to date** as appropriate. A browser-triggered file download is not proof that a recoverable file reached a safe location; ask the user to check their downloads without claiming “Your data is safe.”

On a workspace that already contains activity, suggest the next useful task rather than retroactively declaring the user has learned everything. Separate personal learning progress from current workspace facts.

### How the guide sits beside the app

- Desktop: a compact help panel that can remain visible beside the task.
- Mobile: a collapsible instruction card near the task or a dedicated help view with a clear return action. Avoid covering a form, its submit action, or the keyboard with a floating sheet.
- Offer **Show me where** on demand. Briefly highlight or scroll to the actual control; do not dim the whole app by default.
- Give each step one action and one sentence of explanation. Expand **Why?** for a worked example.
- Keep **Pause guide** available. Reopening restores the relevant topic and rechecks the state.
- Preserve form input and the current view when opening and closing help.
- Observe successful saves and resulting data, not click counts or timeouts. If the user completes the task another valid way, accept it.
- If a target is hidden by a dialog, navigation, permissions, or an unresolved live query, explain the prerequisite or fall back to the article. Do not leave a floating arrow pointing at nothing.
- On real data, never choose a Category, change a treatment, remove an Allocation, or resolve a replacement simply to satisfy tutorial progress.

## 4. Contextual help: the strongest everyday feature

Provide help next to the confusing concept, using the user's current numbers where the relationship is objective. Keep such calculations local. Do not infer why a purchase occurred from its description.

| Location | Trigger | Proposed answer / action |
|---|---|---|
| Record Pending badge | “Why Pending?” | Show Record amount, allocated sum, and the difference. If there are no Allocations, state that explicitly, including for a zero-amount Record. Open its editor for review. |
| Pending Statement badge | “What happens next?” | Explain imported replacement, with a separate warning that Record completion is a different question. |
| Allocation field | “What am I assigning?” | Show Statement amount, already allocated amount, and remaining capacity. Explain paid/received direction. |
| Category/treatment/bucket fields | “How are these different?” | “Category: what it was for. Treatment: how it affects totals. Bucket: which spending group.” Show the dinner example. |
| Treatment selector | “Help me choose” | Ask the user about purpose and show examples; never automatically relabel the Record. |
| Bucket unavailable | “Why can't I choose a bucket?” | Explain whether the effective treatment is not spending-eligible or the chosen bucket is archived. |
| Monthly target scope | “This month or onward?” | A small calendar example showing default timing and month-specific precedence. |
| Import result | “What do these counts mean?” | Explain inserted, skipped unchanged, and ordering updates; link to Allocator. |
| Empty Allocator | State-sensitive help | No imported activity → Import; filters hide activity → inspect filters; no remaining allocable amounts → this queue is clear, but Pending Records or pending replacements may still exist. |
| Empty Records | State-sensitive help | Explain whether activity is absent or filtered. Do not tell a user with imported Statements that they must import again. |
| Dashboard pending amounts | “Are these included?” | Explain that applicable Pending Records already contribute to displayed totals. |
| Dashboard scope | “What does Daily include?” | Identify the actual scope of that card; clarify it does not necessarily change other cards. |
| Net contributions | “Why is this negative?” | Show withdrawals minus contributions. Clarify this is cash direction, not investment performance. |
| Automatic attach on a Budget | “Which Records are included?” | Explain date-based membership and that it is not restricted to Spending treatment. Recommend checking the attached list. |
| Sync conflict | “Which copy should I keep?” | Explain each direction and what it replaces. Offer local backup and review, not a preselected destructive choice. |

For amount-based help, prefer phrasing such as “The amounts differ by $60” over “Your friend owes $60.” Finpoint knows the arithmetic; the user knows the real-world reason.

If there is no exact contextual answer, offer the relevant general guide and a way back. Do not produce a confident diagnosis from an empty list alone.

## 5. Help & guides: a permanent destination

Proposed sidebar item: **Help & guides**. Also expose a small **Help** action in the persistent header. Both open the same content, scoped to the current page when appropriate.

Organize by user intent:

- **Get started:** how Finpoint works; first Record; supported imports; restore an existing backup.
- **Explain activity:** split a purchase; combine Statements; repayments; refunds; transfers; saving/investment; the two Pending states.
- **Understand your totals:** income/spending; pending inclusion; actual versus future; chart scope; comparisons.
- **Plan spending:** Category defaults; buckets and monthly targets; custom-period Budgets.
- **Find and fix:** missing activity; incomplete Allocations; wrong Category/treatment; replacement unavailable; surprising Budget total.
- **Keep your data:** local storage; backup; restore; Drive; conflicts; demo/reset.

Each article should provide:

1. A plain question as its title.
2. The direct answer in one or two sentences.
3. One worked example using the video's fictional amounts.
4. Short steps with current control labels.
5. The visible result to expect.
6. An optional **Try an example** action when a practice lesson exists.
7. An optional video chapter/clip, playable by choice.
8. **Open [relevant screen]**, with prerequisites explained and no hidden mutation.

Examples of search language: “money back,” “friend paid me,” “missing purchase,” “pending,” “transfer,” and “new phone.” Search should map informal phrases to canonical topics. A query for “transaction” may find Records and Statements, while the answer teaches the correct distinction.

Start with bundled articles and a local keyword/alias index. The core help must work without an AI service or a video player. Avoid promising that the whole app can first load offline merely because help content is bundled.

An AI chat assistant can be evaluated later if real unanswered questions justify it. It brings cost, privacy, and answer-quality work without being necessary for the core onboarding problem. The MVP can provide specific contextual help through deterministic rules.

## 6. Optional practice library

After the first lesson, show a few short, independent lessons. Do not put a “finish all lessons” gate in front of ordinary use.

| Lesson | Exercise | Success proof | Video counterpart |
|---|---|---|---|
| Explain a purchase | −$12 lunch → one Record | One complete Record; no remaining allocable amount | S02, S05 |
| Split a purchase | −$80 → −$60 Groceries and −$20 Shopping | Two complete Records; original Statement unchanged | S07 |
| Account for a repayment | −$90 and +$60 → −$30 Dinner | Signed sum tallies; repayment not salary | S08 |
| Understand Pending | Compare a missing Allocation with an allocated Pending Statement | User can identify which item needs what action | S10 |
| Replace a placeholder | Imported −$25 replaces Pending −$25 | Same Record and Allocation; no duplicated expense | S10 |
| Choose a treatment | Refund, transfer, salary, saving | Correct effects on income/spending/saving totals | S09 |
| Set a monthly target | $600 onward; $700 one month | Prior and later months retain correct targets | S13 |
| Trace a surprising total | Drill from Dashboard to Records | Identify scope and the contributing Records | S15 |

Allow **Show me an example**, **Try it myself**, and **Read the steps** where all three actually exist. Never ship disabled choices advertising unfinished lessons.

## 7. Relationship to the video

Share the concepts and examples, but make each format stand on its own:

- Video explains and demonstrates.
- Practice lets the user perform the action and see feedback.
- Contextual help explains the current screen or state.
- Articles provide a fast reference.

Use the same lesson IDs and a content map: question, vocabulary, example amounts, expected outcome, route, article, practice lesson, and video chapter. Control labels and domain meanings should be checked in one content review whenever the app changes.

Do not autoplay the full video on first visit. For a user asking about Pending, a relevant short clip is more useful than jumping into a long introduction. Keep text steps available so video is optional for accessibility, bandwidth, and speed.

## 8. Scope and build order

### First release: a useful foundation

- Persistent Help & guides entry plus page-specific help links.
- Welcome choices and a resumable first-use checklist.
- One isolated lunch practice exercise, including the Pending mistake/recovery path.
- Six strong help topics: core model, import, Pending Record, Pending Statement, Category/treatment/bucket, and backup/restore.
- Dynamic “Why Pending?” explanation from saved amounts.
- Context-aware empty states on Records and Allocator.

If time is constrained, release the articles, contextual help, and checklist first, followed by the isolated lunch exercise. Do not substitute the destructive demo loader to rush practice into the first release.

### Second release: the cases people actually ask about

- Split, repayment, and replacement lessons.
- Search aliases and focused troubleshooting guides.
- Short video clips attached to matching topics when produced.
- Treatment decision examples and bucket target explanations.

### Later, only if justified

- A fuller isolated practice workspace using more real UI.
- Advanced analytics and Budget lessons.
- Optional user feedback on whether a topic helped.
- Additional languages and richer accessibility testing.

A site-wide tour engine, gamification, comprehensive simulated banking, and AI chat are not prerequisites for this plan.

## 9. Design decisions and edge cases

| Decision | Recommended behavior |
|---|---|
| Forced or optional? | Optional, with a visible next useful step. |
| One long tour or short tasks? | Short tasks with outcomes; learn advanced features when needed. |
| Where does progress live? | Separate local learning metadata, not finance rows or synced financial settings. |
| When is a step complete? | After its saved outcome is observed; “read/reviewed” is tracked separately. |
| What if data changes elsewhere? | Recompute the current task's eligibility; preserve the topic and explain the changed state. |
| What if an import fails? | Stay at that step, show the actual error and relevant guide, preserve input when possible. |
| Unsupported bank? | Explain current support honestly. Do not manufacture a generic importer or a manual Account workflow. Offer sample practice and the accurate support information. |
| User leaves halfway? | Pause; preserve valid work and form state as appropriate. Resume by checking what remains. |
| User clicks around freely? | Keep the guide recoverable. Do not force navigation back or discard edits. |
| No matching target control? | Offer steps as text and let the user navigate normally. |
| Tutorial content changes? | Version lessons; show new material unobtrusively without erasing past progress. |
| Deleting a practice attempt? | Reset only practice. Never call Clear all data on the personal workspace. |
| Help opened from a form? | Restore focus and retain unsaved values when closed. |
| Keyboard/screen reader use? | Native controls, logical focus order, labelled help, status announcements after actions, no drag-only or hover-only instruction. |
| Reduced motion? | Instant or restrained highlights; all instructional meaning remains in text and state. |
| Privacy? | Calculate contextual help locally. Do not send amounts, titles, descriptions, or bank identifiers to a help service. |

Do not persist inferred claims such as “user understands Allocations” merely because their workspace contains complete Records. Store that a lesson was completed or dismissed; that is what the app actually knows.

## 10. Implementation boundaries for a later agent

These are architectural recommendations, not an implementation request.

- Keep help content and small guide UI outside domain operations. UI calls `logic/*`; it does not directly import Dexie.
- Expose read-only guide context through logic functions, combining readiness, counts, selected item status, and exact arithmetic. A finite set of rules selects relevant help.
- Keep routes centralized in `src/routes.ts`. Proposed Help and practice routes must be added there when implemented; they do not exist today.
- Store local progress separately from the financial settings included in export/sync. Current `settings` is part of `SYNC_TABLES`; using it casually would synchronize tutorial clicks and dirty the Drive copy. Use an explicit local-only design and document reset behavior.
- Avoid reusing the production `Boot` and auto-sync lifecycle inside practice. Production currently opens a singleton database and starts sync; a sample label would not isolate it.
- Keep a stable lesson state: lesson version, current step, completed/reviewed steps, dismissed status, and selected target only where needed. Revalidate deleted or stale target IDs before using them.
- Observe outcomes through successful operations plus current read state. Keep presentation hints tolerant of navigation, async data loading, changed selection, and form dialogs.
- If highlights are implemented, use deliberate help targets rather than fragile text/CSS-position guesses. A missing target must degrade to text help.
- Respect the existing month shell and navigation. Help should not remount the page or clear live form state merely because it opens.
- Share the smallest useful pure functions between production and exercises; avoid rewriting all persistence just to ship a two-minute lesson. Check simulated semantics against real domain rules.

Current evidence: `app/providers.tsx` initializes the database and sync; `src/data/seed.ts` supplies defaults; `src/data/export-import.ts` replaces tables during restore and includes settings in sync; `src/logic/records.ts` derives Pending; `app/allocator/page.tsx` shows allocable Statements; `app/records/page.tsx` and `app/statements/page.tsx` expose the relevant creation controls. Recheck these files before implementation.

## 11. Acceptance and evaluation

Product verification should include:

- Fresh workspace, seeded-only workspace, imported-only workspace, restored workspace, dismissed welcome, paused guide, and data-load failure.
- Completing the first example through the normal path and a different valid path.
- Saving a valid Pending practice Record, receiving accurate help, fixing it, and seeing completion only afterward.
- Opening help with unsaved form data; closing help and continuing unchanged.
- Changing pages or filters mid-guide without broken overlays or forced back navigation.
- Running practice while personal data and a Drive connection exist, with zero writes to the personal database or Drive.
- Restoring a backup without falsely marking a person as a new learner or overwriting unrelated local guide progress accidentally.
- Mobile keyboard visibility, keyboard-only use, screen-reader labels, reduced motion, and no dependence on video or hover.

For usability, ask a newcomer to do three things without assistance: explain lunch; identify why an example is Pending; find the guide for a repayment. Observe where they stop or misinterpret the model. Proposed research targets are a first successful sample Record within about two minutes and finding relevant help within about thirty seconds; these are goals to test, not measured results.

Any later product analytics should use coarse lesson/topic IDs and outcomes without financial contents. Do not add tracking solely because this plan mentions evaluation. Initial user observation and voluntary feedback can answer whether the teaching works.

## 12. What the clickable concept demonstrates

The concept previews a short guided exercise, editable amounts, valid Pending feedback, contextual help, and an exit/resume path. All values are fictional and live only inside the concept. It is not a Finpoint screenshot or a functioning practice workspace, and it does not prove that production isolation has been implemented.

It is intentionally focused on the interaction contract. The later design model can improve layout, visual hierarchy, and motion once the learning sequence is accepted.
