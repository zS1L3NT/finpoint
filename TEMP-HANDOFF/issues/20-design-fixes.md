> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 20 design fixes (from Sonnet design review)

Status: resolved
Blocked by: —
Spec: ../spec.md · Review: ../design-review/REPORT.md (fix EVERY broken + degraded item there; polish items if cheap)

## Opus decisions that override the report where they differ

1. **Records / Statements list rows:** remove the native `<details>` "Allocations" disclosure from list rows entirely (Allocation rows live in the drill panel and on detail pages). Show the "$X of $Y allocated" line ONLY when the Record is pending / not fully allocated, in the existing pending/amber tone used by main. Fully allocated rows look exactly like `main`.
2. **Sort control:** move the sort Select inside `FilterBar` with the other filters, same size/style (FILTER_CONTROL_CLASS).
3. **Glossary strip** above the summary metrics: delete it. Instead the metric labels themselves ("Spent", "Left over") and "Pending"/"Allocation" where they appear in copy use the `Term` component inline (dotted underline + popover).
4. **Summary band:** restore main's look exactly (card backgrounds, hairline grid, delta colours, sparkline colours, Left over / shortfall tone). Clickable metrics: put the click on `Metric` via an `onSelect` prop with hover bg like other interactive cards; no grey slabs. The "Saved this month" row keeps the same card styling.
5. **Statement detail page:** restore main's Records table (icons, dates, actions, Record editor). Add the allocated portion ("$12.40 of $49.60") as a column/secondary line in that table instead of replacing it. Same for Record detail if its Statements table was replaced.
6. **Drill panel rows:** reuse the Records list row look (category icon tile, title, category · time, amount coloured and signed exactly like the Records list). Dates formatted like the app ("Sun 1 Nov"), never ISO. Expand chevron is `lucide:chevron-down` rotating 180° with TRANSITION.fast. Close button = `IconifyIcon lucide:x` ghost icon button. No visible focus ring on the programmatically focused title (outline-none; keep focus-visible for keyboard).
7. **Biggest changes:** restore red/green direction colours and truncation from main.
8. **Dashboard grid:** no orphaned card — cards in a row must fill the row at every width (with and without the docked panel). When the panel is docked at xl, the summary band may wrap to 3 stacked-then-row layout but never squeeze text into 2-word lines.
9. Never remove colours, icons or states that `main` has unless the spec explicitly removes the whole section.

## Acceptance
- [x] Every REPORT.md broken/degraded item fixed or explicitly overridden above.
- [x] Paired dark AND light screenshots (main vs branch) for Dashboard, panel open, Records, Statement detail in ../review/20-*.png.
- [x] Spec §12 done-definition.

## Comments

Implementation checkpoint: restored main's Record/Statement detail tables and editors; removed list Allocation disclosures; moved sorting into FilterBar; restored metric card roots, colours, deltas and responsive layout; inline metric definitions; signed/coloured panel amounts, dates, icons, pending badges, rotating chevron and close icon; mover truncation and direction colours; Largest Records icons/dates/individual focus; search icon on Duplicates. Compared touched components with origin/main (new panel/LargestRecords/Term have no main equivalent).
Verification: bun lint and bun lint:check passed; bun types:check passed. Graph refreshed (1997 nodes / 8015 edges); warnings: 16 code files yield no symbols, community labels renamed by hub, README semantic refresh still pending. Edited test: tests/core/charts.e2e.ts metric helper and sparkline accessible label reflect intentional Metric root/chevron change. No assertions removed.
Open: paired dark/light main-vs-branch screenshots missing (Turbopack and webpack stalled under load 40, full swap; stopped own build/browser by PID, removed main worktree; port 5173 untouched). Full core/animation verification remains outstanding. Zero-plan Budget copy and remaining inline Pending/Allocation definitions still need review; this ticket remains claimed.
Look for: restored card hairlines, semantic money colours, icon row rhythm, and full detail-table interactions.

Checkpoint pushed: 2c78e83 (signed), existing PR #48 only. Final full-domain retry again exceeded the reconciliation test timeout and emitted a later mismatch; remaining test processes stopped by PID. No new PR opened.


### Final verification — 2026-11-07, commit 11632a19298f22824e06f89b01bc1256895f8848

- `bun test`: **175 passed, 0 failed**, 2,258 assertions (full run; review/14-20-domain.log).
- `bun lint`, `bun lint:check`, `bun types:check`, and `bun run build`: passed. The final browser bundle was built with `taskset -c 0,1 bun run build` to keep memory bounded.
- Core: `bun run test:e2e -- --config=.scratch/insight-drilldown/verify.config.ts tests/core/{charts,routes,tables}.e2e.ts --project=desktop --project=mobile --workers=2`: full run covered 135 cases (127 passed, 2 skipped, 6 subsequently corrected). Focused rechecks passed the comparison and duplicate-link cases; the final 16-case desktop/mobile regression run passed all 16, including unchanged layout/pointer audits and pending/allocated amount checks. Every previously failing core case is green after its correction.
- Animations: `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- --config=.scratch/insight-drilldown/verify.config.ts tests/animations/{charts,drilldown,routes,tables}.e2e.ts --workers=1`: 71 cases covered, 63 passed initially. Focused recheck passed 15/16; the remaining mobile paging case then passed unchanged after layout fixes. The complete final mobile tables animation file passed **9/9**, alone with one worker. Every earlier failing animation case has a passing recheck. The initial tall interruption sampler missed its observation window; its unchanged recheck passed. No flakiness claim or threshold/timeout relaxation.
- The scratch config changes only testDir/baseURL and disables automatic web servers. All browser verification used the single production server on :5180; the initial cold dev attempts were stopped and superseded by production checks. No servers, test processes or screenshot browsers remain running.
- `graphify update .` plus host README semantic refresh completed after final verification: **2,000 nodes / 8,022 edges**. Included graph.json, GRAPH_REPORT.md, manifest.json and .graphify_labels.json. Health: zero missing/dangling endpoints; four self-loops remain. Extraction warns that 16 code files yield no symbols. README semantic extraction is complete; host token counts unavailable. No refresh failure remains.
- Edited tests and exact reasons/names: [review/20-edited-tests.md](../review/20-edited-tests.md). Files: tests/core/charts.e2e.ts, tests/core/routes.e2e.ts, tests/core/tables.e2e.ts, tests/animations/tables.e2e.ts. Unexpected failures were fixed in source; test edits follow intentional copy, route, disclosure and detail-table changes.
- Signed commit: `11632a19298f22824e06f89b01bc1256895f8848`. Existing draft PR #48 only; no new PR. Working branch remains ai/insight-drilldown.

Remaining source fixes completed: zero-value plan copy; inline Pending and Allocation definitions; stable metric accessible names; pointer cursors; Largest Records long-title containment; compact mobile allocation progress below descriptions; mobile Records/Statements spacing that preserves five-row paging. Allocation definitions sit at the expanded section heading so Statement actions remain first inside the row list.
Paired screenshots: `../review/20-{dashboard,panel,records,statement}-{main,branch}-{dark,light}-{1440,390}.png` (32 PNGs). See review/20-comparison-notes.md. Main baseline is origin/main 3609d85, built in a temporary scratch git worktree, then removed. Main has no drill panel, so its panel image is the same date selection on the baseline Dashboard. Branch screenshots were refreshed from the final build after layout fixes.
Look for: restored card hairlines and money colours, compact fully allocated rows, readable pending progress, docked/mobile panel rows, and restored Statement Records tables and editor actions.

Push confirmed: origin/ai/insight-drilldown = 11632a19298f22824e06f89b01bc1256895f8848; signature verified (G). Working tree clean; temporary main worktree removed; no task server/browser/test processes remain.
