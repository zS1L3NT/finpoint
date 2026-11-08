> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 31 stale "Back to October 2026" on the Dashboard, and "Clear 1" with no filter

Status: resolved
Blocked by: —
Spec: ../spec.md §5.4 · Evidence: ../review/19-attention-stale-back-link-light.png

**Severity: polish**

## Evidence

1. On the October Dashboard click the "Pending Records" Attention row (goes to Records), then open the Dashboard URL directly (any `drill` URL): the Dashboard header shows "← Back to October 2026", a link back to the page you are on. Not seen on a fresh load or after the Allocator attention row. Likely the shared back-stack in `app/(month)/layout.tsx:48-70`; not checked against main.
2. The Records toolbar shows "Clear 1" when no filter was chosen (the month counts), and "Clear 2" with one status filter.

## Fix

1. `app/(month)/layout.tsx`: do not render `back` when its target path equals the current path and month.
2. `app/records/page.tsx`: exclude the month from the active-filter count, or label "Clear filters".

## Acceptance

- [x] The stale link no longer appears (repro steps above).
- [x] "Clear" is disabled with no user-chosen filter (as on Statements).

## Comments

Dashboard Back suppresses an origin with the same pathname and calendar month/year, ignoring drill/scope differences. Other months remain usable. Records excludes month context from the filter count and preserves month/year when clearing filters. README documents both.

Passed bun test (182), bun lint, bun lint:check, bun types:check, bun run build. Final PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/navigation.e2e.ts tests/core/tables.e2e.ts --grep 'monthly shell|Records month context|Records table: Category selection|Records table: zero' --project=desktop --project=mobile: 10 passed. Added tests: “monthly shell: direct drill URL hides a stale same-month Dashboard origin” and “Records month context is excluded from Clear filters and survives clearing status”. The first run's new mobile positive-Back assertion incorrectly expected an inert header to be visible behind an open sheet; setup now closes it before using September Back. The stale-button absence check includes hidden elements, strengthening the test. Existing tests/assertions untouched.

Production demo October screenshots opened: review/31-dashboard-branch-{dark,light}-{1440,390}.png after Attention → Records → direct drill URL; review/31-records-branch-{dark,light}-{1440,390}.png with month context only. Browser closed, server killed by PID. graphify update . after final test edits and README semantic refresh completed (symbol-free config/test warning only).

Look for: no self-pointing Back above October on Dashboard, and a disabled Clear without a count on October Records until a filter is chosen.

Signed commit: 29e18c8; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 130 degree-0/1 nodes (graphify labels them isolated) and 16 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
