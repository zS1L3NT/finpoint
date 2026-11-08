> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 26 Statements rows are not clickable except the chevron

Status: resolved
Blocked by: —
Spec: ../spec.md §11 ("Which Records does this Statement fund?") · Evidence: ../review/19-g5-statements-row-not-clickable.png

**Severity: degraded**

## Evidence

Sol failed this twice (usability report, continuation) and it still fails on the production build: on `/statements` a click on a row's title or body does nothing; only the small chevron link ("Open statement") navigates. Records rows have a title link, so the two ledgers behave differently. The 1-click target in §11 is met only for a user who finds the chevron. The Statements list also ignores the dashboard month (it starts at "Today"), which surprises a user arriving from October.

## Fix

`app/statements/page.tsx` (row cell for the Statement title): wrap the title in a `Link` to the Statement detail, as `app/records/page.tsx` does for Records, and keep the chevron. Optional: carry `month`/`year` into the date filter when present in the URL.

## Acceptance

- [x] Clicking a Statement title opens its detail page (desktop and 390px).
- [x] Hover/focus styling matches the Records title link.
- [x] Test in `tests/core/ledger.e2e.ts` (or the file that covers Statements) clicks the title, not the chevron.

## Comments

Statement titles now link to details in both shared desktop and mobile rows, matching Record title links. Existing chevrons remain. README documents title navigation.

Verification passed: bun test (180); bun lint; bun lint:check; bun types:check; bun run build; PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/tables.e2e.ts --project=desktop --project=mobile (30 passed). Added test “Statement title opens the funded Records detail” clicks FairPrice's title, checks its detail URL and funded Record. No existing test changed.

Production demo October 2026 screenshots opened: review/26-statements-branch-{dark,light}-{1440,390}.png. Browser closed, port 5180 server killed by PID. graphify update . and README semantic refresh/clustering passed; symbol-free config/test warning only.

Look for: Statement descriptions are links on desktop and mobile, alongside the existing chevron and semantic amount colours.

Signed commit: f5682c4; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 125 degree-0/1 nodes (graphify labels them isolated) and 15 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
