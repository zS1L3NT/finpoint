> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 28 compare panel columns are uneven and unexplained

Status: resolved
Blocked by: —
Spec: ../spec.md §5.2 (`compare`) · Evidence: ../review/19-g2-compare-columns-uneven.png

**Severity: polish**

## Evidence

"Dining Out: October vs usual". The left column lists October Records sorted by amount, the right column lists Aug+Sep Records in date order with small amounts, beside a header "2-month average $486.63" that no visible number adds up to. There is no sum under either column and none of the "Records unique to one side" markers §5.2 specifies. A reader cannot see why $576.96 is $90.34 more than usual. The header still shows only "$576.96" with the generic "Spending · refunds subtracted" line.

## Fix

`src/components/drill/panel.tsx` compare branch and `getDrillCompare` in `src/logic/drilldown.ts`: sort both columns the same way (amount, descending); show "Aug + Sep $973.26 ÷ 2" (or the per-month sums) under the right column; header line "$90.34 more than your 2-month average". Mark Records that appear on only one side if the comparison window allows it, otherwise delete the §5.2 promise.

## Acceptance

- [x] Both columns share one sort order.
- [x] The average's arithmetic is visible.
- [x] Header states the difference in words.

## Comments

Both columns sort by absolute amount descending. Domain logic exposes the combined historical spending; the column shows its division by the included months. Header states the difference. Existing exact-title uniqueness labels remain. README documents the comparison.

TDD: compare domain test failed before implementation. Passed bun test (180), bun lint, bun lint:check, bun types:check, bun run build. PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts --grep 'Biggest changes|mobile sheet' --project=desktop --project=mobile: 3 passed, 1 desktop skip. Edited tests: “compare drill uses the mover average and included same-period months” adds arithmetic/sort assertions; “Biggest changes compares named periods and preserves the month through reload and Back” adds visible arithmetic and difference assertions. Existing checks retained.

Production October demo screenshots opened: review/28-compare-branch-{dark,light}-{1440,390}.png. Browser closed, server killed by PID. graphify update . and README semantic refresh/clustering passed (symbol-free test/config warning only).

Look for: equally sorted columns, the historical total divided by 2, and $90.34 more than your 2-month average in the header.

Signed commit: aabad3b; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 127 degree-0/1 nodes (graphify labels them isolated) and 15 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
