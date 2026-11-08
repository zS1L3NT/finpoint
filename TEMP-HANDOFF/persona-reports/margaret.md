> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Margaret — acceptance test report (insight drill-down)

Persona: Margaret, 68, retiree, not technical, reads slowly.
App: Finpoint at http://localhost:5180 (production build), desktop viewport 1440x900, Dark theme.
Method: agent-browser CLI, session `p-margaret`, hard budget of 35 browser commands (spent in full).

Note on setup: when I loaded the app it came straight up with demo data already there and Dark
already selected, so I never saw a first-load / "Try demo data" screen — that state was carried
over from an earlier run in this environment. Everything below is what I saw in this session.
Screenshots are in this folder: `.scratch/insight-drilldown/acceptance-2/margaret/`.

## 1. Earlier findings (F3, F7, F9)

### F3 — "no biggest expenses answer" — FIXED
The Dashboard now answers the question in two places, both sorted biggest-first and both in plain
words:
- "Categories this month": Groceries $307.07 47%, Dining Out $163.66 25%, Transport $88.19 13%,
  Bills & Utilities $49.98 8%, Gifts & Donations $46.11 7% — each with a coloured share bar.
- "Largest Records — Top five Spending Records by amount": FairPrice Run −$83.84, CS Fresh
  −$82.48, Sheng Siong Top-up −$59.82, Birthday Gift −$46.11, Don Don Donki −$40.84.
I did not have to hunt for it: it is on the Dashboard, titled in words I understand.
Screenshot: `01-dashboard-dark.png` (full-page capture, both cards visible).

### F7 — jargon — PARTLY
Much plainer than before, but jargon still leaks through.
Plain now: the top line "You've spent $655.01 of your $2,450.00 plan. 21 days left."; metric labels
Spent / Income / Left over / Saved this month; "$62.11 less than usual so far"; "Waiting for
income"; "Top five Spending Records by amount"; calendar helper "Stronger colour means more
spending. Select a day to see its total and open its Records."
Still jargon for me: "12 unallocated Statements — Totals may be low until these are allocated";
"Cumulative spending · SGD"; "Dashed lines extend each budget's gross spending pace and include
scheduled Records"; "All budgets · $655.01 expenses · $0.00 refunds = $655.01 spending";
"Shares exclude refunds"; the drill-down subtitle "22 Records · Spending · refunds subtracted ·
Includes Pending Records"; on Records, "Ledger view", "Any treatment", "Any status".
Screenshots: `01-dashboard-dark.png`, `04-spent-drill.png`, `10-records-filters.png`.

### F9 — too much on screen — PARTLY
Better hierarchy, but it is still one very long screenful. A single full-page capture shows, top to
bottom: month header, plan sentence, three alert rows (unallocated Statements / Pending Records /
Pending Statement), four metric cards + "Saved this month", a scope selector, the Spending forecast
chart with legend and two paragraphs of small print, Monthly budgets (4 plans + three lines of
notes), Categories this month, Category trend (stacked bars + a 3-line caption), Largest Records,
Spending calendar (30 cells), Biggest changes. I lost my place halfway down and had to scroll back.
What helps: one plain answer sentence at the top, clear card headings, and drill-downs that move
detail off this screen (side peek / full page).
Screenshot: `01-dashboard-dark.png`.

## 2. New issues

### N1 — Spending calendar day does nothing; the view jumps to the top — broken
- Where: Dashboard → "Spending calendar" card.
- Steps: scroll to the calendar → click the "7 Nov" cell (labelled "7 November: $138.03 spent
  across 5 Records"). I tried it twice, from two different scroll states.
- Expected: the card's own instruction says "Select a day to see its total and open its Records" —
  I expected a drill-down for that day, like the one I got from the Spent card.
- What happened: no panel, no new page, no change in the address bar; the Dashboard ended up
  scrolled back to the very top. Identical result on both attempts. In the same session, clicking
  the "Spent" metric opened its drill-down immediately, so drill-downs themselves work.
- Screenshots: `02-day-click.png` (after attempt 1), `03-day-drill.png` (after attempt 2).

### N2 — After Esc closes the drill, Back brings it straight back — confusing
- Where: drill-down opened from the Spent metric, switched to "Full page".
- Steps: open drill → Open as → Full page → press Esc (Dashboard returns, focus ring lands back on
  the Spent card) → press the browser Back button.
- Expected: I had closed it, so Back should take me on to where I was before all of this.
- What happened: Back re-opened the very drill I had just closed — address bar showed
  `/drill?drill=metric%3Aspent`. The closed drill stays in my history, so one Back feels like it
  "undoes" my close and I would have to press Back twice to get out.
- Screenshots: `07-after-esc.png` (Dashboard, after Esc), `08-after-back.png` (drill re-opened,
  after Back).

### N3 — "Open in Records" click did not move me — confusing (could not fully verify)
- Where: full-page drill-down ("Spent in November"), bottom button "Open in Records".
- Steps: clicked "Open in Records".
- Expected: land on the Records list, presumably narrowed to these records.
- What happened: the click was reported as accepted but the view did not change — I was still on
  the drill page (screenshot `09-records.png`).
- Honest caveat: in this session my text-based clicks also failed to navigate the sidebar "Records"
  link, while clicking that same element directly did navigate. So this may be my tooling rather
  than the app; I only got one attempt at it before the command budget ran out.
- Screenshot: `09-records.png`.

### N4 — Records filters: what I could and could not tell — nit
- Where: Records page filter row.
- Observed: every control announces its own value, so at default I could tell nothing was
  filtered — "Newest first", "Any category", "All budgets", "Any treatment", "Any status", "Any
  date", "Any amount", and the month control top-right reads "All months". The "Clear" button sits
  on a second row and looks greyed out, so I could not tell whether it was usable.
- Not tested: I ran out of my 35 commands before I could switch a filter on, so I never saw what an
  *active* filter looks like, and never pressed Clear — I cannot answer "can you clear one?" from
  experience.
- Screenshot: `10-records-filters.png`.

### Coverage limits (honest gaps, not app findings)
- Statements page: not reached — the budget ran out first, so I have nothing to report about its
  filters.
- "Open as": I saw and opened the menu, which lists Side peek (tick), Center peek, Full page in
  plain words, and I switched Side peek → Full page. I did not get to select Center peek.
- Category-row drill-down: not attempted (I used the Spent metric instead).
- Session was closed with `agent-browser close` after the 35th command.

## 3. Would I keep using it?

Yes, mostly — but I would use it in a narrow way. The things I actually want are there now: one
plain sentence telling me what I have spent against my plan, a "Categories this month" list that
answers my biggest-expenses question without me asking twice, and a "Largest Records" top five in
words I understand, and clicking the Spent number opens a tidy list that gives focus back when I
press Esc. What makes me hesitate is the sheer length of the Dashboard — it goes on and on with
small print about "gross spending pace" and "refunds excluded" that I skim and then feel guilty
about skipping — plus "unallocated Statements" and "Ledger view" and "Any treatment" are words my
bank never uses. Twice I clicked something the screen told me to click and nothing happened (a day
in the calendar), and once I closed a page with Esc and then pressed Back and it came back at me,
which would have made me think the computer was being cheeky. If the first screen told me one
thing plainly and the calendar day actually opened, I would keep it on the kitchen tablet and
check it every morning.
