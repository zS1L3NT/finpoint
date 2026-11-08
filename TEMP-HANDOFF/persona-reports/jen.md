> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Jen (45) — Insight drill-down & filters acceptance test

Session: `agent-browser --session p-jen`, desktop viewport 1440x900, production build at http://localhost:5180.
Setup done: clicked "Try demo data", switched the sidebar theme control to **Dark**. Budget: exactly 35 browser commands, then stopped.

Scope note: of the drill-down sources listed for me I only opened one — a **category row** ("Groceries ›") on the Dashboard. I did not reach a Spending-calendar day or the Spent/Income metric within the 35 commands, so I say nothing about those two.

---

## 1. Earlier findings (F-ids)

### F21 — "Workflows was vague" → **FIXED**

- I looked for the word "Workflows" everywhere I went in this session: the sidebar nav (Dashboard, Allocate, Records, Statements, Accounts, Budgets, Categories, Rules, Importer, Data, Settings), the Dashboard body, the Records page, the Statements page and the Allocate page. It does not appear anywhere — a case-insensitive text search of each page body returned 0 matches.
- The workspace it used to refer to is now named for the job: the Allocate page reads **"Allocation workspace"** with the line **"Allocate statements to records."**, and the sidebar item is simply **"Allocate"**. That is the kind of wording I asked for: it tells me what I'm going to do before I click it.
- Screenshots: `01-dashboard.png` (sidebar/nav wording), `09-records-active-filter.png`, `10-statements-filters.png` (no "Workflows" anywhere in those page bodies). I could not afford a screenshot of the Allocate page header itself — command budget was spent by then — so that one is reported from the text I read on the page in place.

### Standing check A — "Can I see at a glance which filters are on?" → **FIXED**

- On Records I set the category filter to Groceries. The pill changed from **"Any category"** to **"1 category"**, got a highlighted (lighter) border, an inline **×** ("Reset category filter"), and the row's trailing button changed from **"Clear"** to **"Clear 1"**. The URL also carried the state: `/records?category_ids=groceries`.
- Inactive pills keep the muted placeholder wording I expect ("Any treatment", "Any status", "Any date", "Any amount", "All budgets"), so active vs inactive reads differently by word, not just by colour — good for me, since colour alone is easy to miss.
- Screenshot: `09-records-active-filter.png`.

### Standing check B — "Can I clear them one by one?" → **FIXED**

- With only the category filter on, I clicked the inline **×** on that pill (its accessible name is "Reset category filter"). The pill went back to **"Any category"** and the URL back to `/records`, while the other pills were untouched — one filter cleared, nothing else reset.
- Screenshot: `09-records-active-filter.png` (state with the × present, before clearing). The cleared state I verified by reading the pill label and URL back in the page immediately afterwards; I had no command left for a second screenshot.

### Standing check C — "Do filter widths stay the same across Records, Statements and Allocate?" → **FIXED**

- Measured every filter control on the three pages:
  - **Records**: Sort, category, budgets, treatment, status, date, amount = **160 px each**; Clear = 160 px; search box = 384 px.
  - **Statements**: All Accounts, status, allocation, date, amount = **160 px each**; Clear = 160 px; search box = 384 px.
  - **Allocate**: All Accounts, status, date, amount = **160 px each**; Clear = 160 px; search box = 384 px.
- So the pills and the search box are identical width page to page. One cosmetic difference remains: Records has more filters than the other two, so its bar wraps to a second row ("Any amount" + "Clear"), while Statements and Allocate fit in one row — same widths, different silhouette. See New issue 5.
- Screenshots: `09-records-active-filter.png`, `10-statements-filters.png`. Allocate's numbers were measured on the page (no screenshot left in budget).

---

## 2. New issues

**1. confusing — Picking "Dark" the first time put me in Light — sidebar theme control**
- Where: sidebar bottom theme radio group (Light / Dark / System), Dashboard.
- Steps: demo data loaded → clicked the radio labelled **Dark** → took a screenshot.
- Expected: the app goes dark and "Dark" shows as selected.
- What happened: the app stayed light and **"Light"** was the selected radio. I clicked **Dark** a second time and it went dark correctly, and "Dark" stayed selected afterwards.
- Screenshot: `02-dark-dashboard.png` (light, after the first pick of Dark), `04-theme-dark.png` (dark, after the second pick).
- Caveat: this happened once, on the first attempt only; I can't rule out that my click landed on the neighbouring label.

**2. nit — The category filter dropdown stays open and covers the list — Records**
- Where: Records, filter row, category pill.
- Steps: Records → click the category pill ("Any category") → click "Groceries" in the list.
- Expected: the list closes (or at least stops covering the results), because I've made my choice and now want to read the filtered rows.
- What happened: the picker stayed open on top of the table with Groceries ticked; it hid the column headers and the first rows until I dismissed it. The filter itself applied correctly.
- Screenshot: `09-records-active-filter.png`.

**3. nit — Clicking the category name did nothing; clicking the row did — Dashboard, "Categories this month"**
- Where: Dashboard → Categories this month → "Groceries $333.29 48%".
- Steps: clicked the words "Groceries" in that row.
- Expected: the drill-down opens (the row looks like a link, it has a › chevron).
- What happened: nothing at all opened. Clicking the same row again (as a whole row) opened the drill-down normally.
- Screenshot: `05-drilldown-category.png` (after the first click — no drill-down), `06-drilldown-groceries.png` (after clicking the row).
- Caveat: my first click may have landed on a different element than the row itself, so I'd want this re-checked before it's called a bug.

**4. nit — The address bar doesn't record which "Open as" mode I chose — drill-down header**
- Where: drill-down header, "Open as" control (Side peek / Center peek / Full page).
- Steps: opened the Groceries drill-down, switched Side peek → Center peek, then Full page, reading the URL each time.
- Expected: either no URL change for a purely visual choice (fine), or the URL tells me which mode I'm in when I copy the link.
- What happened: opening the drill-down wrote `/?drill=category-gross%3Agroceries`, and switching modes left that URL untouched — side peek, center peek and full page all showed the identical address, so the bar can't tell me (or anyone I send the link to) which view they'll get.
- Screenshot: `08-center-peek.png` (center peek open; URL was the same as in full page — verified by reading `location` in the page).

**5. nit — Records' filter bar wraps where Statements' and Allocate's don't — filter row shape**
- Where: Records filter row vs Statements filter row.
- Steps: compared the two pages side by side in sequence.
- Expected: the same shape as well as the same widths, so my eye doesn't have to re-find the controls.
- What happened: every pill is 160 px everywhere (that part is right), but Records pushes "Any amount" and "Clear" onto a second line under the search box, while Statements and Allocate keep everything on one line. I have to re-learn where the row ends on each page.
- Screenshot: `09-records-active-filter.png` (two rows), `10-statements-filters.png` (one row).

**Not an issue (checked and fine): the "Clear" button when nothing is filtered.** On Statements with no filters it is visibly dimmed/greyed rather than looking ready to press — `10-statements-filters.png`.

**Drill-down close behaviour — no issue found:**
- **Esc** closed the drill-down and left me on the Dashboard at the same scroll position (I was at 900 px when I opened it, still at 900 px after Esc), URL back to `/`.
- **Back** (browser back) also closed it instead of leaving the app: URL went from `/?drill=category-gross%3Agroceries` back to `/`, drill-down closed, still at 900 px scroll — i.e. I landed exactly where I had been.
- Screenshots: `06-drilldown-groceries.png` (side peek), `08-center-peek.png` (center peek). Full page I opened and closed successfully but ran out of budget before photographing it.

---

## 3. Would I keep using this?

Yes — this is the first version where I don't have to hold the state of the app in my head. The filters tell me in words what is on ("1 category" instead of "Any category"), give me my own little × to turn just that one off without wiping the rest, and they sit at the same width on Records, Statements and Allocate so my eye isn't hunting around every time I switch pages; the drill-down from a category number opens where I'm standing, shows me the six receipts behind $333.29, and Esc or Back drops me back at the same spot in the list instead of throwing me to the top of the Dashboard, which matters when I'm matching a month's worth of statements after dinner. What I'd still mutter at: picking Dark took two goes the first time, the category picker sits on top of the rows I've just filtered so I have to shoo it away, and the link in my address bar won't tell my husband which view he'll get. None of those stop me paying the bills with it, so I'd keep it — and I'd keep using the drill-downs, which is more than I could say when "Workflows" meant nothing to me.
