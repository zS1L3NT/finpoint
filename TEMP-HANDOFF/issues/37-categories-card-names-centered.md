> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 37 Categories card: names render centered

Status: resolved
Blocked by: —
Evidence: /home/ai/.t3/userdata/attachments/6a2c101b-37a5-4d3d-8976-17e6d961b528-e713f84a-51c5-48a7-8d88-79001e63e2c0.png

## Why
User: "is this broken?" In "Categories in <month>" the category names sit centred between the dot and the amount instead of left-aligned next to the dot. Likely the row became a button (drill) and inherits text-center / justify-center.

## Acceptance
- [x] Names left-aligned next to the dot, desktop + mobile; e2e asserts name left edge is within 16px of the dot.
- [x] Audit every other row turned into a button in this branch for the same bug.

## Comments

Fix: text-left on the row buttons (buttons centre text by default). Test: charts.e2e.ts 'category rows: names sit left-aligned next to their dot' (new). Screenshots: review/37-categories-1440.png, 37-categories-390.png. Verified: bun types:check clean; biome clean; tests/core/{charts,tables}.e2e.ts 38+36 passed desktop+mobile (dev servers); sheets.e2e.ts 30 passed, 2 failed (pending queue Back test expects query=Dense+pending+1 but URL is %20; code untouched by this ticket, not confirmed on main). Look for: names left next to the dot in the Categories card.
