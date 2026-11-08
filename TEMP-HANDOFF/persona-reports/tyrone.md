> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Tyrone — usability test report

Persona: Tyrone, 26, budgets with Monthly Budgets on his phone. Earlier "New" read as new Record (F13b) and scope was lost moving to Records (F2). Checks budget remaining and that the budget scope carries into drill-downs and Records.

Setup: production build at http://localhost:5180, mobile viewport 390×844, session `p-tyrone`, "Try demo data" clicked on first load, theme switched to Dark from the sidebar radios (Light / Dark / System sit right in the mobile sidebar — no need for Settings). 35 browser commands used, then stopped.

Screenshots are in this same folder.

## 1. Earlier findings

**F13b — "New" read as new Record: FIXED**
On Records the primary action button now reads **"+ Create Pending Record"**, and on the Dashboard the create control is a dropdown labelled **"New Monthly Budget"** (I read that label off the accessibility tree; the button itself sits below the budget rows, below my screenshot frame). I saw no bare "New" anywhere on the two pages I visited, so I can no longer mistake it for a new Record.
Screenshot: `09-records.png`

**F2 — scope lost moving to Records: PARTLY**
The budget scope *does* show up on Records: there is a filter chip reading **"● All budgets"**, the same value as the Dashboard's "Spending scope" combobox. But the Dashboard was scoped to **November 2026 ("Through 9 Nov")** and Records opened at **"All months"**, with the subtitle "Choose a month to narrow the list" — the month scope from the Dashboard did not carry over.
Caveat: I never changed the scope away from "All budgets", so I can only confirm the *default* scope matches; I did not verify that a specific Monthly Budget would carry (I ran out of the 35-command budget before I could set one).
Screenshots: `09-records.png` (Records, "All months" + "All budgets"), `08-escape-again.png` (Dashboard, November 2026)

## 2. New issues

**Issue 1 — Tapping a day in the Spending calendar does nothing**
- Severity: **broken**
- Where: Dashboard → "Spending calendar" (the per-day list under the spending chart)
- Steps: open Dashboard with demo data → scroll to the day list → tap **"3 November: $132.43 spent across 4 Records"**.
- Expected: a drill-down for that day opens (like the one the Spent metric opens).
- Happened: nothing. No panel, no dialog, no change in the accessibility tree, and the URL stayed `http://localhost:5180/`. I tapped the same day a second time to rule out a missed tap — same result. Tapping the "Spent $701.03" metric right afterwards did open a drill-down, so drill-downs themselves work.
- Screenshots: `03-day-tap-nothing.png`, `04-day-tap-retry-nothing.png`

**Issue 2 — "Open as" menu on mobile offers only two modes**
- Severity: **nit**
- Where: Dashboard → drill-down header → "Open as" menu (the pane icon with a chevron)
- Steps: tap "Spent $701.03" to open the drill-down → tap the "Open as: Peek" button in its header.
- Expected: Side peek / Center peek / Full page choices (as my brief described).
- Happened: the menu lists only **"Peek"** (currently ticked) and **"Full page"** at a 390px viewport. No side/center options to switch between, so I could not try a third mode.
- Screenshot: `06-open-as-menu.png`

**Answers to the rest of the brief (not issues — what I actually saw)**

- *Esc closes the drill-down and you land where you were:* yes. First Esc only dismissed the open "Open as" menu (drill-down stayed up, `07-escape-closes-menu-only.png`); a second Esc closed the drill-down and left me on the Dashboard, same page, with keyboard focus back on the "Spent $701.03" card (visible focus ring) — `08-escape-again.png`.
- *Back closes it / lands you where you were:* **not tested** — I had no commands left after covering the drill-down, Esc, and Records.
- *Category row and Income metric drill-downs:* **not tested** (budget). The Spent metric drill-down does work: header with "Expand drill-down", "Open as full page", "Open as: Peek", "Close drill-down", body "Spent in November / $701.03 / 25 Records · Spending" grouped by category with per-record budget tags, and an "Open in Records" button at the bottom — `05-spent-metric.png`.
- *Records filters — can I tell which are active?* Yes at a glance: every filter is a chip that spells out its current value in words ("Newest first", "Any category", "All budgets", "Any treatment", "Any status", "Any date", "Any amount"), and with nothing set the **"Clear"** button is visibly dimmed/disabled. I did not activate a filter, so I can't say what a set one looks like beyond the chip text changing — **"can you clear one?" was not exercised.**
- *Statements filters:* **not reached** (budget) — I ran out of commands on the Records page.
- *Budget remaining (persona goal):* easy to read on the Dashboard — "You've spent $701.03 of your $2,450.00 plan. 21 days left.", plus per-budget rows: Daily $604.94 of $1,800.00 → **$1,195.06 left**, Recurring $49.98 of $250.00 → **$200.02 left**, Irregular $46.11 of $400.00 → **$353.89 left**, Travel $0.00 used · no plan. Screenshots `01-dashboard-mobile.png` (light) and `08-escape-again.png` (dark).

## 3. Would I keep using it?

Honestly, mostly yes — the stuff I actually care about every day is here: I can see in one glance that I've spent $701.03 of my $2,450.00 plan with 21 days left, and each budget tells me exactly what's left ($1,195.06 on Daily, $200.02 on Recurring, $353.89 on Irregular) without me tapping into anything, and Dark mode is one tap from the sidebar. The "Create Pending Record" button finally says what it makes, so I stopped second-guessing whether I was about to add a budget or a record, and when I tapped "Spent" I got a proper breakdown — category by category, each record showing whether it's recurring, pending, or allocated — with "Open in Records" waiting if I want the whole list. What bugs me is the Spending calendar: I tap a day expecting to see those four records from 3 November and the screen just sits there, which is exactly the number I reach for when I'm checking whether I overspent; and when I go from the November Dashboard into Records it forgets I was looking at November and drops me at "All months", so I have to narrow it again. Tapping the same dead day twice felt like the app was ignoring me, and I'd want that fixed before I trust the calendar for a month-end check. If the day taps worked and Records remembered the month I came from, I'd happily keep this as my daily budgeting app.

**Coverage note:** 35 browser commands (including the initial `--help`) were used; the session was closed with `close` as the last one. Statements filters, the Back-to-close test, category-row/Income drill-downs, and switching the "Open as" mode were not reached — no claims are made about them.
