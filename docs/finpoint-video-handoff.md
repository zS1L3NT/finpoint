# Finpoint video: compact production handoff

Read `docs/finpoint-video-plan.md` for the full scene specifications, arithmetic, troubleshooting, feature coverage, and source map. Your job is to turn that structure into a clear beginner video, improving presentation and pacing while keeping behavior accurate.

The learning experience is now implemented at `/help`, `/help/video`, and `/help/practice`, with contextual Help. Read `docs/finpoint-guide-implementation.md` and `video/README.md` first. This older production plan remains a reference for a future design pass; the delivered film is an illustrated narrated guide, with four interactive practice lessons rather than four separate video cuts.

## Objective

Teach a first-time user to import bank activity, explain it with Records and Allocations, handle real-life exceptions, understand totals, plan spending, and protect their data. Target a roughly 27-minute chaptered guide, reusable as four shorter lessons. Deliver the first complete workflow within about five minutes.

## Narrative

Follow Alex through a fictional month. Use this order:

1. The problem: missed tracking and bank activity that does not map one-to-one to personal spending.
2. Statement → Allocation → Record, using a $12 lunch.
3. Open Finpoint, explain local storage, import a supported file, create Lunch, verify completion, download a backup.
4. Split an $80 payment into $60 Groceries and $20 Shopping.
5. Combine a $90 dinner payment and $60 repayment into a $30 personal-cost Record.
6. Distinguish Income, Spending, Saving/investment, Transfer/neutral, and Automatic by direction.
7. Distinguish Pending Record from Pending Statement; replace a placeholder with imported activity while retaining its Allocations.
8. Find/edit Records; use Statements, Accounts, Monthly Records, and filters.
9. Explain Category versus treatment versus bucket; then monthly targets versus custom-period Budgets.
10. Read the Dashboard by question and scope; drill down to supporting Records.
11. Back up, restore, optionally sync with Drive, understand conflicts, and finish with a repeatable routine.

## Non-negotiable meaning

- A Statement is account activity; a Record is its meaningful explanation; an Allocation assigns an amount between them. Do not rename Records “transactions.”
- One Statement can explain several Records; several Statements can explain one Record.
- Paid amounts are negative in Record/Allocation forms; received amounts are positive. Amount filters instead accept positive inputs under Paid/Received.
- A Record is Pending when its Allocations do not tally, none exist, or any allocated Statement is Pending. This is not automatically a debt indicator.
- A fully allocated Record stays Pending while any of its Statements are Pending, even when its amounts tally.
- A placeholder replacement preserves Allocations and removes the Pending Statement. It must not create a duplicate expense.
- Income/spending analytics are based on Records. Importing Statements alone does not explain them.
- Pending Records can already contribute to totals. Future-dated activity has separate actual/projection handling.
- A positive Spending refund reduces spending. Automatic by direction would treat a positive amount as income.
- Transfer/neutral does not contribute to income or spending.
- Saving/investment contributions and withdrawals are separate; Net contributions = withdrawals − contributions. A negative value is not an investment loss.
- Categories, treatments, buckets, monthly targets, and Budgets are different concepts.
- Bucket defaults begin at the selected month; month-specific overrides take precedence. Targets do not hold or reserve cash.
- Budget membership is separate, and current Budget analytics use signed attached Record amounts rather than the Dashboard treatment rules. Demonstrate a manual Budget; Automatic attach defaults on and must be deliberately disabled for it.
- Restoring a file or Drive copy replaces browser data. Conflict resolution chooses a whole copy, not a merge. Demo loading replaces current data too.

## Exact example totals

The full plan supplies the fixture. Completed baseline: 11 imported Statements, 10 Records, 12 Allocations; no remaining placeholder or incomplete Allocations. Income $3,000; gross spending $147; refunds $20; net spending $127; surplus $2,873. Contributions $300; withdrawals $50; net contributions −$250. These are proposed fixture expectations, not a supplied or tested backup file.

Use a separate labelled dataset for rich historical charts. Reset optional holiday-bucket examples before returning to baseline totals.

## Creative freedom

You own visual identity, composition, motion, typography, narration refinement, transitions, and implementation technology. Use a repeating problem → explanation → action → proof pattern. Prefer simple amount-labelled relationship diagrams, faithful UI demonstrations, and brief before/after results. Keep captions and signed amounts readable on a phone. Do not invent app controls or hide a conceptual jump behind a fast transition.

## Efficient sequence

1. Rehearse the scene's app behavior in a disposable practice workspace.
2. Prepare the scene states from the full plan and keep an asset manifest.
3. Write narration and assemble still frames first.
4. Check whether a newcomer can complete Lunch and explain the two Pending states.
5. Produce one representative split-purchase chapter; reuse its visual components elsewhere.
6. Animate the remaining chapters, audit amounts and visible outcomes, then render.

Final deliverables should include the full guide, four lesson cuts, chapter timestamps, captions/transcript, and editable video source. Short troubleshooting clips are useful derivatives.

## Verification boundary

The content plan was checked against source on 7 October 2026, not rehearsed in the browser. Validate current labels and outcomes before recording. Import layouts, zero-amount transfers, partial Allocations, pending replacement, filter modes, Budget totals, and Drive setup deserve explicit checks. Appearance infrastructure and a web-app manifest exist, but do not assume a visible theme selector, install button, or universal offline-launch support.

Use fictional data and an isolated browser profile; do not load demo/reset data into a personal Drive-connected workspace. Do not modify Finpoint's app features merely to make the video match the plan. Report an implementation mismatch and adapt the scene truthfully.
