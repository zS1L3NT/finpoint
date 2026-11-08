> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 18 allocate rename and statement tabs

Status: resolved
Phase: P2
Blocked by: —
Spec: ../spec.md

## What

**Money out / Money in** in the Record editor (F17), the sidebar rename "Allocate", and moving Duplicates and Replace pending under Statements with redirects (D7, §13.1).

## Acceptance

- [x] Record editor uses Money out / Money in instead of a signed amount (F17).
- [x] Sidebar and page title read "Allocate".
- [x] Duplicates and Replace pending become Statements tabs (`/statements/pending`, `/statements/duplicates`) with redirects from `/allocator/*` (spec §13.1).
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation complete; verification in progress. Build, lint and types pass. Core browser run: navigation, routes, editors, workflows and sheets on desktop/mobile. Initial domain run: 169 pass, one reconciliation timeout under concurrent compilation; rerunning. Edited tests: core/{routes,navigation,editors,sheets}, animations/{routes,tables}, reflecting intentional navigation and amount-input changes. Screenshots: review/18-statements-{desktop,mobile}.png.
Look for: Allocate stands alone; Statement cleanup appears in Statements tabs at both widths.

Verification (final): `bun test` rerun: 170 pass, 0 fail. `bun lint`, `bun lint:check`, `bun types:check`, `bun run build`: pass. Core scope: editors/navigation/routes/workflows/sheets on desktop and mobile; 33/36 pass in broad scoped run, then all 10 corrected navigation/term/redirect cases pass on recheck (covering the three failures). Cold dev routes took 21 seconds to compile; recheck precompiled them. Earlier overlapping runners caused trace-file collisions; final runs were sequential.
Open verification: animation files routes/tables, desktop+mobile, workers=1: 2 card-grid cases pass; 4 table cases fail. Dense Record samples are undersampled; related Record/Statement cases still select the tables replaced by Allocation rows in ticket 03. Assertions retained. Ledger exports pass; ledger files fails because earlier tickets have not registered allocation-progress, allocation-rows, largest-records and drill/panel. This task registers its own moved pages, renamed tabs and Term. Not classified as flaky; no main comparison claimed.
Graph: structural refresh plus host semantic extraction of README/CONTEXT; 1,988 nodes, 7,946 edges, zero dangling edges. Warnings remain: 120 isolated nodes, 16 symbol-free code files, hub-derived community labels. All four tracked graph artifacts included; caches/HTML remain local.
Evidence logs: review/18-09-{domain,core,core-recheck,ledger,build,graph}.log and review/18-animations.log. Status remains claimed because full done-definition is not green.
Edited tests: core/routes (Statement tabs, Allocate default-filter navigation, title/empty-state expectations); core/navigation (Statement tab history plus a new filter-preserving redirect case); core/editors (Record editor positive input and Money in control); core/sheets (Allocate heading); animations/routes and animations/tables (renamed navigation targets). Component inventory follows the moved pages and tabs. No tests were loosened or skipped.
Screenshots: review/18-statements-desktop.png, review/18-statements-mobile.png, review/18-money-direction-desktop.png, review/18-money-direction-mobile.png (production build, dark, demo workspace, 1440/390 CSS widths).
Look for: a positive amount beside Money out / Money in, Allocate in the sidebar, and Statements → Replace pending → Duplicates tabs.
Initial implementation SHA: afae7a8.

Final signed commits: afae7a8 (implementation), 7489483 (history/config redirects and route inventory follow-up). Both pushed to origin/ai/insight-drilldown.

### Verification closure, 2026-11-07

Calendar month-length case unchanged: branch sequential run 2 passed / 0 failed (desktop + mobile), origin/main `3609d85` temporary detached worktree run 2 passed / 0 failed. Four month lengths per case. Earlier branch attempt had a trace-file collision from overlapping runners (1 passed, 1 infrastructure failure); sequential rerun above is clean. Historical day-selection failure not reproduced; no flaky classification or calendar code change. Temporary baseline worktree removed.

Animation tests edited: `table rows: Account Statements, Record Statements, Statement Records, duplicate groups, separate pairs and replacement candidates enter as a cascade in the viewport` now samples shared Allocation groups and asserts their fade plus identity transforms. `table rows: Records, Statements, Monthly Records, future Monthly Records, pending queue and Allocate enter as a cascade in the viewport` uses the sampler fix: settling waits until each visible row has three frames, retaining opacity/order/final-pose assertions. No assertion thresholds loosened. Both desktop table cases pass on final recheck; both mobile table cases pass. Card grids pass at both widths. Two existing cascade fault-probe tests pass and still reject cutoff, late batch, reverse, flash and simultaneous-tail faults.

New test: `drill sheet: entrance and exit retain popup motion` passes desktop/mobile/reduced-motion (3/3). It exposed immediate unmount on close; the panel now retains the Radix sheet through its exit. Ledger registrations added for AllocationProgress, AllocationRows/Expansion, LargestRecords and DrillPanel; stale route/test IDs updated; removed donut motion marked inapplicable with its source rationale. Entire ledger: 10 passed.

`bun test`: 170 passed / 0 failed before ticket 10's separate red test. `bun lint`, `bun lint:check`, `bun types:check`, `bun run types:e2e`: passed. Logs: review/close-*.log. Prior screenshots remain applicable for unchanged 02/09/18 UI; new drill lifecycle screenshots recorded below.

Final verification: production build passed; day drill core 2/2; sheet lifecycle 3/3; full ledger 10/10. Production dark screenshots: review/close-drill-{desktop,mobile}.png (1440/390 CSS widths). Look for: the same readable drill contents at both widths, with the sheet sliding away before removal. Graph refresh completed after verification; existing extractor warnings (16 symbol-free files, hub-derived community labels) remain; no refresh failure.

Closure signed commit: `34c6cc0bb1911b72ac2e27457c81863ed5e80efd` (signature G), pushed to origin/ai/insight-drilldown.
