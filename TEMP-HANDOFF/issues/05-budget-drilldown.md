> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 05 budget drilldown

Status: resolved
Phase: P1
Blocked by: 01
Spec: ../spec.md

## What

**Budget drill-down:** budget rows and forecast legend. Donut removed. "Show the dashboard for…" action. "New Monthly Budget" label.

## Acceptance

- [x] A Monthly Budget card opens its drill-down (D2); "Show the dashboard for <budget>" action inside re-scopes.
- [x] Donut removed; forecast legend entries drill.
- [x] Create button reads "New Monthly Budget".
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation: removed donut and its dead arc/formatting helpers; kept one card row per Monthly Budget with a progress bar, plan/remaining amounts and separate Edit. Cards and forecast legend buttons use onDrill. Budget panels show the plan, final total and explicit “Show the dashboard for … only” action. Forecast Total and Unbudgeted selections reconcile too. Create label is New Monthly Budget. README and URL ADR document the behaviour.
Verification: `bun test` — 168 pass, 0 fail (2,219 assertions); `bun lint`, `bun lint:check`, `bun types:check` pass. Budget test first failed on absent plan metadata; extended forecast test caught the Unbudgeted filter and passed after its correction.
Edited tests: domain “Monthly Budget cards and legend reconcile including refunds and plan amounts”; core “Monthly Budget cards: drill first, scope explicitly and edit independently” replaces donut-selection coverage, “chart tooltips: keyboard sweeps expose actual numeric values” and “Spending forecast: preserves scope and legend semantics” now require interactive legend buttons. Summary reconciliation explicitly scopes through the panel and waits for the URL before closing. Removed animation “Monthly Budget donut: focus dims sibling segments in a smooth transition” because the donut is removed. Added shared core “category, trend and budget selections retain the Dashboard and reconcile their visible amounts”.
Look for: budget rows show progress and amounts without a donut; the panel shows the same total and keeps re-scoping a separate action, on both screen sizes.

Final checks: scoped core cases pass on desktop/mobile after intentional assertion updates; chart and drill-down animations pass 13/13 with one worker (including reduced motion); production build passes. The final category layout recheck passed 5 with one mobile-only layout skip, and the forecast callback check passed 2/2. `bun lint:check` and `bun types:check` are clean. Graph refresh completed, including semantic README/ADR concepts and all four tracked outputs. Health: no missing/dangling/collapsed edges; four pre-existing self-loops remain (also present in ticket 04's graph). Sixteen symbol-free source/test files are reported by the extractor; no refresh failure. Servers stopped by PID.

Final screenshots (production, demo data, dark): review/05-budget-desktop.png (1440), review/05-budget-mobile.png (390). Forecast days now also use the page-owned onDrill callback; its keyboard test waits for each readout before selecting the day. Expanded trend Other members use separate category buttons so child amounts never open the grouped total. Demo reconciliation tests pin the clock to November 2026.

Final signed commit: 30170e2. `git push origin ai/insight-drilldown` succeeded (remote advanced from 8efe6d5 to 30170e2, including ticket 04's 720fabd). Both signatures verify (`git log -2 --format='%h %G? %s'`: G). Working tree clean; no servers left running. Final production build and expanded trend row layout checks passed after the child-row correction.
