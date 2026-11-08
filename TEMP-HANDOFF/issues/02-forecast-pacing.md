> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 02 forecast pacing

Status: resolved
Phase: P0
Blocked by: —
Spec: ../spec.md

## What

**Pacing model** (§7.4) plus forecast line copy, with domain tests.

## Acceptance

- [x] Projection follows spec §7.4 option A, fallback B, using `COMPARISON_MONTHS`.
- [x] Domain tests: day-1 rent no history; rent with 2 months history; mid-month big purchase; future month; completed month.
- [x] Forecast line copy explains itself ("You usually spend $X more after the Nth").
- [x] ADR `docs/adr/0002-forecast-pacing.md` matches what shipped.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments


### Implementation handoff, 2026-11-07

Forecast implementation completed and signed commit created: `27cea32297f7e201b0a2ee1084e339d1fac703ba`.

- Retained the previous implementation; reused full historical comparisons once per pace view rather than recalculating them for every budget line. No shared API refactor.
- `bun test`: 163 passed, 0 failed (final run); seven new forecast tests cover all required scenarios, comparison exclusions/complete empty months, and total median reconciliation.
- `bun lint`, then `bun lint:check`, then `bun types:check`: passed after final source edits. `git diff --check`: passed.
- `bun run test:e2e -- tests/core/charts.e2e.ts --project=desktop --project=mobile --grep forecast`: 6 passed.
- `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/charts.e2e.ts --workers=1 --project=desktop --project=mobile`: 5 passed, desktop intro failed during route compilation. Unchanged desktop intro retry (`--project=desktop --grep 'chart intro'`): 1 passed.
- Full core command with the same file and both projects: 33 passed, 2 skipped, 3 failed. The populated-chart desktop/mobile navigation cases both passed unchanged on targeted retry. Calendar month-length navigation failed on desktop in the full run, then on both desktop and mobile in the targeted retry. This remains unresolved; tests were not edited. Do not interpret retries as a claim of flakiness (no main baseline run).
- An earlier full run was interrupted amid machine load 44 and full swap. Restarting this worktree's dev server restored responsiveness. Node's installed bin directory had to be added to PATH for npm. The relevant routes were exercised by browser tests; the dev server was stopped afterwards.
- `graphify update .`: completed, 1957 nodes / 7809 edges / 103 communities; included all four required tracked outputs. ADR already present in graph. Diagnostics: 4 self-loops; no missing/dangling endpoints or collapsed edges. Extractor warns 12 code files yield no symbols and skips 9 unclassified files. No refresh failure.
- Existing edited test: `forecast projections retain gross pace after refunds and add scheduled spending` renamed to `forecast projections use median pace after refunds and add scheduled spending` in `tests/domain/monthly-budgets.test.ts`. Deliberate formula change: five elapsed days have median zero; $80 actual plus $50 scheduled gives $130, replacing the old gross-average extrapolation ($230 / $650). No browser test edits.
- ADR records rejected option C and the day-one fallback limitation. No new domain terms.

**Unresolved done-definition:** calendar navigation test receives a different day than the selected last day. `src/components/charts/spending-calendar.tsx` gives hover preview precedence over selected day; pointer movement can change the strip/action. A fix requires investigating/changing that component, outside the user's strict staging list. Ticket remains claimed with the final acceptance box open rather than falsely setting resolved. Forecast-specific checks pass. No PR, merge, rebase, force-push, branch switch, or other worktree changes.

Push evidence: `git push -u origin ai/insight-drilldown` succeeded; signature verification `%G?` is `G`. Only `next-env.d.ts` remains modified outside the commit.

### Verification closure, 2026-11-07

Calendar month-length case unchanged: branch sequential run 2 passed / 0 failed (desktop + mobile), origin/main `3609d85` temporary detached worktree run 2 passed / 0 failed. Four month lengths per case. Earlier branch attempt had a trace-file collision from overlapping runners (1 passed, 1 infrastructure failure); sequential rerun above is clean. Historical day-selection failure not reproduced; no flaky classification or calendar code change. Temporary baseline worktree removed.

Animation tests edited: `table rows: Account Statements, Record Statements, Statement Records, duplicate groups, separate pairs and replacement candidates enter as a cascade in the viewport` now samples shared Allocation groups and asserts their fade plus identity transforms. `table rows: Records, Statements, Monthly Records, future Monthly Records, pending queue and Allocate enter as a cascade in the viewport` uses the sampler fix: settling waits until each visible row has three frames, retaining opacity/order/final-pose assertions. No assertion thresholds loosened. Both desktop table cases pass on final recheck; both mobile table cases pass. Card grids pass at both widths. Two existing cascade fault-probe tests pass and still reject cutoff, late batch, reverse, flash and simultaneous-tail faults.

New test: `drill sheet: entrance and exit retain popup motion` passes desktop/mobile/reduced-motion (3/3). It exposed immediate unmount on close; the panel now retains the Radix sheet through its exit. Ledger registrations added for AllocationProgress, AllocationRows/Expansion, LargestRecords and DrillPanel; stale route/test IDs updated; removed donut motion marked inapplicable with its source rationale. Entire ledger: 10 passed.

`bun test`: 170 passed / 0 failed before ticket 10's separate red test. `bun lint`, `bun lint:check`, `bun types:check`, `bun run types:e2e`: passed. Logs: review/close-*.log. Prior screenshots remain applicable for unchanged 02/09/18 UI; new drill lifecycle screenshots recorded below.

Final verification: production build passed; day drill core 2/2; sheet lifecycle 3/3; full ledger 10/10. Production dark screenshots: review/close-drill-{desktop,mobile}.png (1440/390 CSS widths). Look for: the same readable drill contents at both widths, with the sheet sliding away before removal. Graph refresh completed after verification; existing extractor warnings (16 symbol-free files, hub-derived community labels) remain; no refresh failure.

Closure signed commit: `34c6cc0bb1911b72ac2e27457c81863ed5e80efd` (signature G), pushed to origin/ai/insight-drilldown.
