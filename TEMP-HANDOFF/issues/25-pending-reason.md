> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 25 pending reason is not stated, and its caption repeats

Status: resolved
Blocked by: —
Spec: ../spec.md §5.3, §11 ("Why is this Record pending?" target 0 steps) · Evidence: ../review/19-g6-pending-reason-duplicated.png

**Severity: degraded**

## Evidence

Day drill 3 Oct, Gojek Ride (Pending). The closed row shows a Pending chip and "$0.00 of $19.23 allocated" but no reason. Expanded, the body reads "$0.00 of $19.23 allocated" (again), "No Statements allocated yet." **twice**, then "$19.23 remaining to allocate". §5.3 calls for a reason in the row itself ("No Statement yet", "$7.28 not allocated yet", "Statement not confirmed yet"). Result: 0-step target becomes 1 step with duplicated copy; a reader must infer the reason. A refund turned from a spend (see 29) is also Pending with "$34.72 of $34.72 allocated" and no explanation at all.

## Fix

`src/components/drill/panel.tsx` row meta and `src/components/allocation-rows.tsx`: add a `pendingReason` (from `src/logic/drilldown.ts`, one of the three §5.3 strings, plus "Amounts have opposite signs" for a sign mismatch) and render it as a muted line under the date/category line in the closed row. In `allocation-rows.tsx` render "No Statements allocated yet." once and drop the duplicate "$x of $y allocated" line inside the expanded body.

## Acceptance

- [x] Every Pending row in the panel shows its reason without expanding.
- [x] Expanded body has no repeated sentence or repeated allocated line.
- [x] Domain test for each reason string in `tests/domain/`.
- [x] §11 "Why is this Record pending?" measures 0 steps.

## Comments

Closed Drill-down rows now state the pending reason from domain logic; opposite signs have explicit copy. Expanded allocations omit the already-visible summary and show the empty sentence once. README documents the four reasons.

TDD: pending-reason tests red (2 failed), then green. bun test standalone: 180 passed. The initial overlapping build/browser/domain run hit the unchanged 120s category reconciliation timeout and a subsequent database interference error; standalone rerun completed that case in 61s and the full suite in 121s. Not classified flaky. bun lint, bun lint:check, bun types:check, bun run build passed. PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts tests/core/tables.e2e.ts --project=desktop --project=mobile: 47 passed, 1 desktop skip.

Edited tests: domain “pending reason explains confirmation and allocation differences” updates intentional copy; added opposite-sign case. Records table “rendered Records keep zero, negative amounts and pending reasons” updates the intentional tooltip copy to $35.00 not allocated yet. Added “Pending drill rows explain their reason before expanding without duplicate captions”; existing drill assertions retained.

Production October 2026 demo screenshots opened: review/25-pending-branch-{dark,light}-{1440,390}.png. graphify update . plus README semantic refresh/clustering passed (symbol-free config/test warning only).

Look for: No Statement yet under Gojek Ride without expanding, and one empty-allocation sentence in the expanded body, with no repeated $0 of $19.23 caption.

Signed commit: 6d60397; pushed origin ai/insight-drilldown. Server killed by PID; browser closed.

Graph health review (supplement): this commit’s report lists 124 degree-0/1 nodes (graphify labels them isolated) and 16 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
