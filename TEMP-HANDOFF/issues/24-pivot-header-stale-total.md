> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 24 statement pivot keeps the old total and header

Status: resolved
Blocked by: —
Spec: ../spec.md §5.3 · Evidence: ../review/19-g4-statement-pivot-stale-total.png, ../review/19-g12-mobile-pivot-back-clipped-stale-total.png

**Severity: degraded**

## Evidence

Production build, demo data, October 2026. Open the 3 Oct day, expand Mobile Plan, tap its Statement row. The panel pivots to the Statement, but the header still reads "$229.49 · 4 Records · Spending · refunds subtracted · Includes Pending Records" above a second large "-$30.00". Two big totals now compete and the header numbers describe something else. The breadcrumb reads "Mobile Plan › One Card statement › Mobile Plan · UOB ONE 4663" (account name "One Card" next to a card reference "UOB ONE 4663"; it also starts at the Record, not at the day as §5.3 shows). At 390px the Back button sits directly on the header divider (no top gap) and the stale "$233.90 … Includ…" meta is truncated. The Statement view also omits its date and the account/reference, so a user cannot tell which bank line this is (Sol's goal 7).

## Fix

`src/components/drill/panel.tsx` (~lines 130–200): when `statementId` is set, replace the header total and meta line with the Statement's own: amount, "Statement · <account> · <date, time>", and a one-line "Funds N Records". Keep the breadcrumb as `<day or category label> › <Record> › <Statement>` (drop the repeated account in the middle segment). Add `pt-3` to the Back row at narrow width. Show date/time and account in the pivot body.

## Acceptance

- [x] In pivot view only one total is shown, and it is the Statement's.
- [x] Header meta never describes the day/category while a Statement is in focus.
- [x] Statement date, time and account are visible in the pivot.
- [x] Back button clears the divider by ≥12px at 390px.
- [x] Browser test in `tests/core/drilldown.e2e.ts` asserts the pivot header (add to the existing pivot test; no new file).

## Comments

Implemented Statement-focused title, amount, account/date/time and Funds count; selection-first breadcrumb; 12px mobile Back spacing. README documents the focus change.

Verification: bun test (179 passed); bun lint; bun lint:check; bun types:check; bun run build; PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/drilldown.e2e.ts --project=desktop --project=mobile (17 passed, 1 desktop skip for mobile-only case). Edited test: “drill pivot: URL expansion, Statement breadcrumb and browser Back survive reload” adds focused amount, metadata, timestamp and Back spacing assertions; no existing assertion loosened.

Production demo October 2026 screenshots inspected: review/24-pivot-branch-{dark,light}-{1440,390}.png. Browser closed and port 5180 server killed by PID. graphify update . plus README semantic refresh and clustering completed; 17 symbol-free source files warned (test/config files), no refresh failure.

Look for: a single -$30.00 Statement total, account/time and Funds 1 Record in the header, and clear space above Back on mobile.

Signed commit: fed04852289aacbdc2d64019a98bac078bd8ee1d; pushed origin ai/insight-drilldown.

Graph health review (supplement): this commit’s report lists 123 degree-0/1 nodes (graphify labels them isolated) and 15 thin communities omitted from the report. These are non-fatal notices; the refresh succeeded. The starting graph reported 129 and 18 respectively.
