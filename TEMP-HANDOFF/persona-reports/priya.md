> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Priya (29, nurse, mobile 390x844) — insight drill-down acceptance test

Viewport: mobile 390x844 · app at http://localhost:5180 (production build) · session `p-priya`
Screenshots: `/home/ai/.t3/worktrees/finpoint/t3-69efe8e6/.scratch/insight-drilldown/acceptance-2/priya/`

## 1. Earlier findings (F-ids)

**F11 — "the answer was three screens down" → PARTLY FIXED.**

What I saw, in the order I hit it:

- **Records: fixed.** Opening `/records`, the very first group in the list is `Yesterday · 4 Records · -$132.25`, followed immediately by the four records (Spotify Family -$19.98, Grab Ride -$30.20, Birthday Gift -$46.11 pending, Stuff'd -$35.96). No scrolling at all — that answers "what did I spend yesterday" in one screen. Screenshot: `03-records-filter-cleared.png` (this shot is after I cleared a filter; the Yesterday group sits directly under the filter row).
- **Dashboard: still far down.** The Dashboard's first screen gives me "how much" and "on plan" (`You've spent $655.01 of your $2,450.00 plan. 21 days left.`, plus the Spent / Income / Left over / Saved metrics) — screenshot `01-first-load.png` — but yesterday's spending is not there. Walking the Dashboard's accessibility tree in order, the Spending calendar comes *after* the month headline, the three alert cards, the metric row, the scope combobox, the spending forecast chart, the monthly budgets list, the categories list, the category trend chart and the Largest Records list. Its day cell does carry the answer (`8 November: $132.25 spent across 4 Records`), but at 390x844 that is still several screens down. So the goal is met on Records and not on the Dashboard.
- The drill-down I could reach (`Spent in November`, screenshot `05-drill-open.png`) groups by category (Bills & Utilities, Dining Out, …), not by day, so it does not answer "yesterday" either.

Setup notes (things I verified while getting started):

- **Theme: already Dark, no action needed.** The sidebar's Appearance control shows Light / Dark / System with **Dark** checked, and the sidebar footer toggle has the moon selected. Screenshot: `04-drill-state.png`.
- **"Try demo data": never appeared.** On first load the Dashboard already held demo data ($655.01 spent, 438 records, 12 unallocated statements), so there was no prompt to click.
- Mid-session the server on :5180 stopped responding (`ERR_CONNECTION_REFUSED`); I restarted it (`next start -p 5180`) and continued. That was the shared environment, not the app.

## 2. New issues

**Issue 1 — severity: nit · Records list, pending rows lose their title at 390px**
- Where: `/records`, "Yesterday" group, third row.
- Steps: open Records on a 390-wide phone → look at the first group.
- Expected: the full record title, like every other row in the same list (`Spotify Family`, `Grab Ride`, `Stuff'd`).
- Actual: the Pending badge shares the title line, so the row reads `Birthday…` — two characters of a four-word title are dropped, and the meta line under it (`Gifts & Donations · w/ …`) is truncated the same way, while the amount column and badge have room to spare.
- Screenshot: `03-records-filter-cleared.png`.

**Issue 2 — severity: confusing · drill-down header is icon-only, I could not tell which control changes how it opens**
- Where: the panel opened from the Dashboard's **Spent** metric (`Spent in November`).
- Steps: tap `Spent $655.01` on the Dashboard → panel opens → look at its header.
- Expected: a labelled affordance for switching how the panel opens (something I can read as "Open as"), because I am asked to switch between Side peek / Center peek / Full page.
- Actual: the header shows three bare icons — an expand/expand-out arrows icon, a panel-with-caret icon, and a close ✕ — with no visible text, so I cannot tell which one is the mode switch; a text search for "Open as" on the page found nothing. I never got it open, so I cannot say what the three options look like or whether they work.
- Screenshot: `05-drill-open.png`.

Coverage note (not an issue, just what I did not manage to reach): I verified that a Dashboard number (the Spent metric) opens a drill-down and what it contains, and I verified Records filters end-to-end (apply + clear). I did **not** get to: the "Open as" menu and its Side peek / Center peek / Full page options, closing the drill-down with Esc, closing it with Back, and where either one lands me; and on Statements I only inspected the idle filter row (`All Accounts`, `Any status`, `Any allocation`, `Any date`, `Any amount`, with **Clear** disabled) — I applied and cleared a filter on Records, not on Statements.

What I did see on Records filters (for the record):

- Idle: every filter reads `Any …` / `All …` and **Clear** is disabled → easy to tell nothing is active.
- After picking Groceries: the chip changes to `1 category`, Groceries carries a ✓ in the list, the chip gets its own ✕ (`Reset category filter`), and the global button becomes **Clear 1** (enabled). Screenshot: `02-records-filter-active.png`.
- Tapping **Clear 1** restored all the `Any …` labels, disabled Clear again and brought the full list back. Screenshot: `03-records-filter-cleared.png`.

## 3. Would I keep using this?

Mostly yes. On my phone, the first screen answers the two questions I ask most — "how much have I spent" and "am I on plan" are both right there at the top in one glance, with the plan total next to it, and Dark mode was already on so it doesn't burn my eyes at 6am on the ward. For "what did I spend yesterday" I now open Records and it's the very first group with the total and the four records, no digging — that was the thing that annoyed me before, and it's fixed there. What still trips me up: if I'm already on the Dashboard I have to scroll past the forecast, budgets, categories and the trend chart to reach the calendar, so I'll keep defaulting to Records; and when the Spent panel opens I get a nice list of actual records with an "Open in Records" button, but the three little icons in its header mean I'd have to guess at how to change how it opens — I'd never find "Center peek" or "Full page" by myself. I'd keep using it for the daily check, and I'd want two small things: yesterday's total on the Dashboard itself, and a word — not an icon — on that panel header.
