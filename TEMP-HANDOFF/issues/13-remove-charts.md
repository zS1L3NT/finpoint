> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 13 remove charts

Status: resolved
Phase: P2
Blocked by: 01, 02
Spec: ../spec.md

## What

**Remove** Spending by day, Surplus/Shortfall chart, weekday card, pace tiles, calendar footer button.

## Acceptance

- [x] Spending by day, Surplus/Shortfall, weekday bars, pace tiles and the calendar footer button are gone, with their now-unused component files and tests.
- [x] No dead imports; affected tests updated and named.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation and verification:
- Removed dashboard daily and surplus sections and their two component files. Weekday file, weekday field, pace tiles and calendar footer button were already absent. Removed unused dashboard series/history return data and duplicate daily-data calculation; retained pace data used by the forecast.
- rg -n 'daily-spending-chart|total-spending-chart|weekday-bars|DailySpendingChart|TotalSpendingChart|WeekdayBars' app src tests: no matches.
- bun test: 169 passed, 2224 assertions. bun lint then bun lint:check, bun types:check, bun run types:e2e and bun run build passed.
- Final production chart run: 34 passed, 2 skipped, 2 failed. The unchanged desktop height check measured 416.00006103515625 versus 416 and passed its targeted rerun (1/1); it was not classified as flaky or tested on main. The mobile tooltip assertions completed but trace cleanup failed because another test process reused the output directory; isolated rerun passed (1/1). Earlier obsolete summary label assertions were corrected and passed desktop/mobile. Final isolated navigation-history and corrected summary/removal cases: 8/8 passed.
- PLAYWRIGHT_ANIMATIONS=1 production chart animations --workers=1: 10/10 passed across desktop/mobile/tall/light/reduced-motion.
- Edited tests: tests/core/charts.e2e.ts (chart fit/dense/tooltip groups drop removed charts; overview summary and metrics, empty overview, net refund use new labels/copy; Monthly Budget rows drops deleted chart; forecast/category-hover case asserts removals); tests/support/charts.ts (shared chart list, including animation coverage); tests/component-inventory.ts (remove deleted component scenarios). tests/core/navigation.e2e.ts removes the calendar-footer nested Record step and the two footer-dependent outgoing-Back/history-restore cases; the remaining history-clearing case passes desktop/mobile. No unchanged assertions were loosened.
- graphify update . refreshed structural outputs; README semantic summary/removal nodes extracted inline and community report refreshed. Graph health: no missing/dangling/collapsed edges; four self-loops remain; 16 files yield no symbols (extractor limitation). All four required graph files included.
- Screenshots: review/13-charts-desktop.png and review/13-charts-mobile.png (1440/390, production/demo/dark). Servers and browser sessions stopped.
- Look for: forecast and calendar remain; daily bars, surplus chart, weekday card, pace tiles and second-click calendar action are absent.
- SHA: recorded below after signed commit.

Signed implementation commit: d214845.
