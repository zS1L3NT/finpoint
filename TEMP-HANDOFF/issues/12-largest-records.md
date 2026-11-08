> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 12 largest records

Status: resolved
Phase: P2
Blocked by: 01
Spec: ../spec.md

## What

**Largest Records card** plus Records amount sort.

## Acceptance

- [x] Largest Records card lists the month's top Records and drills (`drill=largest`).
- [x] Records page can sort by amount.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation: scope-aware top-five Spending Records card, refunds included by absolute amount; drill=largest shows all matching Records. Open in Records preserves amount_desc. Records sort select persists amount_desc/amount_asc in URL; sorting is in listRecords before pagination, with day grouping disabled for amount order. README and URL ADR document behaviour.
TDD: new domain “largest selection and Records amount sorting preserve month and scope” failed before logic implementation (IDs out of order), passed afterwards across all scopes. Final bun test: 170 pass, 0 fail, 2239 assertions (215.62s).
Edited tests: tests/domain/drilldown.test.ts (new largest test); tests/core/drilldown.e2e.ts (new Largest Records card, drill, handoff and reload test). Existing assertions kept unchanged. New browser case passes desktop and mobile in /tmp/fin-core-verified.log.
Verification: bun lint, bun lint:check, bun types:check, bun run build passed. Follow-up focus restoration guards against overriding a newly focused chart after closing the panel; final focus tests recorded below. Graphify code refresh plus semantic refresh of README/ADR completed (1974 nodes). Graph health: 4 self-loops, zero dangling/missing endpoints.
Screenshots: review/12-largest-desktop.png (1440), review/12-largest-mobile.png (390), production build on port 5180, demo data and Dark selected. Look for: five ranked rows with stable amounts and a clear See all action beside the calendar.

Final verification: functional full run /tmp/fin-core-verified.log passed 9/10, with the earlier desktop focus assertion failing before the final guard. Focus correction then passed unchanged day-drill tests on desktop and mobile (2/2, /tmp/fin-focus-final.log). Category/forecast, edit save/live-total/focus, pivot and Largest Records/handoff cases passed both sizes. Final animation run /tmp/fin-anim-final.log: 3/3 passed. No existing test assertions edited or loosened. Final lint:check and types:check clean. Earlier failures are retained above as evidence; no flaky classification made. Semantic README/ADR refresh completed; graph health warning remains four self-loops, no missing/dangling/collapsed edges.

Final signed commit: b4acd7f. Both commits pushed to origin ai/insight-drilldown. Review images remain local under .scratch/insight-drilldown/review/. Production server stopped by PID.
