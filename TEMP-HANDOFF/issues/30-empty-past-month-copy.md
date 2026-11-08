> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 30 empty past month contradicts itself

Status: resolved
Blocked by: —
Spec: ../spec.md F10 · Evidence: ../review/19-persona-empty-month-contradictory-copy.png

**Severity: polish**

## Evidence

January 2025: the banner says "Nothing recorded in January yet." and the headline says "You've spent $0.00. January is complete." ("yet" is wrong for a past month; two messages say the same thing.) Below them the page still renders every card, including an empty chart grid, so it is not the whole-page empty state F10 asked for. Future months (December 2026) are clean.

## Fix

`buildHeadline` in `src/logic/dashboard.ts` and the empty-banner in `app/(month)/page.tsx`: for a past month with no Records, show one message ("No Records in January 2025.") and hide the cards, with a single "Import statements" / "Add a Record" action.

## Acceptance

- [x] A past empty month shows one message and no empty chart.
- [x] Domain test on the headline for past-empty months.

## Comments

Past empty months show one dated headline and an Import statements action, with summary/chart cards hidden. Existing current/future-month behaviour remains. README documents it. buildHeadline accepts an optional empty-year label supplied only for a past month with zero Records.

TDD: new “past empty headline names the month and year once” failed before implementation. Passed bun test (182), bun lint, bun lint:check, bun types:check, bun run build; PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts --grep 'past empty|headline and Attention|Monthly budgets' --project=desktop --project=mobile (6 passed). Added browser test “past empty month shows one dated message and no empty charts”. No existing assertions changed.

Production demo loaded and October visited, then January 2025 captured for this finding: review/30-empty-past-branch-{dark,light}-{1440,390}.png; all opened. Browser closed and server killed by PID. graphify update . plus README semantic refresh/clustering passed (symbol-free config/test warning only).

Look for: one No Records in January 2025 message, one import action, and no empty chart grid.

Signed commit: b2ef9d8; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 129 degree-0/1 nodes (graphify labels them isolated) and 18 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
