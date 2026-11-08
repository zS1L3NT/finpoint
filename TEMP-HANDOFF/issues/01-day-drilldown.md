> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 01 day drilldown

Status: resolved
Phase: P0
Blocked by: 00
Spec: ../spec.md

## What

**Day drill-down end-to-end:** `drilldown.ts` with `day` and measures, the `drill` param and `useDrill`, `DrillPanel` (chosen container), calendar day → panel, close/restore, domain test (panel total = calendar total for every demo day), core e2e plus animation test.

## Acceptance

- [x] `getDrilldown` in `src/logic/drilldown.ts` returns the Records behind a calendar day, sorted by amount, with a total.
- [x] Domain test: for every demo-data day, the panel total equals the calendar cell's number (same effective-spending measure).
- [x] `drill=day:<date>` param via `useDrill()`; router.push so Back closes the panel; invalid values close silently.
- [x] `DrillPanel`: docked 420px inspector at xl (main column narrows, no scrim), bottom sheet below xl; Esc/close restore focus to the opener; retarget swaps contents in place.
- [x] Core e2e (desktop + mobile) and one animation test, each added to exactly one CI group.
- [x] ADR `docs/adr/0001-drill-down-url-state.md` matches what shipped; `Drill-down` defined in `CONTEXT.md`.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

- Opus 2026-11-07: the prototype is now on this branch (bf2f415). HARDEN it, don't rewrite: apply ticket 00 review notes (width transition, no minus signs in spending drill, merged title+total header, one chevron meaning). Ticket 02 left `tests/core/charts.e2e.ts` calendar month-length navigation failing (hover preview vs selected day in spending-calendar.tsx): run it on this branch and on `main`, report both counts, and fix the code if it's a regression.

- Implementation: retained the prototype's domain read, panel, Record expansion and Statement pivot. Added smooth main-column resizing; merged title/total header; positive spending amounts and labelled refunds; one down-chevron for expansion; focus restoration only after closing, with no scroll; stricter malformed day URL rejection. Restored charts and donut hidden/removed prematurely by the prototype, and kept Category/budget click behaviour for tickets 04/05.
- Domain verification: `bun test` — 164 passed, 0 failed (2,037 assertions). New `tests/domain/drilldown.test.ts` checks every demo-data day across all Monthly Budget scopes against the calendar's effective spending and checks descending amount order (708 assertions).
- Edited existing tests in `tests/core/charts.e2e.ts`: “populated charts: tooltips stay numeric, drills work by keyboard and a Record save updates the mover amount”, “overview: summary, calendar, Budgets, Category mix, movers and month change reconcile”, and “spending calendar: month lengths show exactly their valid dates on an empty workspace”. These now hand off through “Open in Records”; the last expects the all-time Records page's actual empty copy, “No records found.” Date assertions remain unchanged. No tests loosened.
- Added `tests/core/drilldown.e2e.ts` (URL, totals, retarget, close, Back, focus, invalid date, direct URL and handoff) and `tests/animations/drilldown.e2e.ts` (intermediate width frames). Each joins exactly one CI group.
- Calendar investigation: on a warmed archive of `main`, the unchanged month-length test produced desktop 1 failure / mobile 1 pass; desktop selected 30 September but navigated to 9 September after hover changed the footer. Selected day now takes precedence over hover preview. Earlier cold runs also hit compilation timeouts; no failure is labelled flaky.
- Screenshots from the final production build, demo workspace, Dark appearance: `review/01-day-desktop.png` (1440px), `review/01-day-mobile.png` (390px). Captured with `agent-browser@0.27.0 --session t01` after the shared preview twice saved a 1280px desktop PNG despite a 1440px viewport. CLI browser and shared preview tabs closed.
- Look for: a compact header and positive spending amounts in the docked 420px panel, plus the same contents in the mobile bottom sheet.

- Completion agent re-audit (2026-11-07): retained the previous implementation, ADR and screenshots, and formatted the new domain test to repository tab style. Re-ran `bun test`: 164 passed, 0 failed, 2,037 assertions. `bun lint` and `bun lint:check` pass. The unchanged calendar month-length test passes on this branch on desktop and mobile; the saved warmed `main` run (`/tmp/01-calendar-main-warm.log`) has desktop 1 failure / mobile 1 pass. No failure is classified as flaky.
- Graph refresh: `graphify update .` succeeded; inline semantic extraction covered the changed CONTEXT, README and URL ADR concepts, followed by `graphify cluster-only . --no-viz --no-label`. Non-blocking health warnings: 15 code files yield no symbols, 88 isolated nodes and 10 thin communities; no refresh failure. All four required graph artifacts are included.
- Final browser verification: `bun run test:e2e -- tests/core/drilldown.e2e.ts tests/core/charts.e2e.ts --project=desktop --project=mobile`: 38 passed, 2 expected skips, 0 failed. `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/drilldown.e2e.ts tests/animations/charts.e2e.ts --project=desktop --project=mobile --workers=1`: 7 passed, 0 failed. The earlier mobile chart-intro failure also exists in the saved `main` animation run and passes on this final run; no flaky classification. `bun types:check` and `bun types:e2e` pass. Commands used the installed Node 22 bin directory on PATH because the initial shell omitted npm.
- Edited tests: added `tests/domain/drilldown.test.ts` (all demo calendar days reconcile across Monthly Budget scopes and descend by absolute amount), `tests/core/drilldown.e2e.ts` (URL/total/retarget/history/focus/handoff), and `tests/animations/drilldown.e2e.ts` (intermediate docking widths). Existing `tests/core/charts.e2e.ts` edits are the three named above, solely for the intended panel handoff and Records empty copy. `tests/animations/charts.e2e.ts` remains unchanged.

- Completion: signed commit `522c4fb99ff651a8541e16e0f567c2298f24ee4f` pushed to `origin/ai/insight-drilldown`; clean working tree. `bun run build` passes (`/tmp/01-build-completion.log`). Final graph refresh completed after verification (`/tmp/01-graph-completion.log`); community names use hub fallbacks after clustering, alongside the health warnings recorded above. No unresolved refresh failure or ticket acceptance issue. Production screenshots retained at `.scratch/insight-drilldown/review/01-day-desktop.png` and `.scratch/insight-drilldown/review/01-day-mobile.png`; no development or production server left running.
- Look for: the compact title/total header, positive spending with labelled refunds, a smoothly narrowing main column beside the 420px inspector, and the matching mobile sheet.
