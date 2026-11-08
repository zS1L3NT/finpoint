> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Final review (Opus, by hand) — 2026-11-08

Fixed point: `origin/main` (merge-base 3609d85). Passes: /code-review, /apple-design, /break-ui, /ui-taste.

## Code review (standards)
- FIXED — drill-down fetched Record details one by one; each `getRecord` re-scanned every Statement for duplicates and re-read all accounts (84× for the Spent drill, re-run on every DB change). New batched `getRecords(ids)` in `src/logic/records.ts`; `getRecord` delegates to it.
- FIXED — drill kind list duplicated between `Selection` type and `useDrill` validation → `SELECTION_KINDS` in `src/logic/drilldown.ts`.
- FIXED — `tests/core/drilldown.e2e.ts` failed `types:e2e` (`amount.split("\n")[0]` possibly undefined).
- Judgement, left: `getDrilldown` title is a long nested ternary over `selection.kind` (Repeated Switches with use-drill); comparison "unique Records" match by title only.
- Judgement, left: sidebar `pathname.startsWith("/records")` uses a literal path, not `src/routes.ts`.

## Spec
- All tickets 00–32 resolved; persona acceptance (ticket 19): 10/10 personas, 11/12 goals, §11 step counts 7/10 at target, 3 within 1 step.
- REGRESSION FIXED — ticket 30's empty past-month state dropped the "Go to <latest month>" action (2 chart tests red at both widths). Restored inside the same single notice.

## Apple design
- Springs critically damped (`bounce: 0`), dock enters/exits along the same path (x 24px), reduced motion swaps to fades: held up.
- FIXED — drill rows had hover but no press feedback; now `active:bg-muted/60`, matching Attention rows.

## Break-ui (worst-case data, dev toggle)
Toggle: dev builds, or `NEXT_PUBLIC_DEV_TOOLS=1 bun run build`: bottom-centre "Demo data / Worst case / Empty" on the Dashboard. Replaces the local workspace. Fixture: `src/data/worst-case-data.ts`.

| # | Severity | Field | Worst case | What happened | Status |
|---|---|---|---|---|---|
| 1 | Broken | drill row amount column | pending -$1,234,567.89 | "$x of $y allocated" caption sat in the amount column, squeezing the title to ~100px (8 wrapped lines) | FIXED: caption moved under the meta line, amount nowrap |
| 2 | Broken | drill row at 320px | long title + 7-digit amount | title column ~85px, words split mid-word | FIXED: row wraps, amount drops to its own line |
| 3 | Broken | dock layout | resize 390→1440 with panel open | dashboard slid under the panel (no gap) until reload | FIXED: always two grid tracks, gap inside the panel track |
| 4 | Ugly | Monthly Budget badge | "Irregular & annual subscriptions (insurance, renewals)" | badge overflowed the panel past the amount | FIXED: badge `max-w-full` + truncate + title |
| 5 | Ugly | Left over % | -28254.0% | no thousands separator | FIXED: locale formatting |
| 6 | Ugly | Attention caption | unbudgeted row | caption repeated the title | FIXED: "Give it a Monthly Budget so it counts toward a plan." |
| 7 | Ugly | Records mobile group header | "Wed, 30 Sep · 2 Records" at 390 | wraps to two lines (same on main for past dates) | left |
| 8 | Fragile | names/titles | — | no max length on Record title, Category or Monthly Budget name | left (decision) |
| 9 | Inconclusive | Thai text | ร้านอาหาร… | tofu boxes in headless Chromium (no Thai font installed) — environment, not app | — |

Held up: long emails break cleanly, one-letter titles, emoji titles, "1 Pending Statement" singular, empty workspace onboarding, huge totals in headline/metrics/delta chips, calendar, legend wrapping.

## Decisions for the user
- Forecast outlier: a single $1.2M September Record makes November's forecast $619k, because ADR 0002 averages the last two months' remaining spending. Recommend: use the median of the comparison months (or cap single Records above the plan) — changes the ADR, so your call.
- Field length limits (Fragile #8): recommend 120 chars for Category/Monthly Budget names, 200 for Record titles, in `Validator` + inputs.
