> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 08 summary band

Status: resolved
Phase: P1
Blocked by: 01
Spec: ../spec.md

## What

**Summary band rework:** 3 metrics, state-aware copy, metric drill-downs, "Saved this month" row (removes the investment block).

## Acceptance

- [x] Summary band shows Spent / Income / Left over with state-aware copy.
- [x] Each metric drills to its Records.
- [x] "Saved this month" row replaces the 4-metric investment block.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation evidence: summary measures domain test passed (4 assertions); bun lint:check and bun types:check passed; production build passed. Edited tests: tests/domain/drilldown.test.ts (measure reconciliation); tests/core/charts.e2e.ts (three metrics, neutral empty states, drill actions). Full domain run exposed category/trend reconciliation failure and timeout; browser summary run exposed old shortfall assertions, corrected pending rerun. Graph structural refresh passed; semantic README refresh pending. Screenshots: review/08-summary-desktop.png, review/08-summary-mobile.png. Look for: three clickable metrics and compact Saved row; no red missing-income balance. Status remains claimed pending complete verification. SHA: recorded in implementation commit.

Final evidence (supersedes pending notes above): SHA f47e187. bun test: 169 passed, 2224 assertions; bun lint, bun lint:check, bun types:check and bun run types:e2e passed. Production build passed. Summary browser case passed desktop/mobile in the final chart run; all 10 chart animation cases passed. Historical income copy uses full prior income months rather than partial sparklines. README semantic nodes refreshed inline and graph updated. Final screenshots: review/08-summary-desktop.png and review/08-summary-mobile.png (1440/390, production/demo/dark). Look for: Spent/Income/Left over each open the matching Records; missing income stays neutral; Saved is one compact row.
