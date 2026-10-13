# Fix Duplicates — UI redesign

Behaviour from `spec.md` stays unchanged. This file changes only presentation and interaction. Visual reference: `app/allocator/pending/page.tsx` (Replace Pending) and `src/components/dialogs/statement-replacement-review.tsx`. Fix Duplicates should look like it belongs to the same Workflows family.

## Problems with the current page

- Each row has three controls that compete with each other: a raw `<input type=radio>`, a "Delete as duplicate" checkbox and a "Select for separate pair" checkbox.
- The pair list shows as "1 ↔ 2, 2 ↔ 3". The user has to decode it.
- The user has to find the bank's description change by eye. That is the whole point of the page.
- Filters do not use `FilterBar`/`ClearFiltersButton`. The empty state is a bordered `<p>`, not `Empty`. Success is a plain div, not `Alert`. Amounts have no `classForCurrency`. Dates show as raw ISO slices.
- The manual checkbox and the dismissed-view button are two separate toggles for what is really one choice: which list you are looking at.

## Layout sketch

```
Workflows                                        [header + AllocatorTabs unchanged]
───────────────────────────────────────────────
[Search descriptions...                      ]
[▾ Suggested duplicates ] [▾ All Accounts ] [Clear]   Same account · same day · same amount
                                                        
┌ DBS Multiplier · 3 Oct 2026 ─────────────── -$12.40 ┐
│ ┌──────────────────────────────────────────────────┐ │
│ │ SHENG SIONG@BEDOK  NORTH        [Keep] [Delete]  │ │  ← changed tokens highlighted
│ │ 10:42 · 2 Allocations                             │ │
│ └──────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────┐ │
│ │ SHENG SIONG @BEDOK NORTH        [Keep] [Delete]  │ │
│ │ 10:42 · No Allocations         Not a duplicate ↺ │ │  ← only shown relative to the kept row
│ └──────────────────────────────────────────────────┘ │
│ Keep 1 · delete 1                    [Review deletion] │
└──────────────────────────────────────────────────────┘
                     Showing 1 of 4 groups  ‹ 1 2 ›
```

## Decisions

1. **One view selector replaces the checkbox and the toggle button.** Use a `Select` in `FilterBar` with three options: `Suggested duplicates` (default, no param), `All same-day matches` (`view=all`, the old manual mode), and `Marked separate` (`view=dismissed`). Next to it, show a muted hint the same way Replace Pending does: "Same account · same day · same amount". In `view=all`, add "· descriptions not compared". Search goes above as a full-width `Input`, as on Replace Pending. Account filter: `Select` with a `lucide:landmark` icon and `FILTER_CONTROL_CLASS`. Add `ClearFiltersButton`.
2. **Group card header:** account name · `formatDate`-style human date on the left (use the existing date helper from `@/lib/utils`; check which one exists). The amount sits on the right, `font-semibold tabular-nums`, with `classForCurrency`. Add a small `Badge variant="outline"` with "N Statements" only when N > 2.
3. **Each Statement is one tile.** It shows the full description (wrapping, never truncated; spec Further Notes), linked to `pathStatement`. Under it, a muted line: time · "N Allocations" / "No Allocations". On the right, a `ToggleGroup` (single, size sm, outline) with `Keep` and `Delete`. On mobile it stacks below the text.
   - Choosing `Keep` on one tile clears `Keep` from every other tile. Any `Delete` choices that are no longer eligible against the new keeper are dropped, as now.
   - `Delete` is disabled until a keeper exists. It is also disabled when the (keeper, tile) pair is not in `group.pairs` (outside `view=all`). Ineligible tiles dim to `opacity-60` and show the caption "Not suggested as a duplicate of the kept Statement".
   - Tile tint: kept tile `border-emerald-500/40 bg-emerald-500/5`. Delete tile `border-destructive/40 bg-destructive/5`, with the description in `text-muted-foreground line-through decoration-destructive/40`. Animate the colour with `transition-colors duration-150 ease-out` (the tabs use the same).
4. **Difference highlighting (the creative core).** Split each description into words (whitespace-delimited, keep the original casing). A word that does not appear in every other Statement of the group, compared case-insensitively, gets a highlight: `rounded-sm bg-amber-500/15 px-0.5 text-amber-800 dark:text-amber-300`. Keep this a small pure helper inside the page file. It is display only and has no matching semantics. With spacing-only changes such as `SIONG@BEDOK` vs `SIONG @BEDOK`, the differing words light up. That is the intent.
5. **"Not a duplicate" replaces the third checkbox.** Show it only in the Suggested view, as a `Button variant="ghost" size="sm"` with a `lucide:split` icon, on each non-kept tile whose (keeper, tile) pair is in `group.pairs`. It calls `dismissDuplicatePair(keeper, tile)`. In a 2-Statement group with no keeper, put it in the card footer as "Not duplicates" so the common case needs one click. Pair semantics stay exactly as in the spec.
6. **Card footer:** a live summary in muted text, e.g. "Keep 1 · delete 2", or "Choose the Statement to keep" before a selection. Right-aligned primary `Button` "Review deletion" (`lucide:trash-2` inline-start), disabled until there is a keeper and at least one Delete.
7. **Motion:** wrap the cards in `AnimatePresence initial={false} mode="popLayout"`, with `layout="position"`, the same enter/exit as the pending queue (`initial {opacity:0,y:6}`, exit `{opacity:0, scale:0.97, transition: TRANSITION.fast}`, `layout: SPRING.snappy`). A group then folds away smoothly when it is fixed or dismissed. Render nothing while live queries are `undefined`.
8. **Success** uses `Alert` with `lucide:circle-check`. Title: "Duplicates deleted". Description: "Check these Records; any that lost an Allocation may now be pending." Record links show as `Badge variant="outline"` links, plus a ghost icon `lucide:x` close button.
9. **Empty states** use `Empty` with `EmptyMedia variant="icon"`:
   - Suggested: icon `lucide:copy-check`, "No duplicates found", "Bank exports look clean. Switch to All same-day matches to check by hand."
   - All: icon `lucide:calendar-search`, "No same-day matches", "No two Statements share an account, day and amount."
   - Dismissed: icon `lucide:split`, "Nothing marked separate", "Pairs you mark as not duplicates appear here."
   - With active filters, use the description "No groups match these filters."
10. **Marked separate view:** a compact card per pair. Both descriptions are stacked and diff-highlighted (same helper), with the header line account · date · amount and a ghost `Restore suggestion` button with a `lucide:undo-2` icon.
11. **Review dialog** moves to `src/components/dialogs/duplicate-review.tsx`, mirroring `statement-replacement-review.tsx` (props `input, open, onOpenChange, onFixed`).
    - Sections: **Keep** (one emerald-tinted tile), **Delete** (destructive-tinted tiles). Each tile shows the description, time and an allocation count.
    - **Allocations**: one sentence in an `Alert`. Keep the existing three outcomes and wording logic. When a source must be chosen, the candidate tiles are selectable buttons (`aria-pressed`, same tint pattern), not raw radios.
    - **Affected Records**: rows with the linked title on the left. On the right, per allocation, a `Badge` "Moves" (secondary) or "Removed" (destructive outline) plus the amount with `classForCurrency`.
    - Footer: `Cancel`, then destructive `Delete N Statement(s)`.
12. **Data addition:** `DuplicateGroup` gains `allocations: Record<string, number>` (statement id → allocation count), filled in `duplicateGroups`. The dismissed pairs from `dismissedDuplicatePairs` also need account/date/amount, which are already on the statements. This is additive; no other logic API changes.

## Out of scope

No behaviour, matcher, migration or routing changes. Old `manual=true` links do not need to keep working, because the tab is unreleased.
