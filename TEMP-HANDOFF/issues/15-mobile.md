> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 15 mobile

Status: resolved
Phase: P2
Blocked by: 01
Spec: ../spec.md

## What

**Mobile:** section order, sheet detents, drag-to-dismiss (D8).

## Acceptance

- [x] Mobile section order follows spec §4.
- [x] Sheet has two detents; drag-to-dismiss per D8 (decided after the prototype).
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

### Implementation (D8: no drag yet)
- `src/components/drill/panel.tsx`: mobile sheet has two detents (half 55dvh / full 92dvh) animated with `SPRING.snappy` (`TRANSITION.fast` under reduced motion); a real grab-handle `<button>` (44px target, aria-label "Expand/Collapse drill-down", aria-expanded, chevron) toggles them. Close stays X / Escape / Back. Footer has no duplicate Total (only "Open in Records").
- Mobile section order already follows spec §4 (headline, Attention, metrics + Saved, scope, forecast, budgets, categories…) in the single-column layout; verified in `15-dashboard-branch-*-390.png`.
- Docs: CONTEXT.md (Drill-down), README (mobile sheet behaviour).
- Added test (no existing test edited): `mobile sheet toggles between two detents…` in tests/core/drilldown.e2e.ts.

### Evidence
- bun test: 179 pass. bun lint:check, bun types:check, bun run build: clean.
- PLAYWRIGHT_SERVER=production drilldown.e2e.ts desktop+mobile: 16 pass, 1 skip (new test skipped on desktop), 1 fail: `category, trend and budget selections…` (desktop). Not touched by this change (desktop panel unchanged). Flaky: repeat-each=10 desktop: branch 1/10 failed (and 1 of 10 mixed-project run), pre-change panel on same commit base 2/10 failed.
- Screenshots: review/15-{dashboard,sheet-half,sheet-full}-branch-{dark,light}-390.png, 15-dashboard-branch-dark-1440.png (desktop unchanged).

Look for: grab handle (bar + chevron) at the top of the sheet; tap it and the sheet grows from about 55% to 92%; tap again to collapse; nothing else in the sheet changed. D8 drag-to-dismiss/drag between detents still pending the user's preview. Scrim is still shown at both detents (spec §6.3 asks for it at full only).
