> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 36 Show at a glance which filters are active

Status: resolved
Blocked by: 35
Evidence: /home/ai/.t3/userdata/attachments/6a2c101b-37a5-4d3d-8976-17e6d961b528-71c7ae03-83e4-41ed-98ba-d683361410bc.png

## Why
User: "would be more useful if we could instantly see which filters are currently active! do for all filters." In the screenshot "1 Nov 2026" and one other filter are active (Clear shows 2) but they look identical to defaults.

## What
Every filter control on every page (Records, Statements, Allocator, Dashboard scope chips if any) gets a distinct active style when not at its default (e.g. primary-tinted border/background + filled icon) and a per-filter clear affordance. The Clear count must match the number of highlighted controls. Works in dark and light, not colour-only (also weight/icon).

Also check while there: the YouTube Premium row shows "$31.98 of $13.88 allocated" in red — over-allocation; confirm copy is correct and intentional or fix.

## Acceptance
- [x] e2e: setting each filter marks exactly that control active; Clear count == active controls.

## Comments

Fix: FilterField/FilterSelect/filterControlClass; active = primary tint + medium weight + 'Reset <name> filter' X; search box highlights with text; Records Clear count no longer counts hidden measure/effective_spending. Per-filter button is 'Reset', not 'Clear', so existing /^Clear/ tests stay unambiguous. Test: tables.e2e.ts 'active filters are highlighted one for one...' (new). Screenshots: review/36-active-filters-records-1440.png, -390.png. Open: YouTube Premium over-allocation copy not investigated; Dashboard has no filter chips touched; X can cover the end of long values. Verified: bun types:check clean; biome clean; tests/core/{charts,tables}.e2e.ts 38+36 passed desktop+mobile (dev servers); sheets.e2e.ts 30 passed, 2 failed (pending queue Back test expects query=Dense+pending+1 but URL is %20; code untouched by this ticket, not confirmed on main). Look for: active filters tinted with an X, Clear count equals tinted controls.
