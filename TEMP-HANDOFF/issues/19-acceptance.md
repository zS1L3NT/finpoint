> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# 19 acceptance

Status: resolved
Phase: P3
Blocked by: all P0–P2
Spec: ../spec.md

## What

**Acceptance:** re-run the 10 personas plus Sol's 12 goals on a production build; compare step counts with §11; triage new findings.

## Acceptance

- [x] Personas and Sol's 12 goals re-run on a production build.
- [x] Step counts compared with spec §11; new findings triaged into new tickets (24–32).
- [ ] Spec §12 done-definition (tests, lint, types, graphify, docs per D5): not re-run here (no source changed in this ticket); each ticket recorded its own. Open items are tickets 24–32.

## Comments

## Results

Method: `bun run build` on head 5a8148c, `bun run start --port 5180`, `agent-browser@0.27.0`, demo data, dark mode, October 2026, 1440×900 and 390×844. The Haiku persona scripts are not in the checkout, so each persona was re-run from its spec §3 ledger finding (F-ids). Step counts are clicks/taps after the Dashboard loaded; the day button needs a scroll first.

### §11 task step counts

| Task | §11 today | §11 target | Now | Pass? | Notes |
| --- | --- | --- | --- | --- | --- |
| Records behind a day | 3 + page change | 1 | 1 (day cell) | pass | 3 Oct: $229.49 = 94.85+85.41+30.00+19.23 |
| Records in a category | 1 + page change | 1, chart stays | 1 (Categories row), chart stays | pass | Groceries 13 Records |
| Records in a Monthly Budget | ~4 | 1 | 1 (budget row) | pass | Daily: "$1,700.02 of $1,800.00", 75 Records |
| Biggest expense | ~6 | 0 | 0 (Largest Records); "See all" 1 | pass | |
| Bank activity behind a Record | 2 + page | 1 | 1 to see the allocation row, 2 to open the Statement | partial | ticket 24 (pivot header) |
| Records a Statement funds | 2 + page | 1 | 2 in panel; 1 on Statements page, chevron only (page change) | partial | tickets 24, 26 |
| Why is a Record pending | not answerable | 0 | 1 (expand), reason not stated, caption repeats | partial | ticket 25 |
| Category vs usual | ~4 | 1 | 1 (Biggest changes row) | pass | window labelled "Full months · Sep 2026, Aug 2026"; ticket 28 polish |
| What the trip cost | hard | 1 | 1 ("View Budgets", Tokyo Trip $1,965.22 of $2,200) | pass | October line is generic, names no Budget |
| Get back to where I was | lost | 1 | 1 (Esc or browser Back) | pass | scrollY 1471 before and after; focus returns to the day cell |

7 of 10 at target; 3 partial; 0 worse than today. Nothing regressed from the "today" column.

### Sol's 12 goals

| Goal | §11 / baseline | Now | Pass? | Notes |
| --- | --- | --- | --- | --- |
| 1 Explain a spending spike | multi-page | 1 click (9 Oct $233.90, 4 Records) | pass | |
| 2 Compare categories | ~4 + memory | 1 (Dining Out compare panel) | pass | ticket 28 (uneven columns) |
| 3 Trace a total to Records | partial | 1 (Spent: 84 Records, $2,049.99 = categories = Budgeted $2,047.49 + Unbudgeted $2.50) | pass | ticket 32 (rows not grouped) |
| 4 Record → bank transaction | Sol failed | 2 (expand, tap Statement) | pass | ticket 24 |
| 5 Statement → Records | Sol failed | 1 (chevron) on Statements page; title click still does nothing | partial | ticket 26 |
| 6 Partial / unmatched | unverified | rows show "$23.54 of $47.08 allocated" and Pending chip | pass | reason text: ticket 25 |
| 7 Possible duplicate (Mobile Plan split) | unresolved | not re-run: the November split pair is outside October; two-way "of" rows verified on partial Allocations | partial | re-check in November |
| 8 Correct an entry, verify summary | not attempted | 4 actions (expand, Edit Record, amount, Save): panel $229.49 → $231.26, Spent $2,049.99 → $2,051.76 live | pass | |
| 9 Refund | not attempted | no refund in demo data; made one by editing a Record to Money in: $2,017.04 − $34.72 = $1,982.32 | pass | ticket 29 |
| 10 Budget remaining | seen | 0 clicks ("$99.98 left" on the row) | pass | |
| 11 Return preserving context | not tested | Esc / Back: scroll and scope exact | pass | |
| 12 Mobile drill-down | failed | tap day → sheet, expand, pivot, Esc | pass | tickets 24, 32 (clipped Back, truncated meta) |

11 achieved, 1 partial (7).

### Personas (re-run from §3 ledger)

| Persona | Check | Now | Pass? | Notes |
| --- | --- | --- | --- | --- |
| Marcus | Income $0 beside shortfall (F5) | November: "Income None yet", "Left over — Waiting for income" | pass | |
| Priya | Mobile answer three screens down (F11) | headline, Attention, Spent/Income/Left over inside the first 844px | pass | |
| Dana | Day total, two totals disagree (F2, F12) | 1 click; all totals reconcile to the cent | pass | |
| Margaret | Biggest expenses, overload (F3, F9) | Largest Records 0 clicks; one headline, 3 Attention rows | pass | |
| Tyrone | Scope kept, "New" label, mobile category picker (F2, F13b) | "New Monthly Budget"; picker opens at 390; previous month works | pass | not reproduced, as §3 predicted |
| Sofia | Biggest expenses, trip (F3, F13d) | Largest 0; Budgets 1 | pass | |
| Jen | "Workflows" naming (F21) | sidebar says Allocate; page "Allocate statements to records." | pass | |
| Aiden | Overload, previous month on mobile | works at 390 | pass | |
| Leo | "$1,229 of $0.00 · over" (F13c) | "Travel $0.00 used · no plan" | pass | |
| Wei | Savings goal (F13e) | still out of scope; "Saved this month $500.00" shown | pass | |
| Empty past month (F10, five personas) | January 2025 | contradictory copy, empty cards remain | partial | ticket 30 |

10 of 10 persona goals met; the empty-month check is partial.

### Flaky-test classification

`PLAYWRIGHT_SERVER=production bun run test:e2e -- tests/core/editors.e2e.ts --project=mobile --repeat-each=5`:

| Where | Result |
| --- | --- |
| Branch ai/insight-drilldown (5a8148c) | 100 passed, 0 failed (20 tests × 5), 9.2 min |
| main 88ba7b1 (detached worktree, removed) | 95 passed, 0 failed (19 tests × 5), 9.5 min |

No branch-only failures: the editors file is not flaky on either side here. The 5 extra branch runs are one more test on the branch. Setup note: on main the first two attempts timed out waiting for the webServer because the harness bundle (`.scratch/ui-regression/harness-build`, built by `bunx vite build --config tests/harness/vite.config.ts`) did not exist in the fresh worktree; the third run built it first. This is not a product failure.

### New findings

| Ticket | Severity | Finding |
| --- | --- | --- |
| 24 | degraded | Statement pivot keeps the old total and meta, mobile Back button clipped |
| 25 | degraded | Pending reason not stated, duplicated allocation copy |
| 26 | degraded | Statements rows only open from the chevron |
| 27 | degraded | Forecast draws last month's line with no key; contradicts the headline |
| 28 | polish | Compare panel columns uneven, average unexplained |
| 29 | polish | Refund row unlabelled in Spending lists |
| 30 | polish | Empty past month contradicts itself |
| 31 | polish | Stale "Back to October 2026"; "Clear 1" with no filter |
| 32 | polish | Attention rows leave the Dashboard; Spent rows not grouped; sheet meta truncated |

Screenshots: `../review/19-*.png` (dark, 1440 unless named 390; the stale back link is light). No source files changed. Production server stopped by PID, browser closed, `/tmp/finpoint-main` worktree removed; no listeners on 5180/5273/5274.

Look for: tickets 24, 25 and 27 are the ones a first-time user will hit first.
