> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Leo — Insight drill-down acceptance test (acceptance-2)

Persona: Leo, 31, Travel budget with no plan. Desktop 1440x900, dark theme, demo data, production build at http://localhost:5180. 35 browser commands used (35th = the screenshot after Esc); session closed afterwards.

## 1. Persona earlier findings (F-ids)

### F13c — "Travel $1,229 of $0.00 over" confusing → **FIXED**
Dashboard → Monthly budgets, the Travel row now reads **"$0.00 used · no plan"**. There is no more "of $0.00 over" arithmetic to decode. The other rows use plain wording: Daily "$604.94 of $1,800.00 · $1,195.06 left", Recurring "$49.98 of $250.00 · $200.02 left", Irregular "$46.11 of $400.00 · $353.89 left". The panel also states "Total spending $701.03 · incl. $0.00 not in any Monthly Budget."
Screenshot: `04-monthly-budgets.png`

### F15 — Pending explanation → **FIXED**
The Dashboard opens with three banner rows that explain the numbers in one line each:
- "13 unallocated Statements — Totals may be low until these are allocated."
- "3 Pending Records — Not yet matched to a Statement."
- "1 Pending Statement — Bank activity waiting for confirmation."

I clicked "3 Pending Records": it took me straight to Records with the **Pending** filter already applied (chip highlighted, X on the chip, "Clear 1"), and every row carries an amber **Pending** badge plus "$0.00 of $6.00 allocated" / "Statement not confirmed yet". Nothing about "Pending" left me guessing.
Screenshots: `05-pending-records.png`, `06-records-cleared.png`

## 2. New issues

### 2.1 — "Open as" menu options not reachable / not visible — severity: **confusing**
- **Where:** Drill-down header (top-right of the peek), Dashboard → Spent metric.
- **Steps:** Dashboard → click the **Spent** metric (opens "Spent in November" side peek, `08-drilldown-sidepeek.png`) → in the peek header there are three icon buttons (an expand arrow, a panel icon with a chevron, and an ✕) → I clicked the control the accessibility tree matched as **"Open as"** (command returned success) → I then looked for the **"Full page"** option → *Element not found*.
- **Expected:** a menu offering Side peek / Center peek / Full page, as described.
- **What happened:** no "Full page" text was findable after opening it; the header buttons are icon-only with no visible "Open as" label, so I could not tell what the middle control did. I ran out of my 35-command budget before I could inspect further, so I could not switch the open mode or screenshot the menu.
- **Screenshot:** `08-drilldown-sidepeek.png` (peek header, top-right)

### 2.2 — Records result count says "3 of 3" while many more rows are listed — severity: **confusing**
- **Where:** Records page, footer under the table, right after clearing the Pending filter.
- **Steps:** Dashboard → click "3 Pending Records" (Records opens filtered) → click **Clear** → read the footer.
- **Expected:** a count that matches the rows now shown (the list went back to all records — Today 3, Yesterday 4, Fri 6 Nov 1, …).
- **What happened:** the footer still read **"Showing 3 of 3 records."** while the table visibly listed at least nine records across three day groups. The filter chips had already reset ("Any status", greyed-out "Clear"), so the list and the count disagreed in the same view. (Captured in the frame right after the click; I had no commands left to re-check whether it corrects itself.)
- **Screenshot:** `06-records-cleared.png`

### 2.3 — The Travel budget isn't on the Budgets page — severity: **nit**
- **Where:** Budgets page (`Budgets` in the sidebar).
- **Steps:** open Budgets and look for the Travel budget I see on the Dashboard.
- **Expected:** to find Travel alongside the other budgets.
- **What happened:** the page shows only **"Ended · 2"** (October Daily, Tokyo Trip). The monthly budgets from the Dashboard (Daily, Recurring, Irregular, Travel) are not listed anywhere on it, so from here Travel looks like it doesn't exist. The Dashboard links it to "Custom-period Budgets · View Budgets", which is a different list.
- **Screenshot:** `02-budgets.png`

### 2.4 — Filter observations on Records and Statements (asked directly)
**Records — easy to read, easy to clear.** With the Pending filter active the control is unmistakable: the status chip is highlighted with an ✕ on it, and the **Clear** button carries a count badge **"1"**. Clicking **Clear** reset everything to "Any status" and the badge disappeared; the ✕ on the chip alone would also have worked. No ambiguity about which filter is on.
**Statements — clear at rest.** All controls read "All Accounts / Any status / Any allocation / Any date / Any amount" and **Clear** is greyed out, so it is obvious nothing is active. I did not have commands left to apply a Statements filter and clear it again, so I can only speak to the resting state.
Screenshots: `05-pending-records.png`, `06-records-cleared.png`, `07-statements-filters.png`

### 2.5 — Drill-down open/close behaviour (asked directly)
- **Opened from a number:** clicking the **Spent** metric ($701.03) opened a right-hand **side peek** titled "Spent in November" with the total, "25 Records · Spending · refunds subtracted · Includes Pending Records", a category breakdown, and an "Open in Records" button. Screenshot: `08-drilldown-sidepeek.png`
- **Esc:** reopened it and pressed Esc → panel gone, I was back on the Dashboard with the Spent metric still focused. Screenshot: `09-after-esc.png`
- **Back:** pressed the browser Back while the peek was open → the CLI reported the resulting URL as **`http://localhost:5180/`**, i.e. the Dashboard, where I had started from. So Back also lands me where I was. (I had no commands left to screenshot this step.)
- **Open as:** see 2.1 — not completed within budget.

## 3. Would I keep using this?

Honestly, yes — the stuff that used to annoy me is fixed. The Travel budget no longer tells me I'm "$1,229 of $0.00 over", it just says "$0.00 used · no plan", and the Pending banners actually explain what the numbers mean before I have to ask. Clicking "3 Pending Records" and landing on a filtered list with the filter clearly marked, plus a Clear button with a "1" on it, is exactly what I want; I never had to guess what was on. The drill-down from the Spent number is useful too, and Esc and Back both put me back where I was, which matters because I bounce around a lot. What holds me back is small: I still can't find the Travel budget on the Budgets page, the Records footer claimed "3 of 3 records" while showing a screenful of them, and the "Open as" control in the peek header is three unlabelled icons I couldn't make sense of. None of those would stop me paying bills in here, but the count line and the icon-only header are the kind of thing that makes me double-check the app instead of trusting it.
