> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Aiden (20, student, easily overwhelmed, on his phone) — acceptance round 2

App: Finpoint at http://localhost:5180 (production build), viewport 390×844 (mobile),
session `p-aiden`, Dark theme chosen at the start, demo data loaded.
35 browser commands used, session closed at the end.

Screenshots are in this folder. Two of my captures (`04-may-2026-empty.png`,
`06-drilldown-open.png`) were overwritten by a second run that writes into the same folder,
so issues 1, 2 and 4 below are described from what I saw, without a screenshot.

---

## 1. Earlier findings (F9, F10)

### F9 — earlier overload
**PARTLY**

What I saw:
- The first screen is calmer than a wall of cards: one sentence
  ("You've spent $701.03 of your $2,450.00 plan. 21 days left."), then **one** grouped card
  holding the three attention items (13 unallocated Statements / 3 Pending Records /
  1 Pending Statement), then one card with the four metrics (Spent / Income / Left over /
  Saved this month). Screenshot: `01-dashboard-light.png`.
- But the page is still very long for one thumb. The full-page capture shows everything that
  follows: spending-scope selector, a forecast chart with a legend **and** two paragraphs of
  explanation, four budget rows plus more notes, a category-trend chart plus an explanation,
  the categories list with a note, five largest records, the spending calendar (30 cells plus
  a legend) and four "biggest changes" rows — a long scroll of charts and paragraphs with no
  obvious end. Screenshot: `03-dashboard-dark-full.png`.
- A toast "Demo workspace loaded." was also sitting on top of the page
  (`01-dashboard-light.png`).

So: the top of the Dashboard is grouped and readable, but the whole page is still a lot of
information, charts and explanatory text stacked back to back on a phone screen.

### F10 — past empty month
**FIXED**

What I saw:
- I opened the month picker (button "Nov 2026") and picked **May 2026**. The page switched to
  "May 2026 · Full month · SGD · Based on Record dates" and showed a single, calm card:
  **"No Records in May 2026."** with one button, **Import statements**. No charts, no numbers,
  no error, no spinner — everything below it was empty space.
  Screenshot: `05-may-2026-settled.png`.
- Coming back to a month with data also worked (the calendar and metrics returned), so moving
  backwards and forwards between months is not a dead end.
- Two smaller things I hit while doing it are filed below as issues 1 and 2.

Screenshot: `05-may-2026-settled.png`.

---

## 2. New issues

### Issue 1 — confusing — Month change briefly shows the old month's numbers under the new month's title
- **Where:** Dashboard, month picker (top of the page).
- **Steps:** Open the app on Dashboard → tap the "Nov 2026" month button → tap **May** in the
  picker.
- **Expected:** Numbers for May, or a loading/empty state, as soon as the title says May.
- **What happened:** The title changed to "May 2026 / Full month" straight away, but the body
  underneath still read **"You've spent $701.03 of your $2,450.00 plan. 21 days left."** —
  November's numbers and November's countdown — plus the same three attention items. Only after
  a few seconds (once I closed the picker) did "No Records in May 2026." appear. For a moment I
  thought May had spent $701.
- **Screenshot:** lost (see note at the top). What it should have looked like straight away:
  `05-may-2026-settled.png`.

### Issue 2 — nit — The month picker stays open after you pick a month
- **Where:** Dashboard month picker.
- **Steps:** Tap "Nov 2026" → tap **May**.
- **Expected:** The picker closes and I am left looking at May.
- **What happened:** May was selected and highlighted, but the picker stayed open over the page
  and I had to press Escape to get rid of it. Extra step on a phone.
- **Screenshot:** lost (see note at the top).

### Issue 3 — confusing — My Dark theme choice came back as Light
- **Where:** Whole app.
- **Steps:** At the start I opened the sidebar and chose **Dark** (moon selected, whole app went
  dark). It stayed dark for the rest of the session (`02-dark-theme.png`,
  `03-dashboard-dark-full.png`).
- **Expected:** It to stay dark.
- **What happened:** On my last load of the Dashboard the app was **light** again (white
  background, black buttons), with no warning. I would have to set it again.
- **Screenshot:** `07-dashboard-final.png` (light) vs `03-dashboard-dark-full.png` (dark, same
  page).

### Issue 4 — broken (could not fully confirm) — Tapping a day in the Spending calendar did not open anything I could see
- **Where:** Dashboard → Spending calendar (bottom of the page).
- **Steps:** Scroll to the Spending calendar → tap the cell "3 November: $132.43 spent across
  4 Records" (the tap was accepted by the page).
- **Expected:** A drill-down opens for that day (panel/peek with the day's records) whose header
  has the "Open as" menu.
- **What happened:** Nothing appeared in the part of the screen I could see, and when I asked the
  page for its "Open as" control right after the tap, **there was no such control anywhere on the
  page**. I tried the same tap again later with the same result. Because the calendar sits far
  down the page and I only had viewport screenshots at that moment, I can't 100% rule out a panel
  opening below the fold — but I never saw one and there was no "Open as" control in the page, so
  I could not switch to Side peek / Center peek / Full page, and I could not test closing with Esc
  or with Back. I also never got to try the other entry points (a category row, the Spent/Income
  metric).
- **Screenshot:** lost (see note at the top).

### Issue 5 — confusing — I ended up on the Records page without going there
- **Where:** From the Dashboard.
- **Steps:** After tapping day 3 (issue 4), the sidebar drawer was open on top of the Dashboard,
  I pressed **Escape** to close it, then looked for day 3 again.
- **Expected:** Back on the Dashboard with the calendar.
- **What happened:** The calendar days were gone; the next thing I saw was the **Records** page
  ("Records / Previous month / All months / Next month" plus its filter row). I had not tapped any
  link to get there. I can't explain how I got there — I only know I didn't choose to.
- **Screenshot:** none for that moment; I have the page structure as text only.

### Issue 6 — confusing — A November URL brought me back to May
- **Where:** Address bar / Dashboard month.
- **Steps:** While on Records I opened `http://localhost:5180/?month=2026-11`.
- **Expected:** November 2026 — the URL says so, and the same URL had shown November earlier in
  the session (that is how I got to day 3 the first time).
- **What happened:** The Dashboard came back on **May 2026** — the month I had picked earlier —
  with the month picker already open and the page in light theme, while the URL still said
  2026-11. The first time I used the same URL it showed November, so it is not consistent.
- **Screenshot:** `07-dashboard-final.png`.

### Notes from the same session (not filed as issues)

**Records filters — half answered.**
- The Records page has a filter row: search box, "Sort Records", **Any category**, **All budgets**,
  **Any treatment**, **Any status**, **Any date**, **Any amount**, and a **Clear** button.
- *Can I tell which are active?* Yes for the default case: with nothing chosen every control reads
  "Any …" and **Clear** is greyed out/disabled, so it is obvious nothing is filtering. I ran out
  of my 35 commands before I could apply a filter and see how an active one is marked, so I can't
  say whether an applied filter is equally obvious.
- *Can I clear one?* Not tested — no commands left after landing on that page.
- **Statements filters:** never reached (budget).
- Screenshot: none (page structure captured as text right after landing on it).

**Drill-down / "Open as":** not testable — see issue 4. No Side peek / Center peek / Full page
switch, no Esc close and no Back close could be exercised.

---

## 3. Would I keep using this?

Honestly, the first thing that made me relax was opening May — "No Records in May 2026" with one
button, no charts screaming at me, which was exactly what I wanted after last time's overload; if
every empty screen looked like that I'd happily keep going. But the real month is a scroll-fest of
charts and paragraphs, my dark mode silently flipped back to white mid-use, tapping a day on the
spending calendar did nothing I could see (so the one thing I actually wanted — "what did I spend
on the 3rd?" — never opened), and at one point I ended up on a Records page I never tapped.
Nothing crashed and nothing lied to me except the $701 still sitting under May's title, but I'd be
nervous that the next tap does nothing again. I'd keep it for now — it's local and it starts
calmly — but I'd stay near the top of the Dashboard and I'd want the calendar tap to open my day
before I trusted it with real money.
