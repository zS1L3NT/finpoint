> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 42 Plain-words pass on what's left of the jargon

Status: resolved
Blocked by: —
Evidence: ../acceptance-2/margaret/report.md (F7 PARTLY, F9 PARTLY)

## What
Margaret (68, not technical) still stumbled on: "unallocated Statements", "Ledger view", "Any treatment", "Cumulative spending · SGD", "gross spending pace", "Dashed lines extend each budget's gross spending pace and include scheduled Records", "All budgets · $655.01 expenses · $0.00 refunds = $655.01 spending", "Shares exclude refunds", and the drill meta "Spending · refunds subtracted · Includes Pending Records".

Keep the canonical domain terms from CONTEXT.md (Statement, Record, Allocation, Pending) but:
- make each first use definable in place (the existing `<Term>`), and
- rewrite the surrounding sentences in plain words (/simple-english skill), shorter, one idea each.
"Ledger view" (Records eyebrow) and "Any treatment" (filter placeholder) get plainer labels. Chart captions drop to one short sentence plus a Term.

## Acceptance
- [ ] Before/after copy table in the ticket; e2e copy assertions updated (name each one).

## Comments
Before / after copy
| Where | Before | After |
| --- | --- | --- |
| Attention row | N unallocated Statements / Totals may be low until these are allocated. | N Statements with no Record yet / Totals may be low until you allocate them. |
| Records eyebrow | Ledger view | All your Records |
| Records type filter | Any treatment | Any kind |
| Chart axis (forecast, budget) | Cumulative spending · SGD | Running total of spending · SGD |
| Forecast caption | Each colour shows a Monthly Budget's cumulative spending. Dashed lines extend each budget's gross spending pace and include scheduled Records. Hover or focus a day... | Each colour is one Monthly Budget (Term), added up day by day. Dashed lines show where each one is heading. Select a day to see its Records. |
| Categories subtitle | $X expenses · $Y refunds = $Z spending / Gross spending · refunds excluded | $X spent − $Y refunds = $Z net / Spending before refunds |
| Category mix | Shares exclude refunds. | Each share is spending before refunds. |
| Drill meta | Spending · refunds subtracted / refunds excluded | Spending after refunds / before refunds |
| Comparison drill | $102.26 ÷ 2 months; Labels show Record titles found on only one side. The average divides spending by the included months. | $102.26 over 2 months; A label marks a Record that appears on one side only. The average is the total divided by the number of months. |
| Left over tile (no income yet) | — | Not yet (detail: Waiting for income) |
New Terms: Statement (drill header), Monthly Budget (forecast caption).
Edited tests: modals.e2e.ts (filter label "Any kind"); charts.e2e.ts two assertions ("spent − refunds" subtitle); drilldown.e2e.ts ("over 1 month"); domain drilldown.test.ts meta strings (my own new test).
Look for: the new captions read plainly; Left over shows "Not yet" before income.
