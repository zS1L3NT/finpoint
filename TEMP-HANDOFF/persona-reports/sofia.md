> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Sofia — acceptance test report (insight drill-down, acceptance-2)

Persona: Sofia, 37, travels often. Wants the biggest expenses and what a trip cost (F3, F13d), and to compare a category against usual.

Setup notes: desktop viewport 1440×900, `--session p-sofia`, production build at http://localhost:5180. I used my full budget of 35 browser commands, then closed the session as instructed.
Screenshots I produced are `10-…`, `11-…`, `12-…`, `13-…`, `14-…`, `16-…` in this folder (the files `01-dashboard-dark.png` … `05-dashboard-full-after-esc.png` were already here when I started, they are not mine). My very first capture was written by the tool to `../sofia-run1/01-dashboard.png` because of where the browser daemon was started.

---

## 1. Earlier findings (F-ids)

### F3 — "No 'biggest expenses' answer, and no sort by amount": **PARTLY**

**What I saw**

- The Dashboard does answer "biggest expenses": a card lists the five largest Records in descending amount — FairPrice Run Sun 1 Nov −$83.84, CS Fresh Tue 3 Nov −$82.48, Sheng Siong Top-up Sat 7 Nov −$59.82, Birthday Gift Sun 8 Nov −$46.11, Don Don Donki Thu 5 Nov −$40.84 — with a "See all" button. Screenshot: `../sofia-run1/01-dashboard.png` (top of that same Dashboard; the list sits lower on the page) — the ordering itself is from my accessibility snapshot of that page.
- Clicking the **Spent $701.03** metric opens a drill-down ("Drill-down" → "Spent in November", 25 Records, "refunds subtracted · Includes Pending Records") that lists every Record grouped by category, each group ordered by amount (Bills & Utilities: −$30.00, −$19.98; Dining Out: −$38.45, −$38.12, −$35.96, −$14.50, −$13.26, −$9.11, −$7.34, −$6.92, −$6.00; Groceries: −$83.84, −$82.48, −$59.82, …). Screenshots: `10-spent-side-peek.png` (side peek), `11-spent-center-peek.png` (center peek), `12-spent-full-page.png` (full page).
- The Records page has a "Sort Records" combobox, but it read **"Newest first"** and I ran out of budget before opening it, so I cannot confirm that an **amount** sort exists.

**Verdict:** PARTLY — the "biggest expenses" answer is there and easy to find; "sort by amount" is unverified (I saw the sort control, not its options).

Screenshot paths: `10-spent-side-peek.png`, `11-spent-center-peek.png`, `12-spent-full-page.png`, `../sofia-run1/01-dashboard.png`.

### F13d — "No trips or tags": **PARTLY**

**What I saw**

- The Dashboard has trip-shaped affordances: a **Travel** budget row ("Travel $0.00 used · no plan"), a **Travel** chip in the Spending-forecast legend next to Total/Daily/Recurring/Irregular, and a link "**Custom-period Budgets · View Budgets**" under the budget cards. Screenshots: `10-spent-side-peek.png`, `11-spent-center-peek.png`, `12-spent-full-page.png` (all show that Dashboard area), `../sofia-run1/01-dashboard.png`.
- I never reached the Budgets page (budget), so I could **not** verify that a trip's cost can be read out — which is exactly my question ("what did the trip cost?").
- I saw **no tags** anywhere in the flows I used (Dashboard, drill-downs, Records).

**Verdict:** PARTLY — travel/custom-period budgeting is visibly offered from the Dashboard, but I could not confirm a trip total, and tags are absent (the spec says tags stay out of scope, so "partly" matches what was promised).

Screenshot paths: `10-spent-side-peek.png`, `11-spent-center-peek.png`, `12-spent-full-page.png`.

---

## 2. New issues

### 2.1 broken — Clicking a day in the Spending calendar does nothing

- **Where:** Dashboard → "Spending forecast" card → "Cumulative spending by day" calendar.
- **Steps:** Dashboard → scroll to the calendar → click the cell **"7 November: $138.03 spent across 5 Records"**. I tried twice: first by accessible name (`find … --name "7 November: $138.03 spent across 5 Records"`), then by the element reference taken from a snapshot taken immediately before (`click @e32`). Both clicks were accepted by the tool (✓ Done).
- **Expected:** a drill-down for that day (the same kind I got from the Spent metric), or at least some visible response.
- **What happened:** no drill-down appeared, the URL stayed `http://localhost:5180/`, and the page ended up back at the top of the Dashboard with the calendar scrolled out of view. The two screenshots taken after the two clicks are **pixel-identical** (ffmpeg difference = 0), so nothing on screen changed at all.
- **Screenshots:** `13-day-peek.png`, `14-day-peek.png` (identical).

### 2.2 confusing — "Open as" is a menu *and* a separate button, and it loses its label

- **Where:** drill-down header (any drill-down).
- **Steps:** Dashboard → click **Spent $701.03** → look at the header → open the **"Open as: Side peek"** menu → choose **Center peek** → open it again → choose **Full page**.
- **Expected:** one obvious control that tells me how the drill-down will open.
- **What happened:** the header has **two** controls: a dropdown labelled `Open as: Side peek` and a separate button labelled `Open as full page`. In center peek the dropdown collapses to an **icon only** (`11-spent-center-peek.png`), so I could no longer see the words "Open as" — I only knew what it was from the accessibility name. The three modes themselves work: Side peek opened on the right (`10-spent-side-peek.png`), Center peek opened as a centred card over a dimmed Dashboard (`11-spent-center-peek.png`), Full page navigated to `http://localhost:5180/drill?drill=metric%3Aspent` and rendered the drill as a full page with "← Back to Dashboard" (`12-spent-full-page.png`).
- **Also observed:** while a peek was open the URL stayed `http://localhost:5180/`; only Full page changed it. So browser **Back** cannot reopen or step back through a peek. (I did not get to run the Back test itself — see "Not tested" below.)
- **Screenshots:** `10-spent-side-peek.png`, `11-spent-center-peek.png`, `12-spent-full-page.png`.

### 2.3 broken — the tab went to a blank white page mid-session

- **Where:** after the second failed day click, while I was about to open a category row from the Dashboard.
- **Steps:** (no deliberate action) → `snapshot` returned **"no interactive elements"** → `get url` returned **`about:blank`**.
- **Expected:** still on the Dashboard.
- **What happened:** the page was a blank white screen with nothing in it; I had to navigate back to `/records` to continue. I cannot tell from the outside whether this was the app or my test browser, so I am reporting it as observed, not diagnosed.
- **Screenshot:** `16-state-check.png` (pure white, 1280×633).

### 2.4 confusing — the theme selector disagrees with itself between pages

- **Where:** sidebar theme radios (Light / Dark / System).
- **Steps:** Dashboard (first load) → sidebar showed **Dark** selected (page rendered dark) → full page load of `/records` → sidebar showed **System** selected, Dark not selected.
- **Expected:** the same selection in the same session.
- **What happened:** the selection moved from Dark to System after a page load. I had no screenshot budget left for the Records page, so this is an observation without a picture, and I can't say whether the on-screen theme changed with it.
- **Screenshot:** none (budget).

### 2.5 confusing — Filters on Records: state is readable, but there are a lot of them and I couldn't confirm clearing

- **Where:** `/records` filter row.
- **What I saw (one snapshot, no interaction — budget):** month button "All months", a search box ("Search title, people, location, description"), sort combobox "Newest first", then **"Any category"**, "All budgets", "Any treatment", "Any status", **"Any date"**, **"Any amount"**, and a **"Clear"** button that was **disabled**.
- **Expected:** a clear signal of what is currently filtering the list, and a way to switch one filter off.
- **What happened:** the inactive state *is* readable — every filter says "Any …" and Clear is disabled when nothing is active, which is a good sign that Clear turns on when something is. But there is no count/badge, "All budgets" reads like a value rather than a default, and I ran out of budget before I could activate a filter and clear it, so "can you clear one?" is **unanswered**.
- **Screenshot:** none (budget).

### Not tested (budget exhausted at 35 commands)

Stated plainly so nothing above is read as more than I saw:

- **Opening a drill-down from a category row** (e.g. "Groceries $333.29 48%") — my element lookup failed and I had no commands left.
- **Closing a drill-down with Back** (Esc only: from Full page, Esc returned the URL to `http://localhost:5180/`, i.e. the Dashboard I started from — that part worked).
- **Comparing a category against usual** by clicking one of the Dashboard's "… less/more than your 2-month average" cards (I only saw the cards: Healthcare −$51.13, Transport −$12.89, Dining Out +$10.47, Groceries −$8.65 vs 2-month average).
- **Statements filters** — I never reached Statements.
- **Applying and clearing a filter on Records**, and the **Sort Records** options.
- **Budgets / trip cost** and the **"Try demo data"** first-load prompt: on first load the Dashboard already had demo data and Dark selected, most likely because this browser session had been used before, so I never saw that prompt.

---

## 3. Would I keep using it?

Honestly, yes — for the money questions I actually care about it gets me most of the way: I can see my five biggest expenses at a glance, click the Spent number and get every record broken down by category, and I can switch that view from a side panel to a centred card to a full page, and Esc drops me back on the Dashboard exactly where I started. What stops me from fully trusting it is the day cells: I clicked 7 November twice expecting "what did I spend that day" and the app just politely did nothing, which made me wonder whether I was clicking the wrong thing. I'd also like the trip answer to be one click away instead of hunting through Budgets, and the Records filter row is a wall of "Any…" pills where I'd want a single "3 filters on" badge before I clear anything. If the day click gets fixed and I can see my trip total without a detour, this becomes the app I open every week; until then I'd keep using it for monthly spending and do trip maths by hand.
