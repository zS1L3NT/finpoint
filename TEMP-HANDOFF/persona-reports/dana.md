> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Dana — Insight drill-down acceptance test (acceptance-2)

Persona: Dana, 41, accountant, reconciles everything. Earlier findings: F12 (two totals disagreed), F2 (drilling lost her place).
Setup: http://localhost:5180 (production build), desktop viewport 1440x900, "Try demo data" clicked on first load, theme switched to Dark in the sidebar. 35 browser commands used (hard budget), session closed at the end.

Screenshots live in `/home/ai/.t3/worktrees/finpoint/t3-69efe8e6/.scratch/insight-drilldown/acceptance-2/dana/` (paths below are relative to that folder).

## 1. Earlier findings (F-ids)

### F12 — two totals disagreed: FIXED (verified in side peek)

What I saw: I opened the drill-down from the **Spent** metric on the Dashboard ($701.03). The peek header reads **"Spent in November — $701.03 — 25 Records · Spending − refunds subtracted · Includes Pending Records"**, i.e. the same $701.03 the Dashboard metric and the "You've spent $701.03 of your $2,450.00 plan" line show. Behind it, every category subtotal equals the records listed under it, and the subtotals add back up to the header total:

- Bills & Utilities $49.98 = Mobile Plan $30.00 + Spotify Family $19.98 (2 Records)
- Dining Out $169.66 = Stuff'd 38.45 + Cai Fan 38.12 + Stuff'd 35.96 + Pasar Malam 14.50 + Cai Fan 13.26 + Cai Fan 9.11 + Kopi Uncle 7.34 + Kopi Uncle 6.92 + Starbucks 6.00 (9 Records)
- Gifts & Donations $46.11 = Birthday Gift $46.11 (1 Record)
- Groceries $333.29 = 83.84 + 82.48 + 59.82 + 40.84 + 40.09 + 26.22 (6 Records)
- Transport $101.99 = 30.20 + 23.25 + 16.15 + 13.80 + 8.55 + 6.24 + 3.80 (7 Records)
- Category subtotals sum: 49.98 + 169.66 + 46.11 + 333.29 + 101.99 = **$701.03**; record count 2 + 9 + 1 + 6 + 7 = **25**, matching "25 Records".

Cross-checks against other Dashboard numbers also tie: the category row "Groceries $333.29 48%" matches the drill-down's Groceries $333.29; the calendar day "1 November: $122.29 spent across 2 Records" matches FairPrice Run $83.84 + Stuff'd $38.45 = $122.29, both of which appear in the drill-down.

Screenshot: `08-spent-side-peek.png` (Drill-down open, totals and Records behind it visible). Supporting context: `01-dashboard-dark.png`.

Caveat: I could only run this check in **side peek** mode (see scope note in section 2) — center peek and full page were not reached.

### F2 — drilling lost my place: PARTLY

What I saw:

- While the side peek was open, the Dashboard stayed visible behind it, still on November 2026 at the same scroll position — I did not lose the page underneath (`08-spent-side-peek.png`).
- Closing with **Back** did not work as expected: I pressed the browser Back button while the "Spent in November" peek was open. The address bar went back to `http://localhost:5180/` (the Dashboard URL), **but the drill-down stayed open on screen**. Two screenshots taken about a second apart — `09-after-back.png` and `10-after-back-settled.png` — are both still the open peek over the Dashboard. So Back neither closed the drill-down nor gave me a visible "back to where I was" transition; the URL and what I can see disagree.
- Closing with **Esc** was not reached within the 35-command budget, so I cannot say whether Esc returns me to my exact spot.

Verdict: PARTLY — the drill-down no longer hides the page behind it, but Back leaves the peek stuck open while the URL already says Dashboard, which is exactly the kind of place-keeping confusion F2 was about.

## 2. New issues

### Issue 1 — severity: broken — clicking a calendar day or a category row never opens a drill-down

- **Where:** Dashboard, Spending calendar day cells and the category rows (below the fold).
- **Steps:** Dashboard (Dark, demo data) → click the day button "1 November: $122.29 spent across 2 Records" (tried twice, once by element click and once by its accessible name) → screenshot; wait and screenshot again; same for the category row "Groceries $333.29 48%".
- **Expected:** a drill-down opens, like the one the Spent metric opens.
- **What happened:** nothing changed on screen — no peek, no dialog, URL unchanged, and a fresh accessibility snapshot after the click showed no drill-down elements. The screenshots after each attempt are byte-identical in size to the plain Dashboard shot (`02-day-side-peek.png`, `03-recheck.png`, `04-day-peek-attempt2.png`, `05-category-peek.png`). The Spent metric, which sits in the first screenful, opened its drill-down immediately (`08-spent-side-peek.png`).
- **Honest caveat:** every element that responded to my clicks (sidebar links, theme switcher, Spent metric) was visible without scrolling, and every element that did not (day cells, category rows) was below the fold, so I cannot fully rule out that my click tooling never actually reached them. Still, four attempts produced zero reaction, so this needs a quick manual re-test before I'd trust the calendar drill-down.

### Issue 2 — severity: broken — browser Back returns the URL to the Dashboard but leaves the drill-down open

- **Where:** Drill-down opened from the Spent metric (side peek), browser Back.
- **Steps:** Open drill-down from "Spent $701.03" → press browser Back.
- **Expected:** the drill-down closes and I'm back on the Dashboard where I was.
- **What happened:** the URL became `http://localhost:5180/`, but the "Spent in November" peek stayed open over the Dashboard, unchanged, a second later (`09-after-back.png`, `10-after-back-settled.png`). Address bar says Dashboard, screen says drill-down — the state is out of sync and Back appears to do nothing visible.
- **Screenshot path:** `10-after-back-settled.png`.

### Issue 3 — severity: confusing — "Open as" menu: I could not switch to Center peek

- **Where:** Drill-down header, the dropdown labelled "Open as: Side peek" (next to the "Open as full page" arrow button and the X).
- **Steps:** With the Spent drill-down open → click the "Open as: Side peek" dropdown → select "Center peek".
- **Expected:** the dropdown opens and offers Side peek / Center peek / Full page, and the drill-down re-opens as a centered peek.
- **What happened:** the dropdown click reported success, but then no "Center peek" element could be found, so no mode switch happened. I could not confirm from this run whether the menu opened with different labels or did not open at all — my budget ran out before I could snapshot the open menu.
- **Screenshot path:** `08-spent-side-peek.png` (header with the "Open as: Side peek" control visible at top-right).

### Scope note (what I did not reach within the 35-command budget)

Not observed, so not judged: the "Open as" switch to **Center peek** and **Full page**, closing with **Esc**, drill-downs from an **Income** metric, and the **filters on Records and Statements** (I never got a look at the Records/Statements filter bars, so I cannot say whether active filters are visible or clearable). Earlier tooling trouble (several clicks/snapshots that produced no visible change, one navigation screenshot taken before the page repaint) consumed a large part of the budget.

## 3. Would I keep using this?

The numbers are what I care about, and right now the numbers behave: I drilled the $701.03 Spent figure down to its 25 Records, every category subtotal added up to the penny, and the day and category figures on the calendar matched what was behind them — so I'd trust this for month-end instead of re-keying everything into my own spreadsheet. But closing a drill-down with the Back button and landing with the address bar on the Dashboard while the peek just sits there would drive me up the wall — that's precisely how I lost my place last time, and I'd end up hunting for the X button every time. The fact that clicking a day on the calendar did nothing at all (four times), and that I never managed to see the Center peek or Full page views, means I'd keep this app for the totals but I'd still keep a manual reconciliation pass until closing and re-checking a drill-down is boring and predictable. If the filters on Records and Statements had turned out to be as hard to read as this, I'd probably have stopped after the first week.
