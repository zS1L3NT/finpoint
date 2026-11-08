> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 06 record statement pivot

Status: resolved
Phase: P1
Blocked by: 01, 03
Spec: ../spec.md

## What

**Record expand and Statement pivot inside the panel:** `focus` param, breadcrumb, Back, path-symmetric motion.

## Acceptance

- [x] Expanding a Record in the panel shows its Statements (one level only).
- [x] Clicking a Statement pivots the panel (`focus=statement:<id>`) with breadcrumb and Back; motion returns along the same path.
- [x] Back in the browser undoes the pivot.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments
- Opus: panel title shows a focus outline when focused programmatically on open (01 screenshot). Use outline-none on the tabIndex=-1 heading; keep focus-visible for keyboard.

- Implementation: `8efe6d5`. Record expansion uses `focus=record:<id>`; Statement pivots use `focus=statement:<id>`. Browser Back/Forward and reload restore focus. Breadcrumb includes the originating Record and account, with a Back action; shared links return to the selection. Statement Records remain flat links, so no nested accordion stack. Title uses outline-none with a keyboard focus-visible ring.
- Verification: `bun test` (166 passed); `bun lint` + `bun lint:check`, `bun types:check`, `bun run types:e2e` all pass; `bun run build` passes. Core `bun run test:e2e -- tests/core/drilldown.e2e.ts --project=desktop --project=mobile` (4 passed); animations `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/drilldown.e2e.ts --workers=1` (3 passed).
- Edited tests: `tests/domain/drilldown.test.ts` adds missing Statement focus coverage (observed red before implementation); `tests/core/drilldown.e2e.ts` adds URL expansion, breadcrumb, reload, browser Back/Forward, panel Back, invalid focus coverage; `tests/animations/drilldown.e2e.ts` adds frame sampling that proves opposite exit directions and return to zero. Existing tests unchanged.
- Initial browser attempts: npm absent from shell PATH, corrected by using installed Node bin directory. First new test selected sidebar control, corrected to panel scope. An overlapping core/animation attempt conflicted over server lifecycle/artifacts; both rerun sequentially and pass. No flaky claim.
- Production dark-mode demo screenshots: `.scratch/insight-drilldown/review/06-statement-desktop.png` (1440) and `06-statement-mobile.png` (390), captured through shared T3 browser (preferred browser tool); production server stopped after capture. Existing demo workspace used.
- Graph: `graphify update .` plus inline semantic extraction/cache/merge for README and ADR; final graph 1973 nodes, 7928 edges. Health: no dangling/missing/collapsed edges; 4 existing self-loops remain. AST warning: 16 files yield no symbols (mostly test/data files). Community labels refreshed by hub fallback. All four required graph outputs included.
- Look for: the compact account/Record breadcrumb, readable Statement Allocation evidence, persistent selection total, and Back travelling along the reverse path without a programmatic title outline.
