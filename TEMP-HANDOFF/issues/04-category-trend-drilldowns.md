> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 04 category trend drilldowns

Status: resolved
Phase: P1
Blocked by: 01
Spec: ../spec.md

## What

**Category and trend drill-downs:** categories, trend month bars and breakdown rows, Biggest changes (non-compare). The `onDrill` contract applied to these charts.

## Acceptance

- [x] Category rows, trend month bars, breakdown rows and Biggest changes rows open the drill-down; totals equal the clicked number (domain test).
- [x] Charts take one `onDrill(selection)` prop (D4) instead of Link/onSelect variants.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation: unified category chart onDrill callbacks; category-gross distinguishes gross category/trend amounts from net mover amounts. Historical category validation reads persisted categories. README documents refund inclusion.
Verification in progress: build, lint and types passed; domain reconciliation and core charts/drilldown suite running. Edited tests: tests/domain/drilldown.test.ts (category/trend reconciliation), tests/core/charts.e2e.ts (buttons and explicit Open in Records hand-off).
Screenshots: review/04-category-desktop.png, review/04-category-mobile.png (production, dark).
Look for: category selection keeps the chart visible alongside the panel on desktop and opens a sheet on mobile.

Ticket commit: 720fabd (signed). Final integration verification with ticket 05: `bun test` — 168 pass, 0 fail, 2,219 assertions. `bun lint`, `bun lint:check`, `bun types:check` pass. Core command: `bun run test:e2e -- tests/core/charts.e2e.ts tests/core/drilldown.e2e.ts --project=desktop --project=mobile`; intentional navigation/legend assertions were updated, then affected cases re-ran successfully with `--grep 'summary, calendar|keyboard sweeps|legend semantics|cap five|category, trend'` and `--grep 'summary, calendar|Monthly Budget cards'`.
Edited tests: domain “category rows, movers and trend months reconcile across scopes”; core “dense overview: cards render values and fit, and a long Category name stays truncated and readable”, “populated charts: tooltips stay numeric, drills work by keyboard and a Record save updates the mover amount”, “overview: summary, calendar, Budgets, Category mix, movers and month change reconcile”, “net refund: long Category name and excluded Treatment retain numeric meaning”, “category trend: one shared list follows the read month and keeps its links reachable”, “category cards: cap five rows and keep equal XL heights when expanding” — chart rows are buttons, category hand-off explicitly uses Open in Records, Records empty copy follows that destination, and category counts exclude the expansion control. Added core “category, trend and budget selections retain the Dashboard and reconcile their visible amounts”. Existing row identity and numeric assertions remain.

Final checks: scoped core cases pass on desktop/mobile after intentional assertion updates; chart and drill-down animations pass 13/13 with one worker (including reduced motion); production build passes. The final category layout recheck passed 5 with one mobile-only layout skip, and the forecast callback check passed 2/2. `bun lint:check` and `bun types:check` are clean. Graph refresh completed, including semantic README/ADR concepts and all four tracked outputs. Health: no missing/dangling/collapsed edges; four pre-existing self-loops remain (also present in ticket 04's graph). Sixteen symbol-free source/test files are reported by the extractor; no refresh failure. Servers stopped by PID.

Pushed with ticket 05's signed integration commit 30170e2; 720fabd remains this ticket's separate signed feature commit. Final integration includes separate buttons for expanded Other members, each targeting its own category amount. Final production build and scoped category layout checks passed; no servers left running.
