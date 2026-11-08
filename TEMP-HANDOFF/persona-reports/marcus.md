> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Marcus usability test — Finpoint (insight drill-down acceptance 2)

Setup: desktop viewport 1440×900, production build at `http://localhost:5180`, agent-browser session `p-marcus`. Dark theme was already selected on first load (the sidebar theme switcher shows "Dark" checked), so every screenshot below is Dark. I never saw a "Try demo data" prompt — the Dashboard was already populated on first load.

## 1. Earlier persona findings (F-ids)

### F5 — "Income $0" next to a red shortfall read as debt: **FIXED**

What I saw on the November 2026 Dashboard:

- The Income tile no longer says "$0". It reads **"None yet"** with the context line **"Usually ~$4,698.19 by day 25"**.
- The tile next to it, "Left over", reads **"— / Waiting for income"** instead of a red shortfall figure.
- The page headline is neutral and answers my "am I OK this month?" question directly: **"You've spent $655.01 of your $2,450.00 plan. 21 days left."** No red number anywhere near income, so I no longer read it as debt.
- Clicking the Income tile opens a drill-down headed "Income in November — $0.00" with the caption **"0 Records · Spending, refunds subtracted · Includes Pending Records"**, which explains the zero rather than leaving it bare.

Screenshot: `01-dashboard.png` (tiles + headline), `02-income-drilldown.png` (drill-down).

**Residual nit:** the drill-down itself still leads with a large bare "$0.00" — see Issue 2 below.

### Drill-down behaviour I checked for this session (supports the F-list follow-up)

- **Open as menu works.** The drill-down header has an "Open as: Side peek" dropdown with three radio items — Side peek (checked), Center peek, Full page. Choosing **Center peek** re-flowed the same content into a centred card over the Dashboard with no reload. Screenshot: `03-center-peek.png`.
- **Esc closes and puts me back where I was.** Esc closed the peek; I was on the Dashboard at the same scroll position, URL unchanged (`http://localhost:5180/`). Screenshot: `04-after-esc.png`.
- **Back closes and puts me where I was.** From the Full page view I pressed browser Back and landed on the Dashboard at the same scroll position (top of the page, where I had been), URL `http://localhost:5180/`. Screenshot: `08-after-back.png`.
- **Full page mode** renders the top bar as "Drill-down" with the content as a card containing "← Back to Dashboard". Screenshot: `07-full-page.png`.

## 2. New issues

### Issue 1 — Clicking a day in the Spending calendar doesn't show that day (broken)
- **Where:** Dashboard → Spending forecast → day cells ("7 November: $138.03 spent across 5 Records", "8 November: $132.25 spent across 4 Records").
- **Steps:** (1) Click the "7 November" day cell. (2) Screenshot. (3) Click the "8 November" day cell. (4) Screenshot again, then re-check the page.
- **Expected:** a drill-down for that day's spending — e.g. "$138.03 spent across 5 Records".
- **What happened:** clicking 7 November opened nothing at all — plain Dashboard (`05-day-drilldown.png`). Clicking 8 November did open a panel, but it was a centre peek titled **"Income in November — $0.00"** (the Income metric's drill-down), not the day's $132.25 of spending — and by my next check the panel was gone again (`06-after-day-click.png`). The cells promise specific numbers I never got to see.
- **Screenshots:** `05-day-drilldown.png`, `06-after-day-click.png`.

### Issue 2 — Income drill-down still leads with a bare "$0.00" (nit)
- **Where:** Dashboard → Income tile → drill-down header.
- **Steps:** Click the Income tile; read the panel.
- **Expected:** the zero explained in plain words (my old F5 worry) rather than a bare figure.
- **What happened:** the tile itself is fixed ("None yet / Usually ~$4,698.19 by day 25"), and the caption under the drill-down's "$0.00" does explain it ("0 Records · Spending, refunds subtracted · Includes Pending Records") — but the first thing my eye lands on is still a big "$0.00". Much better than before; one big number away from fully plain-English.
- **Screenshot:** `02-income-drilldown.png`.

### Issue 3 — Full page drill-down is a small card floating in an empty page (ugly)
- **Where:** Drill-down header → expand icon ("Open as full page").
- **Steps:** Open the Income drill-down → click the expand icon.
- **Expected:** a full-page view that uses the space and makes the way back obvious.
- **What happened:** the top bar changes to just "Drill-down" and the content is one small card ("← Back to Dashboard", "Income in November", "$0.00", "Open in Records") centred in a mostly black screen; the only exit is the small "Back to Dashboard" link inside the card. It works, but it feels like an unfinished page.
- **Screenshot:** `07-full-page.png`.

### Issue 4 — Search filter didn't narrow the list when I looked (confusing)
- **Where:** Records page → search box ("Search title, people, location, description").
- **Steps:** (1) Open Records (full list, "Clear" button disabled). (2) Type "Spotify" into the search box. (3) Screenshot immediately.
- **Expected:** the list narrows to Spotify records.
- **What happened:** the search box held "Spotify" and the Clear button changed from a disabled "Clear" to an active **"Clear 1"** (badge = 1 active filter), but the rows under it were still the full unfiltered list (Grab Ride, Birthday Gift, Stuff'd — none match "Spotify") at the moment I screenshotted. I had no browser-command budget left to look again a second later, so I can't tell whether it was still loading/deferred or genuinely not filtering.
- **Screenshots:** `09-records-filter-active.png`. (The before-filter state — "Clear" disabled — I saw in the accessibility snapshot of the same page load, not in a separate screenshot.)

### Issue 5 — Forecast sentence uses app jargon (nit)
- **Where:** Dashboard → "Spending forecast" card.
- **Steps:** Read the forecast line under the heading.
- **Expected:** plain words telling me what the rest of the month looks like (I'm a freelancer; I want to know if I'm OK).
- **What happened:** "You usually spend $2,258.59 more after 9 November, plus any scheduled Records." The number is useful, but "plus any scheduled Records" is app vocabulary I'd have to decode; the sentence stops short of saying whether that lands me inside my $2,450.00 plan.
- **Screenshot:** `01-dashboard.png`.

### Filters: what I could and could not check (budget note)
- **Records — active filters are visible.** With nothing set, the filter row reads "Newest first / Any category / All budgets / Any treatment / Any status / Any date / Any amount" and the **Clear button is disabled**. After typing a search term the Clear button becomes enabled and shows a count badge **"Clear 1"**, so I can tell a filter is on. Screenshot: `09-records-filter-active.png`.
- **Records — clearing: not confirmed.** I ran out of my 35-command budget on my next click (my "Clear" lookup missed the button because its label now reads "Clear 1"), so I did not verify that clearing restores the list.
- **Statements — not tested.** The budget ran out before I reached the Statements page, so I have no observations about its filters.
- Also not reached within budget: a drill-down from a **category row** (e.g. Groceries) and from the **Spent** tile; only the Income tile and the day cells were opened.

## 3. Would I keep using this?

Mostly yes, cautiously. As Marcus — paid irregularly and late in the month — the Dashboard finally answers my real question without me reading red numbers as debt: I've spent $655.01 of my $2,450.00 plan with 21 days left, income is "None yet" but "Usually ~$4,698.19 by day 25", and "Waiting for income" tells me why "Left over" is a dash — that's the reassurance I wanted, and the drill-down captions ("0 Records · refunds subtracted") explain the zeros instead of leaving me guessing. What would make me hesitate is trust in the details: I clicked 7 November and nothing happened, clicked 8 November and got an "Income $0.00" panel instead of that day's spending, so I'd stop believing the calendar's numbers until that's fixed. The full-page view feels empty, and I never got to Statements or to confirm the Clear button actually clears before my time ran out. If the day click is fixed, I'd use this daily; until then I'd use it for the monthly overview only.
