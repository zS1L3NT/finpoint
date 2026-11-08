> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 00 prototype

Status: resolved
Phase: P0
Blocked by: —
Spec: ../spec.md

## What

**Prototype** the docked drill-down (D1) and the mobile sheet: retarget, Record row expand to Statements, pivot with breadcrumb, new dashboard order. Throwaway, on a `prototype/drilldown-panel` branch, no PR. Output: the user previews it and answers D8 plus any layout notes.

## Acceptance

- [ ] Prototype on `ai/drilldown-prototype`, pushed, no PR; screenshots in `../prototype/`; user previews it.
- [ ] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

- 2026-11-07: `ai/drilldown-prototype` @ 5accc9a, pushed, no PR. Totals matched (Nov 1 $122.29, Nov 2 $31.80, Nov 3 $132.43, Groceries $307.07, Dining Out $127.70). Screenshots in ../prototype/.
- Opus review notes for 01/06 (carry into the real build): main column width snaps (needs a width transition with SPRING.smooth); panel row amounts show "-$83.84" for spending: drop the minus inside a spending drill-down; the panel title block wastes height ("Drill-down" eyebrow + title + separate total) — merge title and total; Record row chevron ">" vs "v" mixes expand and navigate: use one chevron-down for expand and a trailing arrow only on the Statement pivot row; mobile sheet 85dvh fixed, decide D8 after user preview.
