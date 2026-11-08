> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 33 Drill-down opens as side peek, center peek or full page (user picks)

Status: resolved
Blocked by: —
Spec: ../spec.md §6 (amend it)

## Why (user, 2026-11-08)
The docked panel pushes the Dashboard cards sideways every time it opens; hard to use on desktop. User wants Notion-style peek: the user chooses how a drill opens.

## What
- Remove the docked two-track grid in app/(month)/page.tsx. The Dashboard never reflows when a drill opens.
- Three modes, chosen from a small switcher in the drill header (Notion's "open as" icons + tooltips):
  1. **Side peek** (default): overlay sheet from the right over a dimmed Dashboard, ~480px, Esc/outside click closes.
  2. **Center peek**: centered dialog, max ~720px wide, scrolls inside.
  3. **Full page**: own route (add to src/routes.ts) with the same drill URL params, back link returns to the Dashboard with scroll and focus restored.
- Choice persists across reloads in IndexedDB settings (via src/logic, Dexie version bump only if a schema change is needed — the settings table is key/value, so probably not).
- Phones (<768px) keep the bottom sheet; full page still allowed there.
- URL drill state (, ) unchanged so links stay shareable. Motion from src/lib/motion.ts; reduced motion = fades.
- Document: CONTEXT.md term if needed, ADR for replacing the dock, README.

## Acceptance
- [ ] Opening/closing a drill moves no Dashboard card (assert card boxes before/after in e2e).
- [ ] All three modes work, switch live, persist after reload.
- [ ] Esc / Back restores scroll and focus in every mode.
- [ ] Existing drilldown e2e green (edit only tests whose behaviour changed; name them).

## Comments
- bun test tests/domain: 188 pass (new tests/domain/drill-mode.test.ts, 5 tests). bun types:check clean. biome check --write clean on touched files.
- NOT verified in a browser: machine load average 45+ made `next build` (killed at 15 min) and the dev server's first compile of `/` (30+ min) never finish, so the e2e files (core drilldown desktop+mobile, animations drilldown) and screenshots did not run. A first dev run failed all 12 tests that started at ~50s each, the 45s test timeout, including ones I did not touch, which is the cold-compile symptom and not an assertion failure.
- Edited tests (behaviour changed on purpose): core "day drill-down" (panel is now a dialog in every mode; the docked retarget-by-hover block became an Escape-and-focus check); animations "docking animates the main column width" replaced by "the side peek slides over a Dashboard that never reflows". Added: no card moves, three modes switch live and persist, Escape/Back restore scroll and focus.
- Look for: side peek over a dimmed Dashboard that does not move, the Open as menu (side/center/full), full page Back to Dashboard returning to the same scroll with the opener focused.
- Update after a quiet machine: commits 265fe6d, ab4420f (focus returns to the drill title after picking a mode; test hardening), 6aa41da (browser Back from the full page now restores scroll and focus: the return marker is flagged when the full page unmounts toward the Dashboard). Production build; `tests/core/drilldown.e2e.ts` desktop+mobile all green, `tests/animations/drilldown.e2e.ts` 6 pass.
- Screenshots: .scratch/insight-drilldown/review/33-*.png (side peek, Open as menu, center peek, full page, mobile full page/menu/bottom sheet).
- Look for: the 15px strip to the right of the side peek is the page's reserved scrollbar gutter (same for every Sheet in the app).
