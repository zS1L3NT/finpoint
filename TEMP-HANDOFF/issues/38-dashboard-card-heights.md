> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 38 Dashboard cards in a row have different heights

Status: resolved
Blocked by: 33
Evidence: /home/ai/.t3/userdata/attachments/6a2c101b-37a5-4d3d-8976-17e6d961b528-a97817f5-5e39-4bf2-bb1e-b94ba43a0d2a.png

## Why
User: "all these different heights..." Categories vs Category trend, and Largest Records vs Spending calendar vs Biggest changes, end at different heights.

## What
Cards sharing a grid row stretch to the same height (grid items stretch, card fills, content top-aligned, footers pinned bottom). Check every @container breakpoint (1440, 1280, 1024, 768) once the dock is gone (ticket 33).

## Acceptance
- [ ] e2e: cards in the same row have equal height (±1px) at 1440 and 1024.

## Comments
- Commit 89731cd. Removed `items-start` from the forecast/budgets row, the Largest/Calendar/Biggest changes row and the Categories/Category trend row; footers pinned (`mt-auto`): forecast sentence, Custom-period Budgets link, "more categories" button. The Categories row has a 27rem floor so its height does not change between months (existing test "reading different months keeps the XL row and chart height stable"); "cap five rows and keep natural heights" needed the button pinned to the card bottom.
- New e2e "Dashboard cards sharing a row have equal heights" at 1440 and 1024: red before (161px difference), green after. At 1024 the layout is one column, so the check there is trivially true.
- Failing and not mine: tests/core/charts.e2e.ts "category rows: names sit left-aligned" (ticket 37, other agent's uncommitted work).
- Screenshots: review/38-card-heights-1440-dark.png, 38-card-heights-row3-1440-dark.png, 38-cards-mobile-dark.png.
- Look for: all cards in a row end on one line; empty space inside the shorter card sits above its pinned footer.
