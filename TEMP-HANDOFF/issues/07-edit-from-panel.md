> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 07 edit from panel

Status: resolved
Phase: P1
Blocked by: 06
Spec: ../spec.md

## What

**Edit from the panel:** open the Record editor, live total update, return focus. "Allocate…" deep link.

## Acceptance

- [x] Records in the panel open the Record editor; saving updates the panel total live; focus returns to the row.
- [x] Unallocated rows have an "Allocate…" action deep-linking to the Allocator with ids prefilled.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation: signed commit 548b6d6 (subject to final SHA below). Existing Record editor reused; live query updates totals; Escape stays in editor; focus returns to Edit Record, or the panel heading if the row disappears. Statement remainder offers Allocate…; statement_ids preselects allocable Statements in Allocator.
Edited tests: tests/core/drilldown.e2e.ts, new “edit from drill returns focus and updates the live total” (cancel and save, +$1 total). Desktop and mobile passed in /tmp/fin-core-final.log. No existing test changed.
Verification: bun lint, bun lint:check, bun types:check and bun run build passed. bun test rerun: 169 pass; subsequent final suite including ticket 12: 170 pass. Initial concurrent run timed out in existing category reconciliation; rerun passed. No flaky classification.
Screenshots: review/07-edit-desktop.png (1440), review/07-edit-mobile.png (390), production port 5180, demo data, Dark selected. Look for: the Record editor over the retained drill-down and readable mobile form.
Open verification: initial full core run had forecast tooltip and focus failures; follow-up verification recorded below. Initial animation run: 2 passed, 1 failed (desktop pivot Back negative displacement). Tests retained unchanged. Graph code refreshed; semantic document refresh pending, graph health has 4 self-loops, no dangling/missing endpoints.

Final verification: functional full run /tmp/fin-core-verified.log passed 9/10, with the earlier desktop focus assertion failing before the final guard. Focus correction then passed unchanged day-drill tests on desktop and mobile (2/2, /tmp/fin-focus-final.log). Category/forecast, edit save/live-total/focus, pivot and Largest Records/handoff cases passed both sizes. Final animation run /tmp/fin-anim-final.log: 3/3 passed. No existing test assertions edited or loosened. Final lint:check and types:check clean. Earlier failures are retained above as evidence; no flaky classification made. Semantic README/ADR refresh completed; graph health warning remains four self-loops, no missing/dangling/collapsed edges.

Final signed commit: 548b6d6. Both commits pushed to origin ai/insight-drilldown. Review images remain local under .scratch/insight-drilldown/review/. Production server stopped by PID.
