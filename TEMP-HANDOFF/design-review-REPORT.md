> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Design review: `ai/insight-drilldown` (PR #48) vs `main`

## Method and limits (read first)

- **No main-vs-branch paired screenshots.** The machine was at load 20–29 with swap full (another agent's Playwright suite plus the dev server on :5173). Two `next build` attempts of the branch ran 25–35 min without finishing, and a `next dev` compile of `/` never finished in 25 min. I killed all of them by PID and removed `.next`. No `main` worktree was created, so there are no `*-main.png` files.
- **Screenshots come from the warm dev server on :5173**, which belongs to the `t3-69efe8e6` worktree. It is the same commit (854a48f) plus uncommitted edits to `app/(month)/page.tsx`, `src/logic/dashboard.ts`, README and tests. Dashboard shots are therefore named `*-branchwip-*`. Records, Statements and Allocate files are unmodified there, so those shots match the branch.
- **Captured:** DARK mode only. 1440 and 1280 desktop, plus 390 mobile for the Dashboard.
- **Not captured:** LIGHT mode, the Record editor, and Record and Statement detail pages. These were reviewed from the diff only.
- **No main comparison for any finding.** Everything below was judged from the diff against `main` plus the dark screenshots on the branch. Severity rests on that.
- Screenshots are in this folder. Names are `<area>-branch[wip]-dark.png`.

## Regressions

### Broken

1. **Summary band shows grey slabs and uneven cells.**
   - Screenshots: `dashboard-closed-branchwip-dark.png`, `dashboard-panel-day-1440-branchwip-dark.png`.
   - What shows: the "Left over" cell has grey bars above and below, and its label sits lower than the other two. With the panel open, "None yet" wraps over three lines.
   - Cause: `SummaryBand` in `app/(month)/page.tsx` wraps each `DashboardMetric` in a `<button className="cursor-pointer text-left …">`. `MetricGrid` relies on `gap-px bg-border` with `bg-card` cells. The button is the grid item and has no background. The inner `Metric` does not stretch, so the border colour shows through.
   - Fix: give the button `bg-card h-full min-w-0 transition-colors hover:bg-muted/40 active:bg-muted/60`, and let the Metric fill it. Prefer adding an optional `onSelect` to `Metric` (spec §8.2) and rendering the button as the root there. Add `[&>*]:h-full` or `h-full` on the Metric root.

2. **Statement detail page lost its Records table.**
   - Files: `app/statements/[id]/page.tsx`, replaced by `AllocationRows` inside a `Card`.
   - What was lost: category icon, date and time, pending badge, row actions and the per-row amount tone. These came from `useRecordColumns` and `DataTable`. The Record editor dialog was also removed from this page.
   - Fix: restore the `DataTable` with `useRecordColumns({amount:"allocated"})`, `mobileRow` and `RecordEditorDialog`. Keep `AllocationRows` only as the "of $X" hint, or put it in the expand column.

3. **Drill-down panel focus ring on open.**
   - Screenshots: `dashboard-panel-day-1440-branchwip-dark.png` and the 1280 shots.
   - What shows: a large white rectangle around the title, because the `h2` is focused programmatically.
   - Cause: `className="… outline-none focus-visible:ring-2 focus-visible:ring-ring"` in `src/components/drill/panel.tsx`, and `focus()` runs on every open. Programmatic focus after a click is not always treated as `:focus-visible`, so the ring appears.
   - Fix: drop `focus-visible:ring-2` from the title. Keep `outline-none` and move focus to the `aside` or the title with `focus({preventScroll:true})`, with no ring. The close button already has its own ring.

### Degraded

4. **Panel rows are bare text.**
   - Screenshots: `dashboard-panel-expanded-branchwip-dark.png`, `dashboard-panel-390-branchwip-dark.png`.
   - Problems:
     - No category icon (`Icon {...r.category}`) and no `MonthlyBudgetBadge`.
     - The date is the raw ISO string `r.datetime.slice(0,10)` ("2026-11-05").
     - Amounts have no sign or colour: "Refund $" text replaces `classForCurrency`, and spending is not red.
     - The pending reason is missing in rows. It appears only inside the expansion, via `AllocationRows`.
     - The chevron never rotates.
     - Title, total and caption in the header have no spacing: the `text-3xl` `<p>` has no `mt-*`.
   - Fix, comparing with `RecordAmountCell` and `formatRowTime`:
     - Reuse `useRecordMobileRow` pieces: `<Icon {...r.category} size={14}/>`, `<MonthlyBudgetBadge/>`, `PendingBadge`.
     - Use `formatRowTime(r.datetime, true)` or `parseDatetime(...).toFormat("d MMM")`.
     - Amount: `<span className={cn("font-medium tabular-nums", amountTone(value))}>{formatCurrency(value)}</span>`.
     - Chevron: `className={cn("size-4 transition-transform", expanded===r.id && "rotate-90")}` (spec §6.2: rotate 90°).
     - Header: `mt-1` on the total and `mt-0.5` on captions.
   - Also: the close control is a literal "✕" in a ghost Button. Use `<IconifyIcon icon="lucide:x"/>` with `size="icon-sm"`.

5. **Records list is noisy and the sort control is stray.**
   - Screenshot: `records-branch-dark.png`.
   - Allocation text: every row now shows "$40.09 of $40.09 allocated". `RecordAmountCell` changed `showAllocated` from `is_pending && allocated !== amount` to always. On `main` it showed only when it mattered. Rows with long text wrap to 3 lines ("$250.00 of $250.00 allocated").
   - Allocations disclosure: every row also gets a native `<details>/<summary>` "Allocations" with a default triangle. It adds height and does not match the table chevron language.
   - Sort control: "Newest first" is a lone full-width-looking Select between the header and the filters, outside `FilterBar` and without its icon or `FILTER_CONTROL_CLASS`. It breaks the grid rhythm.
   - Fix:
     - Show `AllocationProgress` only when `allocated !== amount` (on desktop `hidden sm:block` as before). For full rows show nothing, or a small check.
     - Replace `<details>` with a `Button variant="ghost" size="icon-sm"` chevron that rotates and uses `AnimatePresence` height (`SPRING.snappy`).
     - Move the sort `Select` into `FilterBar` with `FILTER_CONTROL_CLASS` and a `lucide:arrow-up-down` icon.
   - Files: `src/components/table/record-columns.tsx`, `src/components/allocation-rows.tsx`, `app/records/page.tsx`.

6. **Statements list: Allocations disclosure on every row.**
   - Screenshot: `statements-branch-dark.png`.
   - Same native-`summary` problem as item 5 (`statement-columns.tsx`). In the code it is placed above the description `<p>`, and the DOM order is fragile. Rows grow unevenly.
   - Fix: same chevron fix as item 5.

7. **Term definitions are a floating glossary strip.**
   - Screenshot: `dashboard-closed-branchwip-dark.png`.
   - What shows: four dotted-underline buttons ("Pending Allocation Effective spending Left over") sit above the metrics, detached from the labels they define. They are `min-h-11`, so the strip is tall. The spec wants `Term` inline on the metric labels, panel headers and filters (§6.6).
   - Fix: delete the strip. Use `<Term name="Left over"/>` inside the metric label (needs `label: ReactNode`), and add `Pending` to the review links and panel pending text. Make `Term` `inline` with `min-h-0` on desktop, with a 44px hit area only via padding on touch.

8. **Metrics lost their colour and delta chips.**
   - Files: `SummaryBand` in `app/(month)/page.tsx`.
   - Removed:
     - `delta`, the green/red chip.
     - `sparkColor` (`var(--income)`, `var(--spending)`): sparklines are now plain grey.
     - `tone`, the red/green top accent on Left over.
   - The spec did say neutral colour mid-month, but it kept red/green for plan comparisons and for Left over once income is in.
   - Fix: pass `sparkColor="var(--income)"`, `"var(--spending)"` and `"var(--foreground)"`. Set `tone={waiting ? "neutral" : tone}` for Left over. Keep delta only for non-mid-month comparisons.
   - Also: "Spent ›" has a chevron glued to the label text. Add a trailing `lucide:chevron-right` icon, `ml-auto`, `opacity-60 group-hover:opacity-100`.

9. **Biggest changes lost its colour and tidy columns.**
   - Screenshot: `dashboard-closed-390-branchwip-dark.png`.
   - Removed: the red/green ▲▼ delta, the `truncate` on the name, and the delta column.
   - The new copy "Groceries up $35.34 vs your 2-month average" wraps on mobile and duplicates the trailing "Average $271.73".
   - Fix:
     - Keep the name on `truncate`, with a sub-line "$35 more than your 2-month average" in `text-xs text-muted-foreground`.
     - Right column: amount plus a `text-destructive`/`text-creative` mini label, neutral when `through` is set.
     - Remove the duplicate "Average …" line.

10. **Docked panel squeezes the summary band and stacks cards.**
    - Screenshots: `dashboard-panel-day-*-branchwip-dark.png`.
    - With the panel open, the `xl:grid-cols-[2fr_1fr]` row (forecast plus budgets) is dropped. They become full-width stacked cards (`!drill.selection &&`). The summary band keeps 3 columns at roughly 650px, so "None yet" wraps into three lines.
    - Fix: keep a 1-column layout only below `2xl` while docked. Make the metric grid `@container` aware: `grid-cols-1 @md:grid-cols-3`. Or stack the three metrics at under 700px of container width, with the sparkline hidden.

11. **Dashboard grid has an orphan card.**
    - Screenshots: `dashboard-lower-1440-branchwip-dark.png` and the mobile screenshot.
    - Largest Records, Spending calendar and Biggest changes sit in `grid gap-5 lg:grid-cols-2`. That is two columns holding three cards, so the third card is left alone with empty space beside it. The spec layout (§4.2) shows three across.
    - Fix: `lg:grid-cols-2 2xl:grid-cols-3`, or place Largest Records and Biggest changes in one column beside the calendar.

12. **Largest Records rows are not scannable.**
    - File: `src/components/charts/largest-records.tsx`.
    - There is no category icon, no date and no hover or press affordance beyond `hover:bg-muted`. Every row opens the same `largest` selection rather than its own Record. "See all" is an unstyled ghost button.
    - Fix: add the category `Icon`. Each row should open `focus=record:<id>` or at least highlight that Record. Style "See all" as `variant="link" size="sm"` with a chevron, aligned right.

13. **Budget row rhythm and the Saved row.**
    - `monthly-budget-usage.tsx` row: the new bar uses `my-2` and sits between the name and the numbers with no label. It is fine on desktop.
    - `$0.00 of $0.00 · $0.00 left` for Travel looks odd. Show "No plan" when `amount === 0` or null, consistently.
    - The "Saved this month" row has no hover, press or icon state.
    - Fix: add `hover:bg-muted/40 active:bg-muted/60 transition-colors`. A trailing chevron icon, not a "›" glyph.

14. **Duplicates tab filter row differs from the other tabs.**
    - Screenshot: `statements-duplicates-branch-dark.png` against `statements-branch-dark.png`.
    - The Search input has no icon, the filters are laid out differently, and widths change between tabs (the Duplicates and Replace pending pages are simply moved as they were).
    - Fix: use the same `SearchInput` and `FilterBar` pattern as `/statements`. Low priority, since it mirrors the old Workflows pages.

### Polish

15. **"›" glyphs as chevrons.** These appear in the category rows ("Groceries ›") and the Largest Records amounts. Replace them with `lucide:chevron-right` icons for a consistent affordance.

16. **Mobile sheet.** `h-[85dvh]!` is a single detent with no grab handle. The "Open in Records" button is full width. The footer duplicates "Total", which is already in the header.

17. **`AllocationProgress`** is `block max-w-36`. It wraps awkwardly in narrow amount columns.

18. **Panel section copy.** The `Edit Record` button is small and sits above the allocation text. The Back and Allocate buttons use `outline` variants at different sizes.

## Things that look good

- **Sidebar.** "Allocate" renders correctly, with the active state intact and dark mode fine.
- **Statements tabs.** `Statements · Replace pending · Duplicates` are consistent with the old tab style, and the active underline works.
- **Allocate page.** It renders cleanly and stays consistent with the rest of the app.
- **Monthly budget rows.** Bars carry the budget colours, and over-plan is shown in `text-destructive`.
- **Forecast chart and legend chips.** Colours were preserved.
- **Calendar.** It looks unchanged, apart from the removed footer button.
- **Largest Records card shell.** It matches the other cards in the dark theme.
- **Dark-mode tokens.** The branch changes no CSS tokens. A grep for hard-coded colours (`#hex`, `text-red-*`, `bg-white`) in the new panel, allocation and term components found none.
- **Panel on mobile.** The sheet renders as a sheet, with sensible content.
- **Removed charts.** The weekday, Spending by day and Surplus/Shortfall charts are gone as intended.

## Not verified

- Light mode on every screen.
- The Record editor Money in/out control. From the diff: `ToggleGroup` with `min-h-11`, placed above the Amount field with no label or spacing check.
- Record and Statement detail pages. The Statement detail page is covered by item 2.
- Mobile Records and Statements lists, and the 390 Statements tabs.
