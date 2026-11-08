> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 23 mobile sheet polish + flaky drill test

Status: resolved
Blocked by: 15
Spec: ../spec.md · Screenshots: ../review/15-sheet-{half,full}-branch-{dark,light}-390.png

## Opus findings

1. **degraded** — sheet list shows the native scrollbar with arrow buttons (15-sheet-*-390). Use the app's thin/overlay scrollbar style (or hide it on touch) like other scroll areas.
2. **degraded** — half detent shows only ~2 rows: header + metadata + padding take ~45% of the sheet. Tighten header padding at half detent (smaller gap between title, total and meta line; meta can clamp to 1 line) so ≥3 rows show at 390×844.
3. **degraded** — spec §6.3: scrim only at full detent. At half the page behind should stay readable (no dim) and scrollable is NOT required. Add an overlay/scrim prop to the sheet wrapper rather than changing `src/components/ui/sheet` semantics for other callers (wrapping/className overrides are fine; ui/** is shadcn and lint-ignored but may be edited minimally if needed).
4. **polish** — pending rows at 390 (Sheng Siong Top-up): title wraps and the amount column with "$0.00 of $92.73 allocated" squeezes the meta. Let the allocated caption sit under the amount in a narrower font or drop to the meta line on narrow widths.
5. **flaky test** — tests/core/drilldown.e2e.ts desktop "category, trend and budget selections retain the Dashboard and reconcile their visible amounts": fails ~1–2/10 on the branch. Diagnose the race (likely chart re-measure/animation or URL update timing) and fix the cause (app or test wait on a real condition — no arbitrary sleeps, no retries). Prove with 20/20 repeats (`--repeat-each=20`).

## Acceptance
- [x] 1–5 fixed; screenshots review/23-sheet-{half,full}-branch-{dark,light}-390.png.
- [x] Spec §12 done-definition.

## Comments

Implementation: keep the existing sheet surface, icons and grab handle; hide the mobile list scrollbar, compact half-detent padding and metadata, and wrap pending allocation captions in a fixed-width mobile amount column. SheetContent accepts an optional overlayClassName; only this caller clears its half-detent scrim. Desktop classes and existing motion/reduced-motion presets remain unchanged.

Race evidence: original desktop repeat run 18/20 (two failures waiting for $306.63 after the trend URL updated). Closing a panel is asynchronous; the test now waits for drill-total to leave the DOM before the next selection. No sleeps, retries, removed assertions or changed expected totals. Corrected desktop repeat run: 20/20. The test/feature does not exist on main (`git cat-file -e main:tests/core/drilldown.e2e.ts` fails), so the matching main repeat cannot run.

Edited tests in tests/core/drilldown.e2e.ts:
- “category, trend and budget selections retain the Dashboard and reconcile their visible amounts”: wait for completed close before making the next selection.
- “mobile sheet toggles between two detents with the grab handle and closes with Escape”: assert transparent half backdrop and painted full backdrop, intentionally changed behaviour.

Verification so far: bun test (isolated rerun) 179 passed, 0 failed; bun lint (write-mode), bun lint:check and bun types:check passed; bun run build passed. Initial domain run overlapped browser/build CPU work and timed out in the 120-second category reconciliation test, causing its unfinished work to interfere with the next test; unchanged tests passed when rerun alone (that test took 73.7 seconds). Production core file: 17 passed, 1 intentional desktop skip; final rerun and motion checks recorded below.

Screenshots: production next start on port 5180, npx -y agent-browser@0.27.0 session t23, clicked Try demo data, October 2026, calendar day 3 (and day 6 for pending/desktop). Opened and inspected every image:
- review/23-sheet-half-branch-dark-390.png
- review/23-sheet-full-branch-dark-390.png
- review/23-sheet-half-branch-light-390.png
- review/23-sheet-full-branch-light-390.png
- review/23-panel-branch-dark-1440.png
- review/23-pending-branch-dark-390.png (extra evidence for Sheng Siong Top-up)

Look for: three complete rows at half height, a clear half backdrop and dimmed full backdrop in both themes, no native list scrollbar, readable Sheng Siong pending title/caption, and the unchanged desktop panel.

Final evidence: production core rerun 17 passed / 1 intentional skip; production motion file (desktop, mobile, reduced-motion, workers=1) 6 passed. Final graphify update . completed after verification; README semantic extraction refreshed inline per graphify --update and manifest stamped, with all four required graph artifacts committed. Health warnings: 17 code files without extractable symbols, 129 isolated symbols and 18 thin communities; no refresh failure. Screenshot server PID 1705177 killed, agent-browser t23 closed, Playwright-owned servers exited; no servers remain.

Signed commits: 9417f2a (flake wait), 5a8148c (mobile polish, behaviour assertions, docs, graph). Pushed origin ai/insight-drilldown. No tests other than the two named above were edited. No PR, merge, rebase or force push.
