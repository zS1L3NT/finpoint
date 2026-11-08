> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 17 retire monthly records

Status: resolved
Phase: P3
Blocked by: 04, 05, 12
Spec: ../spec.md

## What

**Retire the Monthly Records tab:** month navigation on Records, redirect with params, shell without tabs (D6).

## Acceptance

- [x] Records page has month navigation.
- [x] `/records/monthly` redirects to `/records` keeping params.
- [x] The `(month)` shell no longer shows tabs; sidebar active states updated.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation: one Records ledger with optional month/year navigation and legacy day filtering. Next redirects preserve every query parameter; Dashboard keeps its existing heading and calendar controls, with the tab strip removed. Sidebar highlights Records at the redirected destination. Internal pending/future Record links now go directly to Records. Documentation and coverage inventory updated; no browser test file was deleted, so CI groups do not change.

Conservative choices: Records remains all-time without month/year; selecting a month clears day/date-range/page while retaining the remaining filters. Explicit date filters intersect the selected month. Legacy day URLs retain their day restriction. No shared helper was converted into a hook.

TDD: new domain test “Records month filter includes full month and intersects date filters” failed because all four boundary Records were returned before month filtering; now passes, including legacy day coverage.

Edited/removed test behaviour:
- tests/core/routes.e2e.ts: “monthly shell: header and tabs keep DOM identity across tab switches” replaced by “monthly shell: header keeps DOM identity across month changes without tabs”; new “Monthly Records redirect preserves every filter and Records month navigation”. “empty pages: Records, Statements, Accounts, Categories, Budgets and monthly views resolve to useful copy” and “monthly headers: hydrate with a browser date different from the server” now assert the replacement Records page (level-two heading). Legacy route title map now expects Records.
- tests/core/navigation.e2e.ts: “history clearing: cancelled links, sidebar, tabs and chart drills clear or preserve history” removes only the deleted month-tab click; its sidebar/history assertions remain.
- tests/core/tables.e2e.ts: “Records lists: later and future Records keep amounts and drills, long Record values survive reload” retains future Record amounts and working keyboard drills via the legacy URL, removing only the retired page's Later this month section/copy assertions.
- tests/core/editors.e2e.ts: “Monthly Records editor: saved title appears immediately and survives reload” renamed “Records month editor via legacy URL: saved title appears immediately and survives reload”; assertions unchanged.
- tests/animations/tables.e2e.ts: “table rows: Records, Statements, Monthly Records, future Monthly Records, pending queue and Allocate enter as a cascade in the viewport” removes the two retired tab consumers; replacement Records uses the existing Records cascade case. No thresholds changed.
- tests/component-inventory.ts: removes deleted page mappings, retains Records row-motion coverage and maps the replacement navigation/data tests.

Verification so far: bun test rerun 179 pass / 0 fail (initial concurrent-build run hit a reconciliation timeout; isolated reconciliation rerun also passes). bun lint, bun lint:check, bun types:check, bun run types:e2e, bun run build pass. Production core run (four touched files, desktop+mobile, --workers=3): 183 passed, one skipped, five failures; the ambiguous heading locator is fixed and is being rechecked. Remaining failures are unchanged assertions in Record creator (expects signed -12.34, while ticket 18's editor displays magnitude 12.34) and monthly chart history (looks for the Categories this month chart removed before ticket 17), at both widths. These assertions are preserved under the regression rule; no claim of flakiness. Ticket stays claimed until required verification is green.

Look for: a balanced Dashboard month heading and calendar controls without tabs; unchanged colours/icons; old Monthly Records links opening Records with the selected month and filters and the Records sidebar item active.

Final verification: full routes file passes on both widths (70 route cases; combined routes/ledger run was 80 pass with only the subsequently fixed inventory check failing). Final standalone ledger: 10/10 pass. Scoped replacement row-cascade animation: 2/2 pass, desktop/mobile, workers=1, PLAYWRIGHT_ANIMATIONS=1, PLAYWRIGHT_SERVER=production. Final lint:check, types:check and types:e2e pass. All modified behaviour tests pass. Required whole-file core verification remains red for the two preserved tests listed above, so Status remains claimed in accordance with brief step 9.

Screenshots (production, agent-browser@0.27.0, clicked Try demo data, October 2026, all five opened and reviewed): review/17-dashboard-branch-dark-1440.png, review/17-dashboard-branch-dark-390.png, review/17-dashboard-branch-light-1440.png, review/17-dashboard-branch-light-390.png, review/17-redirect-branch-dark-1440.png. Exact viewport sizes 1440×900 and 390×844. Screenshot server used port 5180 and was stopped by PID; browser sessions closed.

Graph: graphify update . completed after final source/test edits and checks; changed AGENTS/CONTEXT/README concepts refreshed inline, preserving existing relationships, without an API key. All four required graph artifacts included. Health: zero dangling/missing endpoints or collapsed directed edges; four self-loop edges remain. Extraction warns about 17 files with no symbols and nine unclassified files; no refresh failure. Report uses portable Finpoint title, no machine path. Detailed output retained in review/17-verification.txt.

Signed implementation commit: `93dfcb1804a7c333cab1744dc9cd82b53c62d98b` (♻️🤖 retire monthly records tab and preserve legacy links [skip ci]). Pushed to origin/ai/insight-drilldown. No PR opened; no merge/rebase/force-push. Working tree clean; next-env.d.ts never staged.

## Resolution (follow-up agent)

Both failures were stale tests, not app bugs (record-editor.tsx shows Money out/Money in with a magnitude Amount; the Dashboard chart opens the drill-down via buttons, and Records Back label is the month name).
- tests/core/editors.e2e.ts "Record creator: validates required fields, applies Category defaults and persists values": amounts "-12.34" -> "12.34" (editor defaults to Money out, so same stored -12.34); all assertions (validation, defaults, mismatch warning toggle, reload persistence) kept.
- tests/core/navigation.e2e.ts "monthly shell: browser Back removes self-target and Forward restores its chart origin" (the chart-history test): chart is now clicked as a button, opens drill-down, then "Open in Records"; origin is the Dashboard URL with `drill=`; Back label is "Back to October 2026". Same Back/Forward/no-Back assertions.
Verification: production build; editors+navigation, desktop+mobile: 89 passed, 1 skipped (a first full run had 3 mobile editors failures under load that passed in isolation and in the final full run). lint:check, types:check, types:e2e pass; graphify update done.
