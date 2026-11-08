> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 09 terms and copy

Status: resolved
Phase: P1
Blocked by: —
Spec: ../spec.md

## What

**Term definitions** plus copy pass (F7, F13a) and the `CONTEXT.md` additions (D5).

## Acceptance

- [x] Term definitions (`Term` component) on Pending, Allocation, Effective spending, Left over.
- [x] Copy pass for F7 and F13a.
- [x] `CONTEXT.md` gains every new term used in the UI.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Verification (final): `bun test` rerun: 170 pass, 0 fail. `bun lint`, `bun lint:check`, `bun types:check`, `bun run build`: pass. Core scope: editors/navigation/routes/workflows/sheets on desktop and mobile; 33/36 pass in broad scoped run, then all 10 corrected navigation/term/redirect cases pass on recheck (covering the three failures). Cold dev routes took 21 seconds to compile; recheck precompiled them. Earlier overlapping runners caused trace-file collisions; final runs were sequential.
Open verification: animation files routes/tables, desktop+mobile, workers=1: 2 card-grid cases pass; 4 table cases fail. Dense Record samples are undersampled; related Record/Statement cases still select the tables replaced by Allocation rows in ticket 03. Assertions retained. Ledger exports pass; ledger files fails because earlier tickets have not registered allocation-progress, allocation-rows, largest-records and drill/panel. This task registers its own moved pages, renamed tabs and Term. Not classified as flaky; no main comparison claimed.
Graph: structural refresh plus host semantic extraction of README/CONTEXT; 1,988 nodes, 7,946 edges, zero dangling edges. Warnings remain: 120 isolated nodes, 16 symbol-free code files, hub-derived community labels. All four tracked graph artifacts included; caches/HTML remain local.
Evidence logs: review/18-09-{domain,core,core-recheck,ledger,build,graph}.log and review/18-animations.log. Status remains claimed because full done-definition is not green.
Edited tests: core/routes adds “term definitions open by keyboard and tap”, and updates the existing sparkline selector to ticket 08’s intentional Spent label while retaining coordinate and month-change assertions. core/editors updates the intentional ticket 05 label New Monthly Budget in the popup sweep, Monthly Budget creation, long Unicode creator content and colour-choice cases. Component inventory maps Term output and keyboard/tap/Escape behaviour to the new test. Initial new-term case ran red before implementation; the final desktop/mobile cases pass.
Copy: forecast instruction uses separate readable sentences; README reflects current charts, Allocate and Statement cleanup. CONTEXT adds Effective spending, Left over, Unbudgeted, Pace, Irregular, Money out / Money in and Allocate (Drill-down already existed).
Screenshots: review/09-terms-desktop.png, review/09-terms-mobile.png (production build, dark, demo workspace, 1440/390 CSS widths).
Look for: dotted-underlined Financial terms above the summary, with a plain definition and money example on hover, focus or tap.

Final signed commit: 5ea8bab. Pushed to origin/ai/insight-drilldown. Shared final graph refresh is included in immediately preceding 7489483 and covers the complete batch.

### Verification closure, 2026-11-07

Calendar month-length case unchanged: branch sequential run 2 passed / 0 failed (desktop + mobile), origin/main `3609d85` temporary detached worktree run 2 passed / 0 failed. Four month lengths per case. Earlier branch attempt had a trace-file collision from overlapping runners (1 passed, 1 infrastructure failure); sequential rerun above is clean. Historical day-selection failure not reproduced; no flaky classification or calendar code change. Temporary baseline worktree removed.

Animation tests edited: `table rows: Account Statements, Record Statements, Statement Records, duplicate groups, separate pairs and replacement candidates enter as a cascade in the viewport` now samples shared Allocation groups and asserts their fade plus identity transforms. `table rows: Records, Statements, Monthly Records, future Monthly Records, pending queue and Allocate enter as a cascade in the viewport` uses the sampler fix: settling waits until each visible row has three frames, retaining opacity/order/final-pose assertions. No assertion thresholds loosened. Both desktop table cases pass on final recheck; both mobile table cases pass. Card grids pass at both widths. Two existing cascade fault-probe tests pass and still reject cutoff, late batch, reverse, flash and simultaneous-tail faults.

New test: `drill sheet: entrance and exit retain popup motion` passes desktop/mobile/reduced-motion (3/3). It exposed immediate unmount on close; the panel now retains the Radix sheet through its exit. Ledger registrations added for AllocationProgress, AllocationRows/Expansion, LargestRecords and DrillPanel; stale route/test IDs updated; removed donut motion marked inapplicable with its source rationale. Entire ledger: 10 passed.

`bun test`: 170 passed / 0 failed before ticket 10's separate red test. `bun lint`, `bun lint:check`, `bun types:check`, `bun run types:e2e`: passed. Logs: review/close-*.log. Prior screenshots remain applicable for unchanged 02/09/18 UI; new drill lifecycle screenshots recorded below.

Final verification: production build passed; day drill core 2/2; sheet lifecycle 3/3; full ledger 10/10. Production dark screenshots: review/close-drill-{desktop,mobile}.png (1440/390 CSS widths). Look for: the same readable drill contents at both widths, with the sheet sliding away before removal. Graph refresh completed after verification; existing extractor warnings (16 symbol-free files, hub-derived community labels) remain; no refresh failure.

Closure signed commit: `34c6cc0bb1911b72ac2e27457c81863ed5e80efd` (signature G), pushed to origin/ai/insight-drilldown.
