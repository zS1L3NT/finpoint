> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 27 forecast chart draws last month's line with no key

Status: resolved
Blocked by: —
Spec: ../spec.md §4.1, F18 · Evidence: ../review/19-g10-forecast-dotted-line-unlabelled.png

**Severity: degraded**

## Evidence

October (closed month). The headline says "October closed $400.01 under plan", yet a grey dotted line climbs to a "$3.95k" pill well above the "Total budget $2.45k" line. It is the previous month's cumulative spending (`${budget.id}-previous`, dash "2 4"), but nothing says so: the caption mentions only the dashed projection (and only when `showProjection`), and there is no legend chip for it. A first-time reader sees spending far over budget in a month the headline calls under plan.

## Fix

`src/components/charts/cashflow-chart.tsx` (series ~line 75 and caption ~line 135): label the pill "Sep $3.95k" (previous month name) and add a caption sentence "Dotted line: <Month> for comparison." whenever any `budget.previous` exists. If cheaper, hide the previous-month line unless the user hovers a legend chip.

## Acceptance

- [x] The dotted line is named wherever it is drawn (caption and pill).
- [x] The headline and chart no longer appear to contradict each other in a closed month.
- [x] Chart e2e asserts the caption text when a previous series exists.

## Comments

Dotted comparison lines retain their colours/dashes and now name September in the caption. A previous-series endpoint pill includes Sep; a wider gutter accommodates its label at 390px. README documents the key.

Passed: bun test (180); bun lint; bun lint:check; bun types:check; bun run build; PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/charts.e2e.ts --grep 'Spending forecast|overview: forecast|overview charts' --project=desktop --project=mobile (8 passed). Edited test: “Spending forecast: retains gradient backdrops and comparison lines” adds caption and labelled-pill assertions; all gradient/dash assertions retained.

Production demo October 2026 screenshots opened: review/27-forecast-branch-{dark,light}-{1440,390}.png. Browser closed, port 5180 server killed by PID. graphify update . and README semantic refresh/clustering passed (symbol-free config/test warning only).

Look for: Sep $3.95k beside the dotted comparison and “Dotted line: September for comparison.” beneath the legend, with all coloured series retained.

Signed commit: d6f70d8; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 126 degree-0/1 nodes (graphify labels them isolated) and 15 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
