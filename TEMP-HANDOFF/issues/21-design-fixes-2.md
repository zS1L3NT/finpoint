> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 21 design fixes, round 2

Status: resolved
Blocked by: —
Spec: ../spec.md · Screenshots: ../review/20-*-{main,branch}-{dark,light}-{1440,390}.png

## Opus findings (from 20-dashboard-branch-dark-1440 and 20-panel-branch-dark-1440)

1. **Broken: charts don't resize.** With the panel closed at 1440, the Spending forecast chart renders in a ~180px box at the left of its card, and the Category trend bars are squeezed into ~180px with overlapping month labels. Charts must re-measure whenever their container width changes (panel open/close, sidebar toggle, window resize). Check the chart container/ResizeObserver in src/components/charts/* and the panel width transition; make sure the measurement happens after the transition ends too.
2. **Degraded: panel open stacks the whole dashboard into one column.** At 1440 with the panel docked, the main column (~900px) shows the summary band as three stacked rows and every card full-width. The three summary metrics must stay in one row at ≥ 860px main-column width; use container queries (`@container`) on the main column instead of viewport breakpoints so layout follows the space actually available.
3. **Degraded: Biggest changes rows.** Category name is centred and the explanation truncates ("less than your 2-..."). Left-align name and sentence like main's rows; let the sentence wrap to two lines instead of truncating; amount column right-aligned.
4. Category trend x-axis labels must never overlap; abbreviate months ("Jun") when narrow.

## Sonnet findings

Method: paired 20-* screenshots, light + dark, 1440 + 390. No source edits.

1. **broken** — `20-dashboard-branch-light-1440`, `20-dashboard-branch-light-390`, `20-panel-branch-dark-390`: Category trend x-axis labels collide ("un 2026Jul 2026Aug 20…") and "Oct 2026 Selected" is clipped. Fix: in `src/components/charts/category-history-chart.tsx` render month ticks as short "Jun"/"Jul" (add year only on the selected one), with `text-anchor` centred and `overflow-visible`. This is the same defect as Opus #4, but it also shows at 390 in light mode (dark 390 is fine), so the chart is measuring a stale width in light mode too.
2. **broken** — `20-panel-branch-light-1440`, `20-panel-branch-light-390`: the "panel" capture is a full-page shot with the drill panel not visible in the viewport. At 390 the sheet is off-screen at the page bottom ("Spending on Mon 5 Oct" is cut off); at 1440 light there is no docked panel at all. This is not a valid light-mode verification. Fix: re-take the light panel shots with the panel open and in the viewport (the dark ones are fine). Check that the sheet/dock actually renders in light mode.
3. **degraded** — `20-dashboard-branch-light-1440`, "Spending forecast" card: after the chart renders at ~180px, the card still reserves ~250px of empty height. The legend and caption sit far below the plot, and the "$3.93k / $2.05k" pills float far right. Fix: once Opus #1 is fixed, check that `src/components/charts/chart-frame.tsx` height is derived from the measured width, not a fixed min-height.
4. **degraded** — `20-dashboard-branch-light-1440`, Largest Records card (and Biggest changes): the cards stretch to the tallest row, leaving ~80px of empty space under "See all" and in Biggest changes. Fix: `items-start` on the three-card grid, or `h-fit`. Place "See all" in the card header (right-aligned `variant="link"`) rather than in a bottom row.
5. **degraded** — `20-dashboard-branch-*-390` / `20-panel-branch-dark-390`: Biggest changes sentence still truncates ("less than your 2-…"). Opus #3 covers the desktop name alignment. At 390 also drop the "Against the 2-month average…" footer duplication: the "Comparison window" copy repeats what each row says. Fix: `src/components/charts/category-movers.tsx`, `whitespace-normal`, a single footer line.
6. **degraded** — `20-dashboard-branch-light-1440`: summary metric labels "Spent / Income / Left over" are dotted-underline Term buttons with a stray, separated chevron ("›") floating mid-cell. Main used plain labels. Fix: put the chevron next to the label (`ml-1`, `opacity-60`) or at the far right; remove the dotted underline on metric labels (keep Term underline only in running text).
7. **degraded** — `20-records-branch-light-1440` vs main: the filter bar gained the Sort select (Newest first) first in the row, which pushes "Any amount" and "Clear" onto a second row. Main fitted all in one row. Fix: `app/records/page.tsx:320`, shrink the sort trigger to `w-auto` with an icon, or put it at the right end of the table header. Make "Clear" not wrap alone.
8. **degraded** — `20-records-branch-light-1440`/`-390`: pending Records now show "$0.00 of $14.82 allocated" (and the "full" row shows "$X of $X allocated" per REPORT #5) in `text-destructive` red under the amount. On main it was a quiet caption. Fix: `src/components/table/record-columns.tsx:92-99`, render the caption in `text-muted-foreground` unless over-allocated, and keep the red only for the amount.
9. **polish** — `20-records-branch-light-390`: the Sort select now takes a full row with a different height from the filter row. Make it the same `FILTER_CONTROL_CLASS` grid cell as the filters.
10. **polish** — `20-dashboard-branch-light-1440`: Monthly budgets "Travel" row switched to "used · no plan" (good) but the card is now the same height as the forecast with ~30px empty gap and the Edit buttons lack the top-right alignment main had ("Edit" sits at different y from the name). Fix: align `Edit` with the name baseline in `monthly-budget-usage.tsx`.
11. **polish** — `20-dashboard-branch-light-1440`: Spending calendar at 1440 is narrower than main (3-up grid) with cells ~38px tall. Dollar labels "$33" are cramped and overlap the day number at ~12px. Fix: raise cell min-height in `spending-calendar.tsx` to 44px at the 3-up layout, or use `2xl:grid-cols-3` only.
12. **polish** — `20-panel-branch-dark-1440`: the docked panel's header is flush against the main column (top aligned to the tabs row, not the page title), and the card extends only to the viewport height while the page continues. This is fine for sticky behaviour, but the panel stays short beside the summary band with ~40px of unused gap at the bottom. Acceptable; check only that it does not overlap the sidebar at 1280.

**Checked, no difference from main:** Statement detail page (dark/light, 1440/390) now matches main apart from the intended Workflows → Allocate rename. The lost-colour items (semantic money colours, budget bar colours, calendar greens, category icon tiles) match main.

**REPORT.md status:** fixed — #2 (Statement Records table restored), #3 (focus ring, no ring visible), #4 (icons, dates, signed/coloured amounts, rotating chevron seen in the panel), #8 (sparklines coloured, delta chips back), #12 (icons, chevrons), #13 (Travel shows "no plan"). Still unfixed or only partial — #1 (grey slabs fixed but "Saved this month" row is still a separate bar), #5 (allocation caption still on every row, Sort control still outside the FilterBar rhythm), #7 (Term strip removed, but see finding 6), #9 (partially: Opus #3), #10 (Opus #2), #11 (now three across at 1440 — fixed), #15 ("›" glyphs still in Categories rows), #16 (mobile sheet still has no grab handle, footer still repeats Total), #14, #17, #18 (not visible in these shots, unverified).

## Acceptance
- [x] All findings above fixed; paired main/branch screenshots (dark+light, 1440 panel closed and open, 390) re-taken AFTER the fix, in ../review/21-*.png.
- [x] Spec §12 done-definition.

## Comments


### Implementation evidence (2026-11-07)

- Charts: retain ResizeObserver measurement throughout layout transitions, measure on mount, and prevent render-callback memoisation from retaining the first small chart geometry. Forecast height follows its width. The production screenshot inspection caught the stale geometry before completion.
- Layout: the main column is a named container; summary metrics stay across at 600px, forecast/budgets and category cards retain columns from 600px, and lower cards use two columns from 600px and three from 860px. Cards align at their natural heights.
- Rows and copy: Biggest changes is left-aligned with wrapping sentences, amounts on the right, and one comparison footer. Month ticks show short names and the selected year. Largest Records has See all in its header. Metric labels are plain, chevrons adjacent, sparklines and delta chips retained.
- Records: Sort participates in the mobile two-cell filter grid and desktop compact row; Clear stays alongside the other controls. Allocation captions are muted unless over-allocated; money colours remain semantic.
- Polish: budget Edit aligns with names; calendar cells are at least 44px; category chevrons use icons; the mobile sheet has a handle and no repeated Total footer.
- Production screenshots: paired `21-{dashboard,panel,records}-{main,branch}-{dark,light}-{1440,390}.png` in `../review/` (24 files). Opened every final branch screenshot and checked chart width, month labels, wrapping, card heights, colours, filters, and visible panel/sheet. Main has no Drill-down, so its panel-named reference captures show the corresponding dashboard.
- Additional `21-sidebar-branch-light-1280.png`: sidebar right edge 288px; dock left edge 813px, right edge 1233px in a 1280px viewport. No overlap. Opened this screenshot too.
- Main comparison used a detached main worktree in `/tmp/finpoint-main-21`; removed after capture. Production servers ran one at a time on 5180.
- Edited tests in `tests/core/charts.e2e.ts`: “overview charts: every dense chart fits the viewport with usable graph surfaces” now checks actual chart grid geometry against SVG width; “overview: summary, calendar, Budgets, Category mix, movers and month change reconcile” checks the intentionally shorter comparison footer.
- `bun test`: 175 passed, 0 failed. `bun lint` applied formatting; `bun lint:check`, `bun types:check`, and `bun run build` passed. Browser and final graph evidence follows after completion.
- Earlier verification was interrupted when the external production-server process received SIGTERM; the rerun uses Playwright-managed production-server lifecycle. No test was loosened for that interruption.

Look for: full-width forecast and trend charts in both themes, a three-metric summary beside the visible dock, wrapping Biggest changes sentences, naturally sized cards, one-row desktop filters and matching mobile filter cells.

### Completion review (2026-11-07)

- Reviewed all inherited source/test diffs and retained their intended styling and layout corrections. README now correctly says summary labels open Records and definitions remain in drill-down prose. No domain or persistence APIs changed.
- Independently opened all 12 branch dashboard/panel/records screenshots plus the 1280 sidebar screenshot. All requested findings are visibly addressed; colours, icons, sparklines and delta chips remain. The dock/sheet is visible in both themes.
- Additional edited tests in `tests/core/drilldown.e2e.ts`: “day drill-down: totals, retarget, Back, close, focus and invalid URLs” distinguishes positive summary from intentionally signed Record amounts; “Biggest changes compares named periods and preserves the month through reload and Back” uses the intentional sentence copy.
- Additional edited test in `tests/core/routes.e2e.ts`: “term definitions open by keyboard and tap” verifies plain summary labels and tests the Pending definition in the drill-down, where definitions remain.
- Fresh `bun test`: 175 passed; `bun lint`, `bun lint:check`, `bun types:check`, `bun run build`: passed. Fresh full scoped browser run and screenshot refresh recorded below when complete.
- Graph health: 2,000 nodes and 8,023 edges, no dangling/missing endpoints or collapsed edges; four self-loops remain. Extractor warning: 16 files yield no symbols (configuration/test files); graph remains usable.

### Final evidence

- Signed commit: `1c9c3ce00af86738cd5d918c4fb696077ee49cb7` (`git log --format=%G?`: G). Pushed to `origin ai/insight-drilldown`; no PR, merge, rebase or force-push.
- Rejected the inherited panel `AnimatePresence mode="wait"` / selection-key change after a rapid close/reopen lost its content. Restoring the existing presence identity fixes the unchanged category/trend/budget selection test on desktop and mobile.
- Core verification: full `charts`, `drilldown`, `routes` on desktop/mobile: 69 route cases passed; final chart/drill run: 47 passed, two intentional project skips, one mobile timeout during the main rebuild. That unchanged mobile case passed in isolation (1/1). All 48 active chart/drill cases therefore passed on the final source. Logs: `/tmp/21-current-e2e.log`, `/tmp/21-final-core.log`, `/tmp/21-mobile-rerun.log`.
- Earlier desktop chart failures: Monthly Budget interaction and month-length timeouts, plus exact height 415.99993896484375 versus 416. All three unchanged tests passed in their immediate branch rerun (3/3), and again in the final chart run. Main's month-length and exact-height cases passed (2/2); no tests were loosened. Original branch failures and rerun counts are retained rather than hidden.
- Animation verification: `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- --config=.scratch/insight-drilldown/verify.config.ts tests/animations/{charts,drilldown,routes}.e2e.ts --project=desktop --project=mobile --workers=1`: 14 passed. `/tmp/21-final-animations.log`.
- Final `bun lint`, `bun lint:check`, `bun types:check`, `bun run build` passed after the panel presence correction. Domain: 175 passed. No domain logic changed.
- Re-took paired production screenshots with `npx -y agent-browser@0.27.0`: `../review/21-{dashboard,panel,records}-{main,branch}-{dark,light}-{1440,390}.png` (24 files), plus `21-sidebar-branch-light-1280.png`. Theme is persisted and reloaded on mobile; every branch image was opened independently. Desktop dashboard captures use a viewport expanded to the document height and settled before capture, avoiding full-page capture's transient chart geometry. Dock/sheet captures use the normal viewport so the panel is visibly present. Main has no drill panel, so its panel references show its dashboard.
- Used `git worktree add --detach /tmp/finpoint-main main`, `bun install`, production build; served main and branch one at a time on 5180. Servers killed by PID; main worktree removed and browser session closed. No next dev server was started or left running.
- Final `graphify update .` completed after source verification (`/tmp/21-graph-completion.log`); four required graph files committed. README semantic extraction was reviewed/refreshed and its manifest stamped. Health warning remains four self-loops and 16 zero-symbol files; no dangling/missing/collapsed edges. Token cost: 0 API input/output tokens.
- Unfixed ticket findings: none.

Look for: full-width forecast/trend in both themes, three summary metrics beside the visible dock, short month ticks, wrapping left-aligned Biggest changes, natural card heights, muted allocation captions, matching Sort/filter controls, and a visible mobile grab handle.
