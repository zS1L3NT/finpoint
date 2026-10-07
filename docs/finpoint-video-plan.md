# Finpoint from zero: video structure and teaching plan

Prepared 7 October 2026. This is a content and production blueprint, not an animation implementation or a word-for-word final voiceover. Product behavior was checked against the current local source. Exact clicks and rendered outcomes still need a rehearsal before recording.

## 1. The recommendation

Make **one chaptered beginner guide, also exportable as four shorter lessons**. Aim for roughly 27 minutes overall, with the viewer completing a real workflow within the first five minutes. The timings below are editing budgets, not a reason to rush a difficult step.

Suggested title: **Finpoint from scratch: import, explain, and understand your money**.

The central promise:

> Bring in your bank activity, explain what it was for, and see what still needs your attention.

The story follows Alex through a small, fictional month. Start with lunch, then introduce a supermarket purchase, dinner with friends, a transfer, a refund, saving, and an expense that has not appeared in the bank export yet. Each new feature answers a question Alex now has.

Avoid opening with a sidebar tour or a dashboard full of unexplained numbers. The first emotional payoff is “I can see what I have and haven't accounted for.” The dashboard is the payoff after the viewer understands where its numbers come from.

### Four exportable lessons

| Lesson | Approximate duration | Viewer outcome |
|---|---:|---|
| 1. Your first complete Record | 5 minutes | Import a supported file and allocate a Statement to a Record. |
| 2. Handle real life | 9 minutes | Split purchases, combine payments, handle repayments and refunds, and replace pending activity. |
| 3. Understand and plan | 9 minutes | Use Categories, treatments, buckets, Budgets, filters, and the Dashboard correctly. |
| 4. Keep it safe and keep it going | 4 minutes | Back up, understand Drive sync, and follow a repeatable routine. |

For the standalone first lesson, append a brief manual-backup demonstration and an end card pointing to the other lessons. A beginner should not need to watch the whole course before safely using Finpoint.

## 2. The problem, solution, and concrete fixes

### Opening narration direction

“You recorded a few purchases, missed a few days, and now your finance tracker and bank activity tell different stories. One payment might include several things. Several payments might belong to the same thing. And money coming back from a friend isn't necessarily new income. Finpoint lets you keep the bank activity and your explanation together, while showing what still needs attention.”

Use a relatable mismatch, not a claim that Finpoint is the only product with this capability. Do not promise that it automatically knows what every purchase means.

| Everyday problem | Finpoint's mechanism | Visible proof to show |
|---|---|---|
| “I forgot what I haven't recorded.” | Import Statements; review remaining allocable amounts in Allocator. | An unexplained $12 Statement leaves the working queue after being fully allocated. It remains available in Statements. |
| “The bank description doesn't explain the purchase.” | Create a Record with a useful title, Category, and optional context. | An opaque Statement description becomes “Lunch” in Records while the original Statement remains intact. |
| “One purchase contains different types of spending.” | Split a Statement into Allocations across Records. | An $80 payment becomes $60 Groceries and $20 Shopping; $0 remains allocable. |
| “I paid for everyone, but only part was mine.” | Allocate the outgoing payment and incoming repayment to one Record for the personal cost. | $90 paid and $60 received explain a $30 dinner Record. |
| “Moving my own money makes my totals misleading.” | Transfer/neutral treatment. | A $200 transfer does not add $200 of income or spending. |
| “A refund looks like salary.” | Explicit Spending treatment on a positive refund Record. | A $20 refund reduces spending by $20 without increasing income. |
| “I know about an expense before the bank export shows it.” | Pending Record; optionally a handwritten Pending Statement followed by replacement. | Later imported activity completes the existing work instead of creating a second expense. |
| “A holiday makes normal spending look unusually high.” | Categories describe meaning; buckets group spending; dashboard scopes separate views. | The same Record can be Dining Out and Travel. All spending still includes it. |
| “I want a monthly target and also a plan for specific dates.” | Spending bucket target versus Budget. | A persistent Daily target and a custom-period Budget are visibly different tools. |
| “I need to move devices or recover my work.” | Manual JSON backup and optional Google Drive sync. | Show the backup file, sync status, and the direction of a restore. |

These are user problems and workflow fixes. They are not a software bug-fix list.

## 3. Teaching rules

1. **Show a problem before naming its feature.** Lunch introduces Record; splitting shopping introduces Allocation flexibility; holiday dining introduces bucket overrides.
2. **Use one new idea at a time.** Initially teach only Statement, Record, and Allocation. Category gets a practical example before its defaults are explained.
3. **Repeat one sentence:** “The Statement shows account activity. The Record explains it. The Allocation says how much belongs to that Record.”
4. **Keep money direction visible.** In amount forms, negative means paid out and positive means received. Explain the actual `+/-` control. Amount filters use Paid/Received with positive inputs; those are a different control.
5. **Give every demonstration a visible end state.** A saved form alone is insufficient: show the Record, Allocation sum, remaining allocable amount, status, or relevant total.
6. **Separate editing the explanation from editing the evidence.** Records are user-managed. Imported Statements are not shown as freely editable. Handwritten Pending Statements have their own edit flow.
7. **Say what happens next.** “Now open Allocator” is better than ending at an import toast and leaving the viewer to guess.
8. **Treat empty states as normal.** No comparison history is expected for a new user. An empty filtered list does not prove there is no data.
9. **Include short practice pauses.** After the first Record, a split, and a pending replacement, let the viewer predict the result before revealing it.
10. **Keep the tone adult and reassuring.** Use “first time” and “step by step” in public copy. Never describe the audience as unintelligent.

## 4. Vocabulary, introduced only when needed

| Term | Spoken explanation | First example | Common confusion to prevent |
|---|---|---|---|
| Account | The financial account the activity came from. | Alex's DBS Account. | This is not a Finpoint sign-in. |
| Statement | Imported account activity from the bank export. | A $12 lunch payment. | In Finpoint this means an individual item, not necessarily an entire monthly document. |
| Record | Your explanation of a meaningful expense, income, transfer, or adjustment. | “Lunch,” $12 paid. | It does not have to equal one Statement. |
| Allocation | How much of a Statement belongs to a Record. | All $12 belongs to Lunch. | Creating an Allocation does not spend money again. |
| Allocable amount | The part of a Statement still available to assign. | $20 remains after allocating $60 of an $80 payment. | This is not an Account balance. |
| Pending Record | Its Allocations do not tally, none exist, or any allocated Statement is Pending. | A $30 dinner Record currently allocated only the $90 payment. | Matching amounts still need confirmed Statements; the status does not automatically mean a debt or forecast. |
| Pending Statement | Activity marked pending; a user can create a handwritten placeholder before imported activity arrives. | A known $25 transport charge awaiting import. | This is a different kind of pending from an incomplete Record. Supported Revolut imports can also carry pending status. |
| Category | What the Record is for. | Dining Out. | It can supply defaults, but is not itself a treatment or bucket. |
| Treatment | How the Record affects the totals. | Spending. | Automatic by direction cannot infer a refund or transfer's purpose. |
| Spending bucket | An optional persistent group for personal spending. | Daily or Travel. | It is not an Account or money held in an envelope. |
| Monthly target | A comparison amount for a bucket in a calendar month. | Daily: $600. | It does not reserve cash, carry a balance forward, or block spending. |
| Budget | A plan with its own amount, dates, and attached Records. | A seven-day plan. | Its membership and calculations are separate from bucket totals. |

Do not replace these terms with “transactions,” “matches,” or a new metaphorical naming system in the interface walkthrough. Ordinary verbs can explain the action, but return to the actual UI labels.

## 5. Master chapter flow

The suggested visual is a content requirement, not a style prescription. The next model owns layout, palette, motion, transitions, and final composition.

| ID | Time budget | Viewer question | Content and action | Suggested visual | Proof / transition |
|---|---|---|---|---|---|
| S01 | 0:00–0:45 | Why would I use this? | Present missed tracking and account activity that doesn't map neatly to personal spending. | Two short lists with an obvious missing item; preview the solved state. | Promise an explained purchase and a clear remaining-work queue. |
| S02 | 0:45–1:30 | Why are there Statements and Records? | Explain Statement → Allocation → Record using $12 lunch. | Two cards with a labelled $12 Allocation between them. | Ask “Did this create a second payment?” Answer: no. |
| S03 | 1:30–2:00 | What do I need before starting? | No Finpoint account required. Data lives in this browser. Use a supported export, or try demo data in a separate practice browser profile. | A short preparation card, then the real navigation. | Mention demo replaces current browser data; point to backup chapter. |
| S04 | 2:00–3:00 | How do I bring activity in? | Importer → bank → file → import; read inserted/skipped counts; open Allocator. | Focused UI walkthrough with one file. | Show the imported Statement and Account. |
| S05 | 3:00–4:45 | How do I finish my first item? | Select lunch → Create Record → title/date/amount/Category → inspect Allocation → save. | Actual form with only relevant fields emphasized. | Lunch exists; $0 remains allocable; Record is Complete. |
| S06 | 4:45–5:15 | What should I repeat? | Recap import → allocate → review → back up; quick manual backup and first-lesson end point. | Four steps and a downloaded backup file. | First independent practice task: repeat with salary. |
| S07 | 5:15–6:45 | What if one payment buys several things? | Split the $80 supermarket Statement into $60 Groceries and $20 Shopping. | One Statement, two Records; reveal one Allocation at a time. | $60 + $20 = $80; remaining amount becomes zero. |
| S08 | 6:45–8:45 | What if several payments explain one thing? | Dinner: $90 paid, $60 returned, personal cost $30. Show before and after repayment. | Two Statements feed one Record; keep a visible signed sum. | Pending becomes Complete when −$90 + $60 = −$30. |
| S09 | 8:45–10:45 | Which money changes count as spending? | Demonstrate transfer, refund, salary, and saving/investment treatments. | Five-row comparison, shown one row at a time; corresponding metric changes. | Transfer excluded; refund reduces spending; saving is separate. |
| S10 | 10:45–13:45 | What if the bank hasn't shown it yet? | Contrast Pending Record and Pending Statement; create a placeholder, allocate it, then replace it with imported activity. | Two-stage timeline plus actual replacement review. | Placeholder disappears; imported Statement inherits Allocations; Record is not duplicated. |
| S11 | 13:45–15:15 | How do I find or correct something? | Records versus Monthly Records versus Statements versus Accounts; search, filters, edit, detach, delete consequences. | “Where should I go?” map, then one correction. | Fix the explanation and show the updated result; clear a hiding filter. |
| S12 | 15:15–16:45 | How do I stop repeating the same choices? | Category defaults; one-level subcategories; override one Record when appropriate. | Meaning / treatment / bucket in three columns. | Dining Out normally defaults to Daily; holiday dinner can use Travel. |
| S13 | 16:45–18:45 | How do monthly targets work? | Default buckets; create/edit/archive; group and pacing; month-only versus selected-month-onward target. | Calendar strip plus bucket target panel. | Earlier months unchanged; a month override takes precedence. |
| S14 | 18:45–20:15 | What if my plan has its own dates? | Create a manual Budget; attach/detach Records; explain Automatic attach and inspect progress. | Bucket-versus-Budget comparison followed by real UI. | The intended Records are attached; unrelated salary is not included. |
| S15 | 20:15–23:15 | What are the charts telling me? | Totals, pending inclusion, savings, Daily versus Total scope, category history, pace, day/weekday charts, drilldowns, comparison setting. | Dashboard in focused sections; one question per chart. | Drill from a total to the underlying Records. |
| S16 | 23:15–26:15 | Where is everything saved? | Manual backup/restore, optional Drive setup/status/conflicts, another device, demo/reset, convenience features. | Browser ↔ file and browser ↔ own Drive; one direction at a time. | Show successful backup/sync; explain which copy a restore replaces. |
| S17 | 26:15–27:00 | What do I do from now on? | Weekly routine and three-question comprehension check. | A short repeatable checklist. | End on a concrete next action: import a small period and explain one purchase. |

## 6. Scene instructions and narration anchors

These anchors preserve meaning. The production model should write natural connective narration around them and rehearse the complete script aloud.

### S01–S03: establish the need and the model

**Starting state:** Alex has bank activity but an incomplete understanding of it. Show at most three items, not a wall of financial data.

**Narration anchors:**

- “Finpoint keeps the original account activity and your explanation of it together.”
- “A Statement shows what happened in an Account. A Record explains what it meant. An Allocation says how much of that Statement belongs to that Record.”
- “You can start without signing up. Your work is stored in this browser, so we'll also show you how to keep a backup.”

**Preparation:** open the app; locate Importer in the navigation. Use the starter Categories and buckets. Do not ask the viewer to design a taxonomy before making their first Record. On mobile, demonstrate opening the navigation once.

**Optional exploration branch:** Sync → Try demo data. Say that it replaces the current browser workspace before showing the action. For production, use a dedicated practice browser profile with no personal data or Drive connection. Demo data is useful for seeing a populated Dashboard, but the tiny teaching dataset is clearer for learning the core model.

### S04–S06: first success

**Import sequence:**

1. Obtain a supported bank export. Show a prepared file; bank-site download tutorials belong in separate, bank-specific supplements.
2. Open Importer and select DBS, OCBC, UOB, or Revolut.
3. Choose the corresponding export file. The picker accepts CSV/XLS/XLSX; this does not mean any spreadsheet layout is supported by every bank parser. Use a rehearsed file for the chosen bank.
4. For Revolut, select an existing Account or supply the new Account ID and name. The other supported importers obtain Account identity from their expected export layout.
5. Import and read the result: inserted Statements, unchanged Statements skipped, and any re-indexed Statements. Re-indexing concerns ordering, not a newly explained expense.
6. Open Allocator → Allocate to Records.

**Create lunch:** select the $12 outgoing Statement; click Create Record; set Title to Lunch, check Date & Time, retain amount −12, select Dining Out. Leave People, Location, and Description blank for the first example. Show that Category defaults fill the analytics choices. Check the Statement Allocation is −12, then Create Record.

**Proof:** open the resulting Record and show its Statement. Explain why it no longer needs Allocation in the working queue. Importing alone did not create the meaningful Record or populate spending analytics for that item.

**First backup:** Sync → Backup file → Download backup. Show the file arriving in downloads. Its JSON format is a Finpoint backup, not another bank export.

**Practice pause:** “Try the salary Statement next. Should the amount be paid out or received, and which Category fits?” Answer: +3000, Income. This can be a short assisted repeat rather than another full form tour.

### S07: split one Statement

**Question:** “I spent $80 in one place, but $60 was groceries and $20 was shopping. Do I need to change the imported Statement?”

**Action:** select the −80 Statement; create Groceries with Record amount −60 and its Allocation also −60. Save. Return to the remaining −20 allocable amount and create Shopping with Record and Allocation both −20.

**Narration anchor:** “The bank still shows one payment. Finpoint lets your explanation have two parts.”

**Critical distinction:** changing the Record amount alone does not necessarily change the Allocation amount. Show both fields. If the Record says −60 but its Allocation remains −80, it is Pending rather than the intended complete split.

**Proof:** show the original Statement with two Allocations, and both Records complete. Pause before revealing the second amount: “How much is left to allocate?”

### S08: combine Statements and explain repayment

**Before repayment:** Alex paid $90 for a dinner, but Alex's agreed personal share is $30. Create Dinner with Record amount −30 and allocate the −90 payment. The Record is Pending because −90 does not equal −30. This is a deliberate demonstration of work awaiting later account activity.

**After repayment:** import the +60 repayment. Select it in Allocator → Attach to Record → find the existing Dinner Pending Record. In the editor, retain the −30 Record amount and verify both signed Allocations before saving.

**Proof:** −90 + 60 = −30. The Record becomes Complete. Personal spending is $30; the friend's repayment has not been counted as salary.

**Narration anchors:**

- “Several Statements can explain one Record.”
- “Pending means the amounts haven't tallied yet. It does not, by itself, tell you that someone owes you money.”

The known $30 personal share already affects Record-based analytics before its Allocations are complete. Explain that the Pending cue invites review; it does not automatically exclude the Record from totals. If the real personal cost changes, edit the Record based on what actually happened.

### S09: treatment decision table

Start with “What does this money movement mean?” Then reveal the table row by row.

| Real situation | Record setup | Effect on Dashboard income/spending |
|---|---|---|
| Salary of $3,000 | +3000; Income | Income increases by $3,000. |
| Lunch costs $12 | −12; Spending | Spending increases by $12. |
| Refund of the $20 Shopping purchase | Separate +20 Record; Shopping Category; explicitly verify Spending treatment | Spending falls by $20; income is unchanged. |
| $200 moved between two of Alex's tracked Accounts | One Record for 0; allocate −200 and +200; Transfer/neutral | Income and spending unchanged. Both Statements are explained. |
| $300 contributed to an external savings/investment destination | −300; Saving/investment | Contributions +$300; income/spending unchanged. |
| $50 withdrawn from that destination | +50; Saving/investment | Withdrawals +$50; income/spending unchanged. |
| A genuinely ordinary inflow/outflow with no more specific treatment | Automatic by direction | Positive counts as income; negative counts as spending. It does not infer purpose. |

For the refund, retain the original −20 Shopping Record and create the +20 refund Record. Do not also reduce the original Record by $20: that would count the refund twice. A later-month refund affects the month of its refund Record in this example.

For a transfer whose destination Statement is absent, keep the explanation under review until the needed activity arrives. Use an ordinary transfer between tracked Accounts for the transfer example; use an external savings/investment destination for the saving example. Do not accidentally demonstrate the same movement as both kinds of Record.

**Savings sign explanation:** Contributions shows a positive $300 magnitude; Withdrawals shows $50. Net contributions is withdrawals minus contributions, so it is **−$250** from the tracked cash perspective. That negative value does not mean an investment loss. Finpoint is not demonstrating portfolio valuation or investment returns here.

### S10: two kinds of pending, then replacement

Show these states side by side before the replacement walkthrough:

| State | Record amount | Allocations | Meaning |
|---|---:|---:|---|
| Record created before account activity is available | −25 | None | Pending Record: the explanation exists but account activity is not yet allocated. |
| Handwritten Pending Statement allocated in full | −25 | −25 from a Pending Statement | The Record stays Pending while the Statement awaits imported replacement, even though amounts tally. |
| Imported Statement replaces the placeholder | −25 | Same −25 Allocation, now belonging to the imported Statement | The explanation is preserved; the placeholder is removed. |

**Walkthrough:**

1. Introduce a known $25 transport charge not yet in the export.
2. Show the simpler option: Records → Create Pending Record, then allocate the later imported Statement to it. Label this as an alternative, not an additional Record the viewer must create.
3. In the demonstrated placeholder branch, use the Pending Statement creation action from Statements or an Account detail page. Choose the correct existing Account, date/time, −25 amount, and description; allocate it to the Transport Record.
4. Later import the real −25 Statement.
5. Open Allocator → Replace Pending. Select the Pending Statement; inspect suggested replacements. Use the wider unallocated-import search when suggestions do not show the right activity.
6. Review Account, amount, date, description, and affected Records. Confirm Replace pending Statement.
7. Show the imported Statement carrying the existing Allocation, and the unchanged Transport Record. Confirm there is no second $25 expense. Briefly point out the alternate Replace Pending shortcut when one fully unallocated imported Statement is selected in the allocation tab.

**Narration anchor:** “Replace the placeholder; keep the work you've already done.”

Replacement needs the same Account and a fully unallocated imported destination. Existing Allocations must fit its direction and capacity. Amounts do not always need to be identical; use equal amounts for the beginner demonstration, then mention that differences require review. Suggestions help you choose; they are not automatic confirmation.

A Pending Statement keeps its allocated Records Pending. Matching amounts are necessary for completion, but the placeholder must also be replaced by confirmed imported activity.

### S11: finding and correcting work

| Question | Place to go | Demonstrate |
|---|---|---|
| What did I record, across dates? | Records | Search by title, person, location, or description; filter by Category, bucket, treatment, status, date, and amount; paginate. |
| What happened in this month? | Dashboard's Monthly Records tab | Month navigation, day grouping, filters, edit/open, and Open in Records for wider searching. |
| What did I import? | Statements | Search and filter by Account, allocation/pending status, dates, and amount; open the original activity. |
| Which financial Account did it come from? | Accounts | Open an Account's Statements and rename its display name. Do not invent manual Account creation or a live bank connection. |
| What still needs Allocation? | Allocator | Review available Statement amounts, with filters cleared when necessary. |

Demonstrate Paid → At least → 50 with a positive numeric input. Briefly introduce At most, Exactly, Between, and Received. The Both mode represents separate paid/received upper bounds; do not call it “either direction over $50.” Rehearse comparison modes and reopening the control before filming them.

**Correction example:** open Lunch → Edit → correct its title or Category → save. Then show how to adjust/remove an incorrect Statement Allocation in the Record editor and allocate it correctly. Explain that deleting a Record also removes its Allocations and Budget memberships, while imported Statements remain. Avoid casually deleting imported evidence as the proposed fix.

If something “disappears,” first inspect month, search, date range, Account, and status filters. In Settings, an empty default start date and no default end date let Records and Allocator open without those date restrictions. Today can intentionally hide future-dated items.

### S12: Category, treatment, and bucket

Use the same dinner three times, rather than three unrelated examples:

| Question | Field | Ordinary dinner | Dinner while travelling |
|---|---|---|---|
| What was it for? | Category | Dining Out | Dining Out |
| How should totals treat it? | Treatment | Spending | Spending |
| Which spending group should contain it? | Spending bucket | Daily | Travel |

Open Categories; inspect Dining Out's usual treatment and default bucket. Create an optional subcategory, such as Coffee under Dining Out, and explicitly set its intended defaults. Show name, icon, color, parent selection, and edit controls without narrating every icon choice.

Category defaults reduce repeated input. A Record can override them for an exception. Changing a Category's defaults is not a promised retroactive rewrite of existing Records: the current code stores treatment and bucket choices on Records. Inspect and update old Records explicitly when needed.

Only spending-eligible Records receive a bucket. Show why the control is unavailable for Income or Transfer/neutral. In some filter menus, Transfer/neutral appears as Excluded; explain that label without renaming the treatment everywhere.

### S13: spending buckets and targets

Start with the four seeded buckets: **Daily, Recurring, Irregular, Travel**. They are starter choices, not a mandatory budgeting system.

From Dashboard → Buckets, demonstrate a target on Daily. Explain the name/color, Core/Outlier/Other group, and Daily/Recurring/No pacing choices. These organize spending and its presentation; Recurring does not automatically generate bill Records or arrange payments.

**Calendar example:**

- Set Daily target to $600 from the selected month onward.
- In the next month, set $700 for that month only.
- Return to the earlier month to show it still has $600.
- In a later month without an override or newer default, the $600 default still applies.

Existing month-specific overrides take precedence over the applicable default. Changing the default starts from the selected month, not necessarily today's month. No target differs from a zero target: zero is an actual comparison amount.

Show Monthly Records selection controls for assigning a bucket to several eligible Records or removing a bucket. Archive an unused teaching bucket if demonstrating archiving; existing Record assignments are preserved. Do not imply an archived bucket's historic spending vanishes.

**Narration anchor:** “The target is a number to compare against. It doesn't move or reserve your money.”

### S14: Budgets

Use a small manual “First-week spending” Budget with a $200 amount and a seven-day period covering the demonstration's spending Records. **Turn Automatic attach off**, because the current creation form defaults it on. Attach only the intended spending Records and the refund.

Show the attached list, usage, projected usage, daily pace, recommended pace, spending-over-time chart, and Category breakdown. Detach one Record to explain membership, then restore the intended example. Point out Edit Budget for name, amount, dates, and attachment mode; deleting a Budget removes the plan and its memberships, not its underlying Records.

Explain Automatic attach separately: at creation it attaches existing Records in the date range, and newly created Records in that range are attached. It is not a filter meaning “only trip spending” or “only Spending treatment.” Review the attached list. Editing dates or enabling Automatic later should not be presented as a guaranteed full rebuild of membership.

Records can be attached or detached outside the Budget period, but the detail analytics apply date windows. Do not promise that an outside-period Record changes every chart. Current Budget calculations use attached signed Record amounts and differ from Dashboard treatment-based totals; this is why the tutorial uses a carefully chosen manual membership set.

Contrast in one sentence: “Use a bucket for a persistent monthly spending group; use a Budget when the plan has its own dates and Records.”

### S15: understand the Dashboard

Use the finished teaching dataset for exact totals. For comparisons and rich charts, switch explicitly to a separate prepared history dataset. Never cut between different datasets while implying the numbers belong to the same state.

| Question | Feature | Explanation to preserve |
|---|---|---|
| Did I earn more than I spent? | Income, spending, surplus/shortfall, surplus rate | Income minus personal spending. This is not the balance of an Account or an investment return. |
| Is some work incomplete? | Pending Record values and status | Pending Records are included in the applicable current totals; the indicator calls out the part still needing review. |
| How much went into saving/investment? | Contributions, Withdrawals, Net contributions, ratio to income | Saving/investment is separate from consumption spending; explain cash-direction signs. |
| Where is my spending going? | Spending breakdown and Category history | Show scope selection and underlying Records. Category comparisons need usable history. |
| Is ordinary spending on pace? | Daily-bucket pace and target/projection | Read the Daily scope. Estimates depend on recorded activity and are not guarantees. |
| Was this month unusual because of travel? | All spending, groups, individual buckets | Switching breakdown scope does not mean every other Dashboard card switches with it. Read each scope label. |
| Which dates caused a spike? | Spending by day | Select the day and inspect Monthly Records. |
| Is there a weekday pattern? | Spending by weekday | Average spending per occurrence of that weekday, including zero-spend occurrences; it is not the largest individual purchase. |
| How has the month developed? | Cumulative Surplus / Shortfall chart | The path reflects income less personal spending across the month. |
| What is it being compared with? | Previous-month comparisons; Settings → Dashboard analytics | Choose 1, 3, 6, 12, or a custom 1–24 months. For current headline comparisons, earlier months are compared through the equivalent day; history/weekday sections have their own stated scopes. |

Show current month versus a completed month: current data is labelled through today; completed months show final results. Future-dated Records are separate from actual activity and may contribute to projections. A future Record is not an automatic recurring payment instruction.

When history is absent, say “There isn't comparison history yet.” Do not fill the gap with invented growth percentages. A selected comparison window is not a guarantee that every month in it contains usable history.

### S16: storage, backup, and convenience

**Begin with the answer:** “Your working data lives in this browser on this device. Opening Finpoint somewhere else does not, by itself, bring that data with you.”

1. **Manual backup:** repeat Download backup briefly. Keep the file somewhere recoverable. Bank exports cannot recover all the Record explanations, Allocations, Categories, and planning work contained in a Finpoint backup.
2. **Restore from file:** show selecting a Finpoint JSON backup and the restore preview. Explain before confirmation that restoring replaces the current browser's workspace; it does not append another bank export. Demonstrate actual restoration only in a disposable practice workspace.
3. **Optional Drive:** connect Google Drive if available in the deployed app; show that Finpoint sync uses the user's own Drive. This is separate from importing activity from a bank.
4. **Statuses:** show Up to date; describe Offline, Reconnect needed, Sync failed, and Needs your decision in plain language. Offline changes must still reach Drive later. Do not promise synchronization while the app is closed.
5. **Second device:** open Finpoint in another practice browser/device, connect the same Drive, read/restore the intended copy, then verify a known Record. Inspect local data before replacing it.
6. **Conflict:** explain that both browser and Drive have changed. Saving the browser copy replaces Drive; restoring Drive replaces the browser. This is a whole-copy decision, not an automatic merge. Download a local backup before choosing if uncertain about which copy is needed.
7. **Demo/reset:** demo loading replaces browser data; Clear all data resets the workspace and restores starter Categories/buckets. These belong in the maintenance explanation, not a routine onboarding instruction for an existing user. Do not perform demo/reset in a personal Drive-connected workspace for filming.
8. **Convenience:** show responsive navigation. The app has light/dark/system appearance support and a web-app manifest, but the current source does not establish a visible theme switch or universal installation flow. Verify the actual target browser before filming controls or “Add to Home Screen.” Do not invent an in-app install button or promise offline app launching from the manifest alone.

Avoid absolute claims such as “nobody can ever see this data,” “nothing is ever sent anywhere,” or “clearing your browser is safe.” The accurate product statement is that financial data is stored locally and can optionally be backed up to a file or synced to the user's Google Drive.

### S17: the routine

End with a process a new user can actually repeat:

1. Export recent activity and import it into Finpoint.
2. Review Allocator and explain available amounts with new or existing Records.
3. Review Pending Records and replace Pending Statements when the right imports arrive.
4. Check the selected month's totals and the Records behind any surprising number.
5. Check Drive status or download a backup.

Final practice questions:

- “One payment bought two types of things. What do you split?” → Its Allocations across Records.
- “An imported Statement has arrived for a placeholder you already used. What do you do?” → Replace the Pending Statement after reviewing the pair.
- “You moved money between your own Accounts. Is that salary or shopping?” → Transfer/neutral.

Final spoken action: “Start with a small period of activity. Explain one purchase, check the result, then repeat.”

## 7. Teaching dataset and continuity checks

This is a **proposed fictional fixture**, not an exported backup or verified import file. The production model must prepare it through valid app workflows or a valid fixture mechanism and verify the visible results.

Use one currency throughout. Place completed example activity on or before the recording date within the selected month. Keep future-dated demonstrations separate. Use obvious fictional Account names and never record personal bank exports.

| Scenario | Statement amount(s) | Record(s) | Category / treatment / bucket |
|---|---|---|---|
| Salary | +3000 | Salary +3000 | Income / Income / none |
| Lunch | −12 | Lunch −12 | Dining Out / Spending / Daily |
| Supermarket | −80 | Groceries −60; Shopping −20 | Groceries / Spending / Daily; Shopping / Spending / Irregular |
| Shared dinner | −90 and later +60 | Dinner −30 | Dining Out / Spending / Daily |
| Own-account transfer | −200 and +200 | Transfer 0 | Transfer / Transfer/neutral / none |
| External saving/investment contribution | −300 | Contribution −300 | Savings & Investments / Saving/investment / none |
| Withdrawal from that destination | +50 | Withdrawal +50 | Savings & Investments / Saving/investment / none |
| Delayed transport activity | Pending −25, later replaced by imported −25 | Transport −25 | Transport / Spending / Daily |
| Full refund of Shopping component | +20 | Shopping refund +20 | Shopping / Spending / Irregular |

After all these examples are complete, before any optional extra scenarios:

- 11 imported Statements remain, explaining 10 Records through 12 Allocations.
- The transport placeholder has been deleted through replacement.
- Every Statement has zero remaining allocable amount; every Record has at least one Allocation and its signed Allocation sum equals its amount.
- Income = **$3,000**.
- Gross spending = **$147**; refunds = **$20**; net spending = **$127**.
- Daily spending = **$127**. Irregular net spending = **$0** after the refund.
- Surplus = **$2,873**; surplus rate ≈ **95.8%**.
- Contributions = **$300**; Withdrawals = **$50**; Net contributions = **−$250**; Net contributions / income ≈ **−8.3%**.

These values are illustrative and deliberately small enough to audit. They do not depict a representative cost of living or a recommended savings rate.

The Budget example can attach Lunch, Groceries, Shopping, Dinner, Transport, and Shopping refund for net usage of $127 within its date range. Keep salary, saving/investment, and transfer Records out of this manual example.

Use a **separate scene reset** for the holiday-dinner bucket override and hypothetical target calendar, then restore the documented baseline before showing the final totals. A bucket override changes bucket totals, even when total spending stays the same.

### Capture states to prepare

| State | Purpose | Must be visibly true |
|---|---|---|
| A. Fresh practice workspace | First-run navigation | Starter Categories/buckets; no personal data. |
| B. Imported, unexplained lunch | First Allocation | Lunch Statement has its full amount available. |
| C. Lunch complete | First win | Record and Statement Allocation tally. |
| D. Supermarket partly allocated | Split explanation | Exactly $20 remains. |
| E. Dinner before repayment | Pending Record | Record −30; Allocation −90; Pending label. |
| F. Dinner after repayment | Many Statements to one Record | Allocations −90 and +60; Complete. |
| G. Transport placeholder allocated | Pending distinction | The Record tallies but stays Pending while its Statement remains Pending. |
| H. Imported transport available | Replacement review | Imported destination is fully unallocated and from the same Account. |
| I. Finished fixture | Totals and recap | Counts and totals above agree. |
| J. Separate prepared history | Charts and comparisons | At least several labelled months; explicitly a different dataset. |
| K. Disposable backup/sync demonstration | Recovery lesson | No real financial data or personal Drive copy at risk. |

## 8. Troubleshooting cards

These can appear immediately after the relevant demonstration and be exported as short help clips. Show symptom → check → action → expected result.

| Symptom | Check / action | Expected result |
|---|---|---|
| Import says it skipped Statements. | Check whether the same supported export was already imported; inspect Statements and import counts. | Unchanged activity is not inserted again. Skipped does not mean allocated. |
| Import fails. | Check selected bank, expected export format, and required Revolut Account details; read the displayed error. | Correct file and Account path imports successfully. Do not suggest renaming a PDF to CSV. |
| I imported but spending totals did not appear. | Create or complete the meaningful Records and check the month. | Dashboard reflects applicable Records, not raw unexplained Statements. |
| My Record is Pending. | Compare Record amount to signed Allocation sum; check for no allocated Statements. | Correct amount/Allocations or leave pending while real activity is absent. |
| My Record tallies but stays Pending. | Inspect the Statement's pending status. | Replace the placeholder with confirmed imported activity before expecting completion. |
| I cannot allocate this much. | Check the Statement's remaining allocable amount and money direction. | A valid amount fits the Statement without exceeding its remaining capacity. |
| A pending replacement is unavailable. | Check Account, imported status, existing Allocations, and capacity; broaden candidate search. | Choose the correct eligible import; do not force a merely similar candidate. |
| I cannot find a Record/Statement. | Clear search and relevant filters; check selected month and default date settings. | Hidden activity reappears if the filter caused it. |
| My refund increased income. | Verify Spending treatment on the refund Record; Automatic counts positive amounts as income. | Refund reduces spending. |
| My transfer looks like spending. | Review Transfer/neutral treatment and both sides of the transfer. | The movement is explained without inflating consumption totals. |
| I can't assign a bucket. | Check spending eligibility and whether the bucket is archived. | Assign only to eligible spending Records and an available bucket. |
| My target is wrong for this month. | Check selected month, month-only override, and applicable onward default. | The intended monthly comparison amount is displayed. |
| My Budget total is surprising. | Inspect attached Records and dates, especially Automatic attach bringing in unrelated income/saving Records. | Deliberate membership produces the intended plan. |
| A Category default changed but an old Record didn't. | Inspect that Record's stored treatment/bucket and update it explicitly. | Existing history is changed intentionally, not assumed to follow the new default. |
| I can't delete a Category or Pending Statement. | Categories in use/with children and Pending Statements with Allocations have restrictions. | Reassign/remove dependencies deliberately; do not delete evidence just to dismiss an error. |
| I opened another browser and everything is empty. | Check whether the correct backup/Drive copy was restored there. | The intended workspace is restored and a known Record is verified. |
| Drive needs a decision. | Compare the two copies; preserve a backup; choose the intended read/write direction. | One intended workspace wins; do not describe it as a merge. |

## 9. Feature coverage audit

This ensures a visually polished edit does not accidentally drop a feature. Minor controls can be covered in a compact reference insert rather than a lengthy click demonstration.

| Area | Coverage | Scenes |
|---|---|---|
| Core model | Accounts, Statements, Records, Allocations; split and combine; allocable versus Pending | S02, S04–S10 |
| Importer | Four banks; supported export layouts; file selection; Revolut Account details; missing Accounts; duplicates and ordering | S04; troubleshooting |
| Records | Create, edit, delete; title/date/amount/Category; optional People/Location/Description and existing-value suggestions; analytics overrides; Allocation edit/attach/remove | S05, S08, S11–S12 |
| Statements | Search/filter; detail and Allocation visibility; pending create/edit/delete restrictions | S10–S11 |
| Accounts | Imported source identity, list/detail, Statements, display-name edit | S04, S11 |
| Allocator | Selection; Create Record; Attach to Record; partial Allocation; Replace Pending tab and shortcut | S05, S07–S10 |
| Record discovery | Search; Category/bucket/treatment/status/date/amount filters; pagination; filter reset | S11 |
| Monthly Records | Shared month navigation, day groups, scoped filters, actual/future activity, per-day metrics, edit/open, batch assign/remove bucket | S11, S13, S15 |
| Categories | Starter taxonomy, one-level subcategories, names/icons/colors, defaults, per-Record exceptions, restricted deletion | S12; troubleshooting |
| Spending buckets | Seeded/custom buckets, group, pacing, no target/zero target, default timing, month overrides, archiving | S13 |
| Budgets | Create/edit/delete, dates/amount, manual/automatic membership, attach/detach, progress/projection and Category chart | S14 |
| Dashboard | Income/spending/surplus/rate, pending inclusion, savings, Daily pace, targets/projections, breakdown/history, day/weekday, cumulative surplus, scopes, drilldowns | S15 |
| Settings | Default start/end-date filters; comparison months including custom range | S11, S15 |
| Data | Browser storage, manual JSON backup/replace restore, optional Drive connection/sync/status/reconnect/disconnect/conflict handling, demo/reset | S03, S06, S16 |
| Convenience | Mobile navigation, appearance behavior, conditional browser installation; Privacy/Terms links | S03, S16; verify presentation before capture |

## 10. Visual and editing direction for the next model

**Use three visual modes:**

- **Concept explanation:** Statement and Record cards with amount-labelled Allocations. Use this for split, combine, and replacement relationships.
- **Real action:** accurate app UI with the relevant navigation and control visible. Use this to teach where to click or tap.
- **Result:** the saved state and a small before/after amount/status comparison. Use this to show why the action mattered.

The recurring rhythm is **problem → explanation → action → proof → one-sentence takeaway**.

Content-level visual requirements:

- Keep Statement identity visible when it splits; do not animate it into two fake imported Statements.
- During replacement, preserve the Record and Allocation amounts on screen while the Pending Statement is replaced.
- Write “paid” or “received” next to important signed amounts. Do not rely only on red and green.
- Use tables for genuinely comparative ideas: treatment effects, Category/treatment/bucket, and bucket/Budget. Reveal rows progressively rather than narrating a crowded table.
- Show only one active click target at a time. Establish the full screen, focus on the control, and return to the saved result.
- Narrate both field name and intended value. A viewer should be able to follow without seeing a tiny cursor.
- Keep captions clear of the fields being demonstrated. Check legibility on a phone-sized playback preview.
- Hold difficult sums and status transitions long enough to read. Pauses matter more than arbitrary animation density.
- Label illustrative diagrams versus actual interface captures. A conceptual “Unexplained” card is not permission to invent an “Unexplained” app button.
- Keep an always-consistent chapter location such as “2 of 4 · Handle real life.” The designer chooses its presentation.

The animation model may improve visual order within a scene, narration, pacing, transitions, and supporting metaphors. It should preserve canonical terms, demonstrated app behavior, arithmetic, replacement direction, and the prerequisite order. If an actual app interaction differs, revise the plan against evidence rather than animate the intended behavior as if it exists.

## 11. Efficient production workflow

1. **Lock the learning outcomes and worked examples.** Check the scene objectives and dataset arithmetic before creating motion.
2. **Rehearse the app flows.** Capture labels and end states in a disposable workspace. Record which steps differ from this source-based plan.
3. **Prepare scene states and assets.** Use the A–K capture list. Keep a manifest of which state each screenshot/clip belongs to. Keep demo history separate from the tiny fixture.
4. **Write the full narration.** Keep anchors, add connective language, and read it aloud. Adjust timing rather than speeding up essential actions.
5. **Build a rough still-frame sequence.** One frame per teaching beat, with temporary narration. A viewer should understand it before motion is added.
6. **Check first-time comprehension.** Ask someone unfamiliar with Finpoint to make one Record, explain a split, and distinguish the two Pending states. If they cannot, fix the sequence before polishing it.
7. **Produce one representative chapter.** Use the split-purchase chapter to establish reusable concept/action/result components. Reuse those components for the remaining scenes.
8. **Add final design and motion.** The next model owns this stage. Rendering technology is its choice; this plan does not require a particular video framework.
9. **Audit final video against behavior and arithmetic.** No invented controls; signs and totals agree; sensitive replacement directions are clear; text is readable with captions.
10. **Export reusable cuts.** Full guide, four lessons, and short troubleshooting clips. Supply chapter timestamps, transcript/captions, and an editable source project.

To conserve model tokens, provide the next model with the compact handoff and this document. It should consult only the source files relevant to the scene it is rehearsing, rather than rereading the whole repository. Reuse small scene specifications and frozen example data across renders.

### Suggested scene specification

For each scene, retain: ID; question; learning outcome; starting state; narration; on-screen text; app actions; required proof; ending state; duration estimate; source reference; and verification status. This is the structural contract between content and animation.

### Improvements to consider in the teaching workflow

These are recommendations for the video, not claims of existing app features:

- Offer a quick first-win lesson and optional later chapters, so advanced planning does not block onboarding.
- Put common mistakes directly after their triggering action, rather than saving all corrections for the end.
- Use a “pause and predict” prompt before status/totals change, so viewers learn the model rather than copy clicks.
- Provide the routine and troubleshooting table as a written companion to the video.
- If app onboarding changes are later requested, a guided first Allocation and clearer Pending explanations would be candidates. Do not redesign the app as part of producing this video.

## 12. Source map and pre-recording verification

The plan uses current local implementation as its authority where README wording is broad. This was a source audit, not a live UI test. These paths let the producer recheck a specific claim cheaply:

| Claim | Local source |
|---|---|
| Canonical terms and object boundaries | `CONTEXT.md` |
| Motivation and overall feature inventory | `README.md` |
| Navigation, route names | `src/routes.ts`, `src/components/layout/app-sidebar.tsx`, `src/components/allocator-tabs.tsx` |
| Imports and bank-specific Account handling | `app/importer/page.tsx`, `src/logic/importer.ts` |
| Record form and optional context | `src/components/dialogs/record-creator.tsx`, `src/components/dialogs/record-editor.tsx` |
| Allocation capacity, Pending, deletion, batch bucket edits | `src/logic/records.ts` |
| Signed entry and human-readable amount filters | `src/components/form/amount-field.tsx`, `src/components/table/amount-filter.tsx` |
| Pending creation/replacement rules and review | `src/logic/statements.ts`, `src/logic/replacements.ts`, `app/allocator/pending/page.tsx`, `src/components/dialogs/statement-replacement-review.tsx` |
| Treatment arithmetic and bucket eligibility | `src/logic/analytics.ts`, `src/components/form/record-analytics-fields.tsx` |
| Category defaults and one-level structure | `src/data/defaults.ts`, `src/logic/categories.ts`, `src/components/dialogs/category.tsx` |
| Bucket targets, precedence, archiving | `src/logic/buckets.ts`, `src/components/dialogs/bucket.tsx` |
| Budget membership and calculation differences | `src/logic/budgets.ts`, `src/logic/records.ts`, `app/budgets/[id]/page.tsx` |
| Dashboard scopes, actual/future and comparison windows | `src/logic/dashboard.ts`, `app/(month)/page.tsx` |
| Monthly grouping and batch controls | `app/(month)/records/monthly/page.tsx` |
| Preferences | `app/settings/page.tsx` |
| Backup, replacement restore, Drive conflicts, demo/reset | `app/sync/page.tsx`, `src/logic/auto-sync.ts`, `src/data/export-import.ts` |
| Appearance support and app manifest | `src/hooks/use-appearance.tsx`, `app/layout.tsx`, `public/manifest.json` |

**Mandatory rehearsal checks before treating this as a recording script:**

- Confirm the $30 Dinner Record can be demonstrated with −90 initially and +60 later, and verify visible pending/complete states.
- Confirm a zero-amount Transfer Record with both Statements, and verify that a Pending Statement keeps its allocated Record Pending.
- Rehearse a partial Statement split, refund treatment, and exact-amount filter behavior through the live UI.
- Use one real supported export layout with fictional contents; verify bank-specific format handling and reimport counts.
- Verify Category default behavior, monthly-target precedence, and the manual Budget's $127 result.
- Confirm Drive availability and restore labels in the deployment being recorded; use disposable data for all destructive examples.
- Verify theme/install controls on the target device or omit those click instructions while retaining the accurate convenience note.
- Confirm all finished-fixture counts and displayed arithmetic after the walkthrough, not merely in the written script.

No application source changes, personal data changes, commits, or video renders are part of this planning deliverable.
