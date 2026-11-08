> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 35 Records and Statements filter widths consistent across screens

Status: resolved
Blocked by: —

## Why
User: "can we make the width of record and statement filters consistent across screens?" The filter controls change width with their current value and differ between /records and /statements (and the allocator if it shares them).

## What
One shared width per filter kind (sort, category, budget, treatment, status, date, amount, clear), same on Records and Statements, stable when the value changes (truncate long values with title). Same grid/gap on both pages at 1440, 1024, 768, 390.

## Acceptance
- [x] e2e: each shared filter's width equal on both pages, and unchanged after picking a long value.

## Comments

Fix: FilterBar is a grid of 10rem tracks from sm up, controls w-full, per-control widths removed on Records/Statements/Allocator/pending/duplicates. Test: tables.e2e.ts 'filter controls keep one shared width...' (new). Screenshot: review/35-statements-filters-1440.png. Verified: bun types:check clean; biome clean; tests/core/{charts,tables}.e2e.ts 38+36 passed desktop+mobile (dev servers); sheets.e2e.ts 30 passed, 2 failed (pending queue Back test expects query=Dense+pending+1 but URL is %20; code untouched by this ticket, not confirmed on main). Look for: all filters same width, Records and Statements aligned.
