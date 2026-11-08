> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 03 allocation rows

Status: resolved
Phase: P0
Blocked by: —
Spec: ../spec.md

## What

**Allocation rows:** `AllocationRows`, `AllocationProgress`, `pendingReason`. Used on the Records/Statements expand and both detail pages. Mobile parity (F14).

## Acceptance

- [x] `AllocationRows` lists the other side of each Allocation with "$12.40 of $49.60".
- [x] `AllocationProgress` shows allocated vs amount; mobile Records rows show it (F14).
- [x] `pendingReason(record)` in `src/logic` returns one plain sentence; domain-tested.
- [x] Used on Records and Statements list expand chevrons and on both detail pages.
- [ ] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

Implementation: signed commit a68937a. Status remains claimed for semantic graph extraction / community labels; structural graph refresh succeeded. Graph diagnostic: 4 self-loops, zero missing/dangling endpoints and zero collapsed edges; 16 symbol-free files warned.

Verification:
- `bun test`: 165 pass, 0 fail (new pending-reason test first failed for missing export, then passed).
- `bun lint`, `bun lint:check`, `bun types:check`: pass.
- `bun run build`: final build passes.
- `bun run test:e2e -- tests/core/tables.e2e.ts --project=desktop --project=mobile`: 26 pass, 2 fail (desktop Statement search URL and duplicate-review navigation timeouts). Neither test was changed. Focused rerun covering both failures and detail variants: 10 pass, 0 fail across desktop/mobile. Not classified as flaky; no main comparison performed.
- `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/drilldown.e2e.ts --project=desktop --workers=1`: 1 pass.
- `graphify update .`: final run reports no topology changes. Semantic extraction remains pending: graphify SKILL.md requires delegated agents ("You MUST use the Agent tool here"), prohibited for this implementation sub-agent by its orchestration instructions.

Edited tests: new `tests/domain/pending-reason.test.ts` exercises missing/partial/confirmed/pending allocations including zero amounts; `tests/core/tables.e2e.ts` first Record test checks the new pending sentence, progress, and expansion; `tests/core/routes.e2e.ts` two Record-detail variant tests expect the shared allocation empty copy, destination links, and readable progress instead of bracket amounts.

Screenshots (production, demo data, Dark): `.scratch/insight-drilldown/review/03-records-desktop.png` (1440) and `03-records-mobile.png` (390). Browser and servers closed.
Look for: Allocation shares and remainder below an expanded Record, with readable allocation progress on mobile; both detail pages and both panel directions reuse the same rows. Detail-page related Allocations now navigate to their detail page for editing; primary detail edit buttons remain.
- Opus: resolved; semantic graphify pass deferred to one batch at the end (structural refresh done).
