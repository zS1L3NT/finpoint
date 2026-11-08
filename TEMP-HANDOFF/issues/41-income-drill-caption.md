> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 41 Income drill-down shows the Spending caption and a bare $0.00

Status: resolved
Blocked by: —
Evidence: ../acceptance-2/marcus/report.md (Issue B), ../acceptance-2/marcus/02-income-drilldown.png; reproduced by Opus at /?drill=metric:income

## Bug
"Income in November · $0.00 · 0 Records · Spending · refunds subtracted · Includes Pending Records". The meta line is the Spent one (wrong treatment, and the refunds wording doesn't apply). With no income yet, the big $0.00 brings back Marcus's F5 worry (it reads as debt or nothing).

## Fix
- Each metric drill gets its own meta line: Income says "N Records · Income", Left over and Saved say what they are made of. Audit every `metric:*` and `attention` kind in getDrilldown for the same copy-paste.
- An empty Income drill mid-month shows the same state-aware copy as the tile: "None yet. Usually ~$4,698.19 arrives by day 25." in place of a bare $0.00, plus an empty state, not an empty list.

## Acceptance
- [ ] Domain test: meta for each metric kind.
- [ ] e2e: Income drill with no income shows "None yet" with the usual-by-day line and no "Spending" word.

## Comments
- getDrilldown now returns `meta` per selection and `incomeHistory` for the Income drill; the panel shows "None yet" + "Usually ~$X arrives by day N." (or "None recorded") and an empty-state line. Audit: category-gross/month keep "refunds excluded", others "refunds subtracted"; Left over and Saved got their own lines.
- Tests: domain "each metric drill states what it is made of" (11 pass); e2e "Income drill with no income says None and never uses the Spending caption" (desktop+mobile pass). The "usually by day" line is covered in the domain test only (needs a frozen clock in e2e).
- Look for: Income drill in a month with no income; Left over / Saved captions.
