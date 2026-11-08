> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Wei, 52, saver — usability test report

Finpoint, production build at http://localhost:5180, desktop 1440×900, **Dark** theme, demo data.
Testing stopped after exactly 35 agent-browser commands; the session was closed with `close`.

## 1. Persona findings (F-ids)

### F4 — "a green down-arrow on $0 read as good news" — **FIXED** (one residual nit)

What I saw on the Dashboard, "Biggest changes" card, first row:

- "Healthcare · $51.13 less than your 2-month average · **$0.00 ▼ $51.13**"
- I checked the computed colour of the ▼ glyph: it is a neutral light grey, and it is the **same colour as the ▲** on the "Dining Out" row underneath. So nothing there is green any more, and colour no longer tells me "this is good news" — the words do ("less than your 2-month average").
- Opening the row gives a drill-down, "Healthcare: November vs usual": **$0.00**, "0 Records · Spending · refunds subtracted · Includes Pending Records", "November $0.00 / Days 1-9" next to "2-month average $51.13 / Days 1-9 · Oct 2026, Sep 2026 / $102.26 ÷ 2 months", and the plain line "**No Records in this period.**" The zero is explained as "I didn't spend", not congratulated.

Residual nit: the row still leads with "$0.00 ▼ $51.13" in large type, so a quick glance can still land on "$0" before the sentence under it.

Screenshots: `wei/02-dashboard-mid.png` (the card), `wei/03-drilldown-peek.png` and `wei/05-center-peek.png` (the drill-down).

### F8 — same finding elsewhere — **PARTLY** (could not verify the original screen)

Everywhere I reached, the green-arrow-on-$0 pattern is gone:

- Dashboard metrics carry no arrows at all: "Spent $701.03 / $16.09 less than usual so far", "Income None yet / Usually ~$4,865.03 by day 25", "Left over —", "Saved this month $500.00".
- The $0 drill-down (above) has no arrow.
- Records and Statements list/filter views show no ▼/▲ on any figure.

I could not work out which screen F8 originally pointed at, and 35 commands did not stretch to Budgets, Accounts, Categories, Allocate, Statements detail, or the Spent/Saved metric drill-downs — so I cannot call F8 FIXED.

Screenshots: `wei/01-dashboard-dark.png`, `wei/07-records-filters.png`, `wei/08-statements-filters.png`.

## 2. New issues

### Issue 1 — **confusing** — browser Back does not take me back to the Dashboard

- **Where:** Dashboard → "Spending calendar" day cell → header "Open as" menu → "Full page".
- **Steps:** (1) Dashboard, scrolled down to "Spending calendar". (2) Click the **7 November** day cell ("$138.03 spent across 5 Records") — a drill-down opens. (3) In its header, open the **"Open as"** menu and pick **Full page**. (4) Press the browser **Back** button.
- **Expected:** back on the Dashboard, roughly where I was.
- **What happened:** the screen still showed a full-page "Drill-down — Spending on Sat 7 Nov / $138.03 / 3 Records" with a "← Back to Dashboard" link inside the card. I was not where I started; the in-page link was the only way out I found. (Contrast: closing the same kind of drill-down with **Esc** from a Side/Center peek *did* drop me straight back on the Dashboard — verified by the page heading "Dashboard" and my scroll position.)
- **Screenshot:** `wei/06-back-landing.png`

### Issue 2 — **confusing** — the "Clear" control in the filter bars looks disabled

- **Where:** Records filter row (left end of the second row) and Statements filter row (right end).
- **Steps:** (1) Open **Records** from the sidebar. (2) Look at the filter row. (3) Same on **Statements**.
- **Expected:** a control that resets my filters should look usable — or be hidden when there is nothing to clear, so it doesn't look like a broken button.
- **What happened:** on both pages "Clear" is drawn in very low-contrast grey with a small icon; at a glance it reads as disabled/broken rather than as "quiet until you filter something". My budget ran out before I could click it, so I can't say whether it works.
- **Screenshots:** `wei/07-records-filters.png`, `wei/08-statements-filters.png`

### Issue 3 — **nit** — the comparison drill-down talks like an accountant

- **Where:** "Biggest changes" → Healthcare row → drill-down.
- **Steps:** Click the Healthcare row on the Dashboard.
- **Expected:** plain words, e.g. "You spent nothing in this category this month; you usually spend about $51 by the 9th."
- **What happened:** "$102.26 ÷ 2 months" and "Labels show Record titles found on only one side. The average divides spending by the included months." — I had to read it twice to be sure what the average was dividing.
- **Screenshot:** `wei/03-drilldown-peek.png`

### Issue 4 — **nit** — "Left over" shows a bare dash instead of a value

- **Where:** Dashboard, third metric tile in the Spent / Income / Left over row.
- **Steps:** Load the demo data and look at the metrics.
- **Expected:** a value I can read as a value ("$0.00" or "Not yet known"), or the tile left out entirely.
- **What happened:** the tile shows a big **—** with "Waiting for income" in small text under it; until I read the small print the tile looks empty. ("Income — None yet" reads fine, because it says the words.)
- **Screenshot:** `wei/01-dashboard-dark.png`

### Filters: the two questions I was asked, answered honestly

- **Can I tell which are active?** On arrival, nothing is active on either page, and each control prints its own current value, so I *can* tell: Records shows "All months" (top right), "Newest first", "Any category", "All budgets", "Any treatment", "Any status", "Any date", "Any amount"; Statements shows "All Accounts", "Any status", "Any allocation", "Any date", "Any amount". There is no separate "filters applied" summary or chip, and I never got a filter applied within my 35-command budget, so I cannot say how obvious an *applied* filter would look.
- **Can I clear one?** Not answered. With nothing active, "Clear" looked disabled (Issue 2), and I ran out of commands before I could set a filter and then clear it. I did not want to guess.

## 3. Would I keep using it?

Honestly, yes — the two things I open this app for are right there on the first screen: **$500.00 saved this month**, and "Spent $701.03 · $16.09 less than usual so far", which tells me in one glance that I am not overspending. The drill-downs are the part I've grown to like: clicking the $0 Healthcare row told me straight away it was "No Records in this period" instead of leaving me staring at a zero, and the "Open as" choice means I can blow a detail up to the middle of the screen without losing the page behind it. Esc always puts me back exactly where I was, which I appreciate. What nearly annoyed me: after opening a day's spending full page, the browser's Back button left me on another detail screen instead of my dashboard, and I had to hunt for "Back to Dashboard"; and the greyed-out "Clear" button on Records made me worry my filters were stuck. I'd also like "$102.26 ÷ 2 months … divides spending by the included months" written the way a person talks. None of that stops me — I'd keep using it, and I'd recommend it to my brother, provided those three things get tidied up.

---

### Run notes (not app findings)

- Exactly **35** agent-browser commands were used (including 3 that errored and 1 that closed the session); no further browser commands were issued.
- **Scope I did not reach:** the Spent / Income / Left over / "Saved this month" metric drill-downs, applying and clearing a filter on Records or Statements, Budgets / Accounts / Categories / Allocate / Statements detail, and the mobile viewport.
- Screenshots were taken with the CLI's relative paths while the working directory was renamed mid-run (`wei/` → `wei-run2/`), so they were written to `wei-run2/` and then copied to `wei/`; identical copies exist in both folders. A concurrent run of this same task left `02-dashboard-full.png` and `03-dashboard-full.png` in `wei/` — those are not mine.
