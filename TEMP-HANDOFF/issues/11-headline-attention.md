> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 11 headline attention

Status: resolved
Phase: P2
Blocked by: 01, 08
Spec: ../spec.md

## What

**Headline and Attention list**, replacing the review chips.

## Acceptance

- [x] Headline sentence summarises the month (spec §6.5).
- [ ] Attention list replaces the review chips; each row deep-links (Pending Records, Pending Statements, unallocated Statements, unbudgeted).
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implemented factual headline (scope-aware spending/plan, majority category, remaining days/completed month) and ranked Attention list capped at three. Reused Card, icons and existing deep links; summary Metric colours, chips and sparklines retained. Budget/unbudgeted rows open the drill-down. Pending Record/Statement and unallocated Statement rows retain the filtered work-list deep links (spec §9 says keep the same deep links; §6.5's “each opens its drill-down” is not implemented for these work lists).

Verification: `bun test` 177 passed; `bun lint` / `bun lint:check`, `bun types:check`, `bun run build` passed. `PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts --project=desktop --project=mobile`: 14 passed. Initial new browser case wrongly expected a closed October despite the fixture freezing 15 October; corrected to exactly 16 days left. No existing tests edited.
Tests added: tests/domain/headline-attention.test.ts (template facts and ranking/cap); tests/core/drilldown.e2e.ts “headline and Attention replace review chips with ranked work links” (render, chip removal, ranked Pending Records link).
Docs: CONTEXT.md and README.md. `graphify update .` plus semantic documentation refresh and clustering completed; four self-loop edges remain in the graph diagnostic (no dangling/missing/collapsed edges). Outputs included.
Production screenshots: agent-browser@0.27.0, Try demo data, October 2026, dark/light, 1440/390, panel closed/open. All eight opened and inspected: `review/11-{dashboard,panel}-branch-{dark,light}-{1440,390}.png`. Server stopped by PID; browser closed.
Look for: factual month sentence above three calm review rows, retained colours/icons/sparklines/delta chips, and usable layout beside the dock and at 390.

Signed commit pushed: `035723b063698a5d606cc29187d7dd7cbdf82012` on `origin/ai/insight-drilldown`. Worktree clean. Ticket remains claimed: all checks pass, but spec §6.5 requires Pending/unallocated work-list rows to open the drill-down; current implementation retains their filtered-page deep links per §9. This remaining spec gap must be implemented before resolution.

Opus decision (2026-11-07): work-list rows (Pending Records, Pending Statements, unallocated Statements) keep their filtered-page deep links — they are to-do lists the user acts on in place, and §9 keeps those links. Only insight rows (budget, unbudgeted) open the drill-down. Spec §6.5 updated to match. Ticket resolved.
