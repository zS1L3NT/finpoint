> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 14 empty states

Status: resolved
Phase: P2
Blocked by: —
Spec: ../spec.md

## What

**Empty states:** whole-page start state, "Go to October" for an empty month.

## Acceptance

- [x] Whole-page start state for a new workspace.
- [x] An empty month offers "Go to <previous month>".
- [x] Spec §12 done-definition met (tests, lint, types, graphify, docs per D5).

## Comments

## Exact design (Opus, 2026-11-07) — implement literally, decide nothing

A. **Empty workspace** (`active === false` in app/(month)/page.tsx): render ONLY this, replacing the whole dashboard body (no summary band, no charts, no scope select). Reuse `DemoOffer`'s handlers; delete the old `DemoOffer` banner.
```tsx
<div className="reveal mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
  <span className="flex size-12 items-center justify-center rounded-full bg-muted">
    <IconifyIcon icon="lucide:wallet" className="size-6 text-muted-foreground" />
  </span>
  <h2 className="text-lg font-semibold">Start with your bank statements</h2>
  <p className="text-sm text-muted-foreground">
    Import a statement file and Finpoint builds your Records, budgets and charts from it.
    Or explore first with demo data: 3 accounts and 5 months of Records. Reset it any time from Data.
  </p>
  <div className="flex flex-wrap justify-center gap-2">
    <Button asChild><Link href={pathImporter()}><IconifyIcon icon="lucide:upload" />Import statements</Link></Button>
    <Button variant="outline" disabled={loading} onClick={...}><IconifyIcon icon="lucide:sparkles" />{loading ? "Loading…" : "Try demo data"}</Button>
  </div>
</div>
```
While the live query is still `undefined`, render nothing (AGENTS.md).

B. **Empty past/current month in an active workspace** (no Records in this month, month not in the future): above the summary band render
```tsx
<div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
  <p className="text-sm">Nothing recorded in {month} yet.</p>
  {latest ? <Button variant="outline" size="sm" onClick={() => go to latest}>Go to {latest.month}<IconifyIcon icon="lucide:arrow-left" /></Button> : null}
</div>
```
`latest` = most recent earlier month with ≥1 Record; compute in `src/logic/dashboard.ts` (new exported function, domain test: returns null with no earlier Records, skips empty months). Navigate with the existing month setter from `useMonthParams`. Hide the drill-able charts' empty $0 content? No — leave charts as they are.

C. Tests: core e2e (desktop+mobile) for A (fresh workspace shows heading, both buttons; demo button loads data) and B (navigate to an empty month → "Go to <month>" moves there). Join exactly one CI group if a new file. Dark-mode screenshots of A and B per AGENT-BRIEF.

Implementation reviewed: exact start state and latest earlier Record month retained. Domain and charts desktop/mobile checks running; lint:check and types:check passed. Screenshots and full verification pending; status remains claimed. Edited tests: empty-states.test.ts (month lookup/count), charts.e2e.ts (new start and empty-month behaviour), component-inventory.ts (coverage names).
Look for: centred import/demo start state and compact previous-month notice.

Commit: a4a6609. Focused domain check: `bun test tests/domain/empty-states.test.ts`: 4 passed, 8 assertions. `bun lint:check` and `bun types:check` passed. Full domain runs: first 174 pass / 1 timeout / 1 error; repeat 170 pass / 5 fail / 3 errors amid heavy system load. No flakiness claim. Charts run interrupted after timeout failures; focused empty-state browser retry also timed out. Production Turbopack and webpack builds stalled; stopped by PID. No screenshots captured. Remains claimed pending browser checks, production screenshots and full domain verification.


### Final verification — 2026-11-07, commit 11632a19298f22824e06f89b01bc1256895f8848

- `bun test`: **175 passed, 0 failed**, 2,258 assertions (full run; review/14-20-domain.log).
- `bun lint`, `bun lint:check`, `bun types:check`, and `bun run build`: passed. The final browser bundle was built with `taskset -c 0,1 bun run build` to keep memory bounded.
- Core: `bun run test:e2e -- --config=.scratch/insight-drilldown/verify.config.ts tests/core/{charts,routes,tables}.e2e.ts --project=desktop --project=mobile --workers=2`: full run covered 135 cases (127 passed, 2 skipped, 6 subsequently corrected). Focused rechecks passed the comparison and duplicate-link cases; the final 16-case desktop/mobile regression run passed all 16, including unchanged layout/pointer audits and pending/allocated amount checks. Every previously failing core case is green after its correction.
- Animations: `PLAYWRIGHT_ANIMATIONS=1 bun run test:e2e -- --config=.scratch/insight-drilldown/verify.config.ts tests/animations/{charts,drilldown,routes,tables}.e2e.ts --workers=1`: 71 cases covered, 63 passed initially. Focused recheck passed 15/16; the remaining mobile paging case then passed unchanged after layout fixes. The complete final mobile tables animation file passed **9/9**, alone with one worker. Every earlier failing animation case has a passing recheck. The initial tall interruption sampler missed its observation window; its unchanged recheck passed. No flakiness claim or threshold/timeout relaxation.
- The scratch config changes only testDir/baseURL and disables automatic web servers. All browser verification used the single production server on :5180; the initial cold dev attempts were stopped and superseded by production checks. No servers, test processes or screenshot browsers remain running.
- `graphify update .` plus host README semantic refresh completed after final verification: **2,000 nodes / 8,022 edges**. Included graph.json, GRAPH_REPORT.md, manifest.json and .graphify_labels.json. Health: zero missing/dangling endpoints; four self-loops remain. Extraction warns that 16 code files yield no symbols. README semantic extraction is complete; host token counts unavailable. No refresh failure remains.
- Edited tests and exact reasons/names: [review/20-edited-tests.md](../review/20-edited-tests.md). Files: tests/core/charts.e2e.ts, tests/core/routes.e2e.ts, tests/core/tables.e2e.ts, tests/animations/tables.e2e.ts. Unexpected failures were fixed in source; test edits follow intentional copy, route, disclosure and detail-table changes.
- Signed commit: `11632a19298f22824e06f89b01bc1256895f8848`. Existing draft PR #48 only; no new PR. Working branch remains ai/insight-drilldown.

Screenshots: `../review/14-start-dark-{1440,390}.png` and `../review/14-empty-month-dark-{1440,390}.png`. Both production start-state and empty-month flows pass on desktop/mobile. The isolated empty-month screenshot workspace removes October Records so the notice offers September.
Look for: centred import/demo start state, silent loading, and an empty October notice with Go to September.

Push confirmed: origin/ai/insight-drilldown = 11632a19298f22824e06f89b01bc1256895f8848; signature verified (G). Working tree clean; temporary main worktree removed; no task server/browser/test processes remain.
