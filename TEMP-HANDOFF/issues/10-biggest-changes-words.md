> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 10 biggest changes words

Status: resolved
Phase: P1
Blocked by: 04
Spec: ../spec.md

## What

**Biggest changes in words**, comparison window labels, compare-mode drill-down.

## Acceptance

- [x] Biggest changes rows read as sentences ("Groceries up $120 vs your 3-month average").
- [x] The comparison window is labelled.
- [x] Compare-mode drill-down shows this month vs the window side by side.
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

### Implementation and verification, 2026-11-07

Biggest changes now reads “Category up/down $X vs your N-month average”, with neutral money and an explicit Comparison window (included month names and elapsed-day/full-month period). `compare:<category-id>` retains the Dashboard month and scope, shows current and historical Records in two columns, and displays the historical per-month average. Exact-title uniqueness is labelled on either side and explained in the UI/ADR. Refunds remain subtracted. No shared helper was converted into a hook.

TDD: new domain test `compare drill uses the mover average and included same-period months` first failed with a whole-month total instead of the selected category, then caught the longer four-month trend window being used instead of COMPARISON_MONTHS. It now verifies net current totals, mover average, historical Record sum divided by included months, same-day cutoff, two scopes and invalid category handling.

Edited core tests: `populated charts: tooltips stay numeric, drills work by keyboard and a Record save updates the mover amount` enters positive 142.75 for ticket 18's deliberate Amount input change and waits for editor completion; its $176.08 and retained-node assertions stay strict. `overview: summary, calendar, Budgets, Category mix, movers and month change reconcile` updates the Biggest changes step's arrow copy assertions to the deliberate sentence and Average label. `edit from drill returns focus and updates the live total` increases the now-positive Amount by 1 (retaining the exact $85.20 total and focus assertions). New core test: `Biggest changes compares named periods and preserves the month through reload and Back`; Close must finish before testing Back. Animation test `drill sheet: entrance and exit retain popup motion` replaces non-null assertions with explicit missing-frame failures; all motion assertions remain intact.

Broad core run: 42 passed, 2 skipped, 6 failed instances across the three cases above at two widths. The runner had loaded test functions before the edits; traces show the original -142.75 and 83.2 inputs. Fresh final recheck: all 6 passed (desktop/mobile), including the new comparison case. No flakiness claim. An initial concurrent domain run hit the existing 120-second category reconciliation timeout and was stopped; final domain verification runs in isolation below.

Documentation: README describes the user flow; CONTEXT defines Comparison window; ADR 0001 records compare URL, shared window and exact-title uniqueness. Production screenshots and final checks below.


Final evidence: `bun test` isolated: 171 passed, 0 failed. Core: 48 distinct desktop/mobile cases pass across the broad run and fresh 6-case recheck, 2 deliberate skips. `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- tests/animations/charts.e2e.ts tests/animations/drilldown.e2e.ts --project=desktop --project=mobile --project=reduced-motion --workers=1`: 12 passed. Full ledger: 10 passed. `bun lint`, `bun lint:check`, `bun types:check`, `bun run types:e2e`, `bun run build`, `git diff --check`: passed, no lint warnings in final run.

Production review: clicked Try demo data in an incognito workspace, selected Dark, captured 1440/390 CSS widths through the environment's shared browser. Screenshots: review/10-words-{desktop,mobile}.png and review/10-compare-{desktop,mobile}.png. Both comparison columns remain readable on mobile; no horizontal overflow. Production server stopped by PID; review tab closed.
Look for: plain up/down sentences and named comparison dates; Grocery Records beside the 2-month average, with the title unique to this month labelled.

Final `graphify update .` plus host semantic update: 1,991 nodes / 7,955 edges. Three changed documents refreshed; five existing pending document extractions reviewed and retained. All four tracked outputs included. Diagnostics: zero missing/dangling/collapsed/duplicate edges; four existing self-loops and five isolated nodes remain. Extractor warns about 16 symbol-free files; community labels derive from hubs with stable IDs where possible. An initial report-generation argument error was fixed and the full semantic refresh rerun successfully. No unresolved refresh failure. No external API tokens used for semantic extraction. All servers stopped; no PR opened.

Final signed commit: `854a48f` (signature G), pushed to origin/ai/insight-drilldown. Working tree clean after completion.
