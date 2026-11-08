> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 32 Attention rows leave the Dashboard, and Spent rows are not grouped

Status: resolved
Blocked by: —
Spec: ../spec.md §5.2 (`attention`, `metric`) · Evidence: ../review/19-g12-mobile-sheet-meta-truncated.png

**Severity: polish**

## Evidence

1. "29 unallocated Statements" goes to `/allocator?...` and "11 Pending Records" goes to `/records?...is_allocated=false` (page changes, drill state lost; the count matches, 11 = 11). §5.2 lists an `attention` selection that keeps the user on the Dashboard. Only "$2.50 without a Monthly Budget" opens the panel.
2. The Spent metric panel lists Records in one amount-sorted list; §5.2 says "grouped by category".
3. At 390px the collapsed sheet's meta line truncates to "4 Records · Spending · refunds subtracted · Includ…".

## Fix

Either implement the `attention` drill for Pending Records (list those 11 Records with their reasons from ticket 25) and keep the Allocator link as an in-panel action, or amend spec §5.2 to say these two rows navigate. Group the `metric:spent` rows by category with a subtotal. Clamp the meta to a shorter string at the half detent ("4 Records · Spending").

## Acceptance

- [x] Pending Records row opens the panel (or the spec is amended).
- [x] Spent rows grouped, subtotals reconcile to the header.
- [x] No ellipsis in the collapsed sheet header at 390px.

## Comments

- Pending Records / unallocated Statements rows keep navigating to their work lists (spec §5.2 amended to say so); Pending Records now show reasons in comparison rows.
- Spent drill groups Records by Category with net subtotals (`groups` in getDrilldown); half-detent meta is "N Records · Spending".
- Evidence: bun test 183 pass; bun lint:check, types:check, build clean; drilldown.e2e desktop+mobile 27 passed, 1 skipped. Edited test: mobile sheet detent test gained a meta-line assertion. New tests: Spent grouping (domain + e2e), comparison Pending reasons (e2e), comparison `difference` assertion.
- Screenshots: .scratch/insight-drilldown/review/32-spent-grouped-desktop.png, 32-spent-grouped-mobile.png
- Look for: category headings with subtotals in the Spent panel, and a one-line "84 Records · Spending" at the half-height mobile sheet.
