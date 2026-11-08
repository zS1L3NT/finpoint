> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 16 reconciliation

Status: resolved
Phase: P2
Blocked by: 01
Spec: ../spec.md

## What

**F12 reconciliation:** investigate, then add reconciling lines. Custom-period Budgets line in the Monthly budgets footer.

## Acceptance

- [x] Investigate F12 and add reconciling lines so the band, budgets and categories visibly add up.
- [x] Custom-period Budgets line in the Monthly budgets footer.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

- Investigation: the demo's Other Category contains $2.50 of Spending without a Monthly Budget. It is not a refund. October's $500 Saving / investment contribution is intentionally excluded from spending. Current demo: $2,047.49 budgeted + $2.50 Unbudgeted = $2,049.99 spending (the older F12 report used different demo totals).
- Conservative interpretation: the custom-period Budgets footer links to the existing Budgets page. Their amounts can overlap Monthly Budgets, so adding them to monthly totals would double-count spending. No accounting treatment or shared helper API changed.
- Added tests only: `tests/domain/drilldown.test.ts` — “Dashboard spending includes the $2.50 outside Monthly Budgets”; `tests/core/drilldown.e2e.ts` — “Monthly budgets explain unbudgeted spending and link to custom-period Budgets”. Existing tests unchanged. The browser fixture has $94.60 Unbudgeted, unlike demo data.
- TDD: new domain test failed before implementation (undefined spendingTotals), then passed. `bun test`: 178 pass, 0 fail. `bun lint`, `bun lint:check`, `bun types:check`, `bun run build`: pass.
- Initial production browser run (`tests/core/charts.e2e.ts` and `tests/core/drilldown.e2e.ts`, desktop/mobile): 49 passed, 2 skipped, 3 failed. Two failures were the new test's incorrect demo-based expectation, corrected to fixture amount. Investigating the existing desktop legend-to-drill failure without editing that test.
- Screenshots: `.scratch/insight-drilldown/review/16-dashboard-branch-{dark,light}-{1440,390}.png`; all opened and reviewed. Production server 5180, Try demo data, October 2026. Mobile light capture to be refreshed after chart resize settles.
- Graph: structural refresh and README semantic update completed; health: 0 missing/dangling endpoints, 0 collapsed edges, 4 self-loops. Community names regenerated from hubs where clustering changed.
- Look for: the Monthly budgets total explicitly includes $2.50 outside Monthly Budgets, the custom-period Budgets footer link, and Categories expenses/refunds/spending arithmetic; existing colours, sparklines, icons and delta chips retained.
- Final production rerun: `PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts --project=desktop --project=mobile`: 16 passed, 0 failed. The existing desktop category/trend/budget interaction had 1 failure in the broad run and 1 pass on repeat, unchanged. Its mobile counterpart passed twice. No flaky classification: main does not contain `tests/core/drilldown.e2e.ts` or this feature, so a like-for-like main comparison is unavailable. All scoped chart cases passed (2 intentional project skips).
- Final screenshots: refreshed and reopened light mobile after chart resize settled. All four requested paths exist and were opened. Demo seed comparison-history values differ across reloads, but October spending and the $2.50 difference are unchanged. Screenshot browser closed; all task servers stopped by PID.
- Final `graphify update .`: passed after verification, no topology change. README semantic feature node refreshed and communities/report regenerated. Graph health self-loops are pre-existing (HEAD also has 4); no missing/dangling/collapsed edges. 17 source files yield no symbols (existing extractor limitation).
- Signed commit: `c29d1fe` (`✨🤖 explain dashboard spending totals and link custom-period budgets [skip ci]`). Pushed to `origin ai/insight-drilldown`. Ticket evidence and screenshots remain local under ignored `.scratch/` as required by the issue-tracker layout. No existing test edited; only the two named tests added. No next-env.d.ts staged.
