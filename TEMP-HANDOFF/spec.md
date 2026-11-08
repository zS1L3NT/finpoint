> ⚠️ TEMPORARY handoff copy (see TEMP-HANDOFF/HANDOFF.md). Delete the whole TEMP-HANDOFF/ folder before PR #48 leaves draft.

# Spec: Insight and drill-down

Status: draft spec. Decisions in §13 need the user before tickets are split out.
Owner: design and orchestration by Opus; implementation by delegates, one ticket each.
Scope: all of Finpoint. Parts that don't fit may be removed, not only the Overview tab.

## 0. How to use this plan

This plan follows the main flow from `/ask-matt`, adapted to this repo:

1. **Settle decisions first** (§13). Facts are the agent's job; decisions are the user's. Every
   open question carries a recommendation, so a "yes" settles it.
2. **Prototype what needs seeing.** The container for the drill-down (docked inspector, overlay or
   bottom sheet) is a UI question that paper can't settle. Ticket 00 is a throwaway prototype on a
   `prototype/drilldown-panel` branch, kept as a primary source.
3. **Split into tracer-bullet tickets** under `.scratch/insight-drilldown/issues/NN-slug.md`, each
   with acceptance criteria and a `Blocked by` field (§12 is the draft breakdown).
4. **Implement one ticket per fresh context**, driven test-first, closed with `/code-review`
   (Standards and Spec).
5. **Re-run the personas** on a production build as the acceptance test (ticket 19), then `/retro`.

Repo constraints that shape the plan:

- **Branches:** every branch comes off `main`, with no stacking, and a PR is opened only when the
  user asks. A ticket whose blocker hasn't merged waits; it doesn't build on an unmerged branch.
- **Shared helper APIs:** AGENTS.md requires asking before a meaningful API shape change. Unifying
  chart click props (§8.3) is one, so it is decision D4.
- **Records page:** no blocking loaders, no skeletons, and filters live in URL params.
- **Vocabulary:** `CONTEXT.md` is canonical. Record, Statement, Allocation and Monthly Budget stay;
  plain-language help is added beside them, never in place of them (§10).
- **Hard-to-reverse decisions** get an ADR through `/domain-modeling`: the `drill` URL schema
  (§7.2) and the pacing model (§7.4).

## 1. Sources and how much to trust each

| Round | What | Trust |
| --- | --- | --- |
| R1 | 3 agents, one at a time, with goals and step counts (earlier in this thread). Baseline findings B1–B6 come from Opus's summary; the raw reports aren't in this checkout. | Medium |
| R2 | 10 Haiku personas with screenshots (Marcus, Priya, Dana, Margaret, Tyrone, Sofia, Jen, Aiden, Leo, Wei). | Medium for perception. **Low for "click does nothing"**: the dev server compile stalled navigation. |
| V | My own check on a production build (`next start`), 2026-11-03. Evidence is in `.scratch/dashboard-usability/evidence/`. | High |
| Sol | A partial long session (`.scratch/usability-drilldown/sol/report.md`). | High for what it observed. No claims of absence. |
| Opus | Source-grounded drill-down recommendations (`.scratch/usability-drilldown/opus/recommendations.md`). | High for the domain model; design is opinion. |

**Lesson for every future usability run:** test against `next build && next start`, never
`next dev`. The first navigation to a route compiled for over a minute and produced false "dead
click" findings.

## 2. The problem in one paragraph

Finpoint computes good numbers but makes them hard to question. Every number on the dashboard is
an answer without its working. The paths to the working exist, but they are:

- **invisible:** rows don't look clickable;
- **inconsistent:** three different behaviours for "click a number";
- **destructive:** they leave the chart, drop the scope and lose the scroll position;
- **one-directional:** there is no quick way from a Record to the Statements that back it, or back.

Around that core, the dashboard is crowded (about 10 equal-weight cards, four of them day-axis
charts). Some numbers look wrong when they aren't (income $0 next to a red shortfall), and one
really is misleading (the forecast paces day-1 rent across the whole month).

## 3. Findings ledger: keep, change, drop

Each finding gets a verdict:

- **Keep (fix):** a real issue, fixed in this plan.
- **Absorb:** solved by another item.
- **Drop:** not real, already solved, or out of scope. The reason is given.

| ID | Finding | Evidence | Verdict | Resolved by |
| --- | --- | --- | --- | --- |
| F1 | No clear path from a number to the Records behind it | All of R2, V, Sol | **Keep: core** | Drill-down (§5) |
| F2 | Hand-off to Records loses scope, scroll and chart | R2 (Dana, Tyrone), B3 | **Keep** | Drill-down stays on page. Scope carries over. |
| F3 | No "biggest expenses" answer, and no sort by amount | R2 (Margaret, Sofia) | **Keep** | Largest Records card plus amount sort |
| F4 | Comparing months needs memory. Comparison windows are unlabelled. | R2, Sol, B5 | **Keep** | Compare mode in the drill-down, window labels |
| F5 | Income $0 next to a red shortfall reads as debt or a bug | R2 (5 personas) | **Keep** | State-aware summary copy |
| F6 | Forecast paces day-1 rent across the month ($14,000 on a $1,800 plan) | V, B6, Sol | **Keep: logic** | New pacing model (§7.4) |
| F7 | Jargon (Irregular, unallocated, surplus rate, pace…) | All of R2 | **Keep** | Definitions in place, plainer sub-labels |
| F8 | Green ▼ on "$0 Groceries" reads as good news | R2 (4 personas) | **Keep** | Words over glyphs, neutral colour mid-month |
| F9 | Overload: no headline, no "what next" | R2 (Aiden, Margaret, Jen) | **Keep** | Headline and attention list. Cut cards (§4.1). |
| F10 | Empty month looks broken | R2 (5 personas) | **Keep** | Whole-page empty state |
| F11 | On mobile the answer is three screens down | R2 (Priya, Tyrone) | **Keep** | New mobile order |
| F12 | Two totals on one screen differ ($3,322.77 vs $3,320.27) | R2 (Dana) | **Keep: investigate first** | Reconciling line |
| F13a | Spending forecast caption typo "Records.Hold" | V | **Keep** | Copy fix |
| F13b | "New" in Monthly budgets reads as "new record" | R2 (Tyrone) | **Keep** | Label "New Monthly Budget" |
| F13c | "Travel $1,229 of $0.00 · over" | R2 (Leo) | **Drop** | Zero is a valid amount (`CONTEXT.md`), and a null amount already shows "no plan". |
| F13d | No trips or tags | R2 (Leo, Sofia) | **Absorb, partly** | Custom-period **Budgets** already model trips. The dashboard links Budgets active in the month (§4.1). Tags stay out of scope. |
| F13e | No savings goal | R2 (Wei) | **Drop for now** | A new domain concept. Noted for a separate idea thread. |
| F14 | Allocated amount hidden on mobile Records rows | Sol | **Keep** | `AllocationProgress` on both layouts |
| F15 | "Pending" read as "unpaid". The reason is never stated. | B2, Sol | **Keep** | Pending reason in drill-down rows |
| F16 | Split Statements look like duplicates (Mobile Plan $17.62 + $11.74 = $29.36) | Sol | **Keep** | Two-way Allocation rows with "of" amounts |
| F17 | Unsure whether to type spending as negative | B1 | **Keep** | Money out / Money in control in the Record editor |
| F18 | Budget remaining isn't self-evident | B4. Sol saw "$708.34 left". | **Change to discoverability** | Budget rows "spent of plan · left", donut removed |
| F19 | Weekday chart, Spending by day, Surplus/Shortfall chart, investment row add load and little insight | Inventory (§4.1) | **Keep: remove or merge** | §4.1 |
| F20 | Two ledgers: Records and Monthly Records | Inventory | **Keep: merge (D6)** | §4.3 |
| F21 | "Workflows" in the sidebar is vague (Jen went there for bills) | R2 (Jen) | **Keep** | Rename to "Allocate" (D7) |
| — | Dead clicks, blank pages, lost demo data, "Compiling…" badge | R2 | **Drop** | Dev-server and test-browser artifacts (§1) |
| — | Category picker won't open on mobile, previous month does nothing | R2 (Tyrone, Aiden) | **Drop** | Not reproduced on the production build. Re-check in ticket 19. |

## 4. Target information architecture

### 4.1 Dashboard (Overview): section by section

| # | Today | Verdict | Becomes |
| --- | --- | --- | --- |
| 1 | DemoOffer banner above $0 cards | **Change** | A whole-page empty state when the workspace has no activity. If this month is empty but earlier months aren't: "Nothing recorded in November yet · Go to October". |
| 2 | Summary band: Income, Spending, Surplus/Shortfall, Surplus rate (4 metrics) | **Change** | 3 metrics: **Spent**, **Income**, **Left over**. The rate moves into Left over's detail line ("26% of income"). The copy depends on state (§6.4). Each metric opens a drill-down. |
| 3 | Review chips (Pending Records, unallocated Statements, unbudgeted) | **Merge** | Into the **Attention list** under the headline (§6.5). |
| — | Nothing | **New** | **Headline**: one factual sentence (§6.5). |
| 4a | Spending forecast: chart plus 4 pace tiles | **Keep and change** | The chart stays (with the fixed pacing, §7.4). The 4 tiles become one plain line: "At this pace about $2,960 of $3,150 by 30 Nov · busiest day 1 Nov ($1,440) ›". Its legend chips double as the scope switch. |
| 4b | Monthly budgets: donut ("Segment size = planned share…") plus cards | **Change** | Drop the donut. Keep one row per Monthly Budget: name · bar · "$1,400 of $1,800 · $400 left". A row opens its drill-down; Edit stays as a trailing button. "New" becomes "New Monthly Budget". |
| 5a | Categories this month | **Keep** | Rows open the drill-down (no page change), with a visible chevron. |
| 5b | Category trend (5 months) | **Keep** | It is the multi-month answer (Leo). A month bar opens that month's drill-down. |
| 6a | Spending calendar | **Keep** | The single day picker. A day opens the drill-down at once (no footer, no second click). |
| 6b | Biggest changes | **Keep and change** | Words, not arrows: "$47 more than usual (avg $40)". A row opens the drill-down in compare mode. |
| 7 | Surplus / Shortfall chart | **Remove** | The summary band sparklines already show the trend. |
| 8 | Spending by day (bars) | **Remove** | It duplicates the calendar plus the forecast (four day-axis charts → two). |
| 9 | Spending by weekday | **Remove** | Interesting but not actionable. No persona used it. |
| 10 | Saving and investment movements (4 metrics incl. "Net withdrawals / income") | **Change** | One compact "Saved this month $500 ›" row that opens its drill-down. The four-metric block goes. |
| — | Nothing | **New** | **Largest Records** card (top 5, scope-aware) beside the calendar. |
| — | Nothing | **New** | "Budgets this month" line (custom-period Budgets overlapping the month, e.g. "Tokyo Trip $1,229 ›") inside the Monthly budgets card footer. This answers "what did my trip cost". |

The result is about 7 sections instead of 10. Every number answers "why?" in one click.

### 4.2 Desktop layout (xl, ≥1280px)

```
┌ Sidebar ┐┌───────────────────────────── main ──────────────────────────────┐┌ Drill-down (420px, docked) ┐
│         ││ Monthly overview · November 2026         ◀ Nov 2026 ▶            ││ Spending on Sun 1 Nov    ✕ │
│ Dash    ││ ──────────────────────────────────────────────────────────────── ││ $1,440.31 · 4 Records      │
│ Records ││ You've spent $1,530 of your $3,150 plan. Rent is most of it.     ││ All budgets · Spending     │
│ Stmts   ││ 27 days left.                                                     ││ ────────────────────────── │
│ …       ││ ⚠ 3 Statements not allocated yet ›   ● 1 Pending Record ›         ││ ▸ Monthly Rent   −1,400.00 │
│         ││ ┌ Spent ───────┐┌ Income ──────┐┌ Left over ───┐                  ││   Housing · Recurring      │
│         ││ │ $1,530 ↑$10 ││ None yet     ││ —            │                  ││ ▾ Grab            −19.46   │
│         ││ └──────────────┘└──────────────┘└──────────────┘                  ││   Transport · Daily        │
│         ││ ┌ Spending forecast ─────────────┐┌ Monthly budgets ────────────┐ ││   └ One Card · 1 Nov       │
│         ││ │  ▁▂▃ chart  (day 1 selected ●) ││ Daily     ███░░  $114 of 950 │ ││     $19.46 of $19.46 ✓     │
│         ││ │ About $2,960 of $3,150 by 30 Nov││ Recurring ████░ $1,400 of 1,8│ ││ ▸ Starbucks        −4.77   │
│         ││ └────────────────────────────────┘└─────────────────────────────┘ ││ ▸ Concert Ticket  −16.08   │
│         ││ ┌ Categories ──┐┌ Calendar ──────┐┌ Largest Records ─┐            ││ ────────────────────────── │
│         ││ │ Housing  91% ›││ [1]● 2  3  …  ││ Monthly Rent 1,400›│           ││ Total            $1,440.31 │
│         ││ └──────────────┘└────────────────┘└───────────────────┘           ││ Open in Records ↗          │
└─────────┘└───────────────────────────────────────────────────────────────────┘└────────────────────────────┘
```

- The drill-down **docks** like a macOS inspector: the main column narrows and nothing is covered,
  so the selected mark stays visible. Clicking another mark swaps the panel's contents.
- md–lg: the same panel overlays the right edge without a scrim, and the page scrolls the selected
  mark into the free area.
- The final choice between these is ticket 00 (D1).

### 4.3 The (month) shell and the two ledgers (D6)

**Today:** Overview and Monthly Records are tabs in one shell. Monthly Records is the Records
ledger for one month with the same filters. `/records` is the all-time ledger with "Open in
Records" between them. That makes two ledgers with near-identical filter bars.

**Recommendation:**

- Retire the Monthly Records tab once the drill-down ships. Its jobs move:
  - "Records in a month" → the Records page with month navigation (the same `◀ Nov 2026 ▶` control
    and `month`/`year` params);
  - "explain a number" → the drill-down.
- `/records/monthly` redirects to `/records?month=…&year=…`, keeping every param, so old links and
  history entries still work.
- The Overview loses its tab strip and becomes "Dashboard" again. The shell keeps the title and
  month navigation without remounting (AGENTS.md).
- This is close to a one-way door: it changes URLs and an established tab. Hence D6, ticket 17, and
  last in order, after the drill-down has proved it covers the tab's uses.

### 4.4 Records, Statements and the Allocation links between them

| Screen | Change |
| --- | --- |
| Records (`/records`), Monthly Records until retired | Each row gets an **expand chevron** that shows its Allocations inline (one level, read-only). The amount column shows `AllocationProgress` ("$7.27 of $14.55 allocated") on desktop and mobile. Add **sort by amount**. A row title still opens Record details. |
| Statements (`/statements`) | Mirror: a chevron shows the Records the Statement funds, plus any unallocated remainder. |
| Record details (`/records/[id]`) | Keep for deep links and editing. Its Statements table uses the shared Allocation rows ("of" amounts, pending reason). |
| Statement details (`/statements/[id]`) | Mirror, plus "View on Dashboard" for each funded Record (opens the drill-down for that day). |
| Allocate (`/allocator`, today "Workflows") | Rename the sidebar label (D7). From any unallocated row in the drill-down, an "Allocate…" action deep-links here with the ids prefilled. |
| Record editor dialog | Replace sign guessing with a **Money out / Money in** segmented control; the amount field takes a positive number (F17). |

## 5. The drill-down: behaviour

### 5.1 One rule

**Clicking any number, mark, row or segment opens the drill-down for exactly that number.** The
same gesture works everywhere. Re-scoping the dashboard becomes an explicit action inside the
panel ("Show the dashboard for Daily only"), and it stays in the scope select.

### 5.2 Selections

| Selection | Opened from | Header | Rows |
| --- | --- | --- | --- |
| `day` | Calendar day, forecast chart day, "busiest day" link | "Spending on Sun 1 Nov" | Records that day in the measure |
| `category` | Categories rows, Biggest changes, trend breakdown rows | "Housing in November" | Records in that category |
| `budget` | Monthly budget row, forecast legend chip | "Daily in November · $114 of $950" | Records in that Monthly Budget, plus the budget sum line |
| `month` (+category) | Category trend month bar | "September 2026" (or "Travel in Sep") | Records that month |
| `metric` | Summary metrics (Spent, Income, Left over, Saved) | "Spent in November" | Records making up the metric, grouped by category |
| `largest` | "See all" in Largest Records | "Largest Records in November" | Sorted by amount |
| Attention work lists | Pending Records, Pending Statements, unallocated Statements | Filtered Records or Allocate/Statements page | These rows navigate to the work list; budget and unbudgeted Attention rows open the Dashboard Drill-down. |
| `compare` | Biggest changes row | "Dining Out: November vs usual" | Two columns. Records unique to one side are marked. |

All selections respect the current month and scope. The header **always** names the measure and
its inclusion rules in one muted line: "Spending · refunds subtracted · Pending Records counted".

### 5.3 Inside the panel

- **Total row:** the last row equals the clicked number to the cent. It is computed by the same
  logic as the chart, never re-summed in the UI (§7.1).
- **Record rows:** icon · title · category · Monthly Budget badge · amount, with a pending
  **reason** when pending:
  - "Statement not confirmed yet" (allocated to a Pending Statement);
  - "$7.28 not allocated yet" (allocated sum ≠ amount);
  - "No Statement yet" (no Allocations).
- **Expand a Record (one level):** its Allocations, each "One Card · 1 Nov · **$12.40 of $49.60**",
  plus "Shared with 2 other Records" when the Statement is split.
- **Pivot (not nested expand):** clicking a Statement in an expanded row turns the panel to that
  Statement: its Records, the unallocated remainder, and the account. A breadcrumb shows
  "Sun 1 Nov › Grab › One Card statement" with a Back button. Pivots go **one level deep**: a
  further click replaces the focus and doesn't stack.
- **Actions:** open the Record editor (the panel stays and reflects edits live), "Allocate…",
  "Open in Records ↗" (same filters), and for `budget`, "Show the dashboard for Daily only".
- **Never add Statements into totals.** Statement amounts are evidence. Only Record amounts are
  summed (Opus, §7.1).

### 5.4 Leaving and returning

- `Esc`, the ✕ button, clicking the selected mark again, or browser Back closes the panel.
- Closing returns focus to the mark that opened it. Scroll and scope are untouched.
- The panel state is in the URL (`drill`, `focus`), so reloads and shared links reopen it.

## 6. Design specification (`/apple-design` applied)

> Amended 2026-11-08 (ticket 33): the docked 420px panel in section 4.2 is replaced by the Drill modes of ADR 0003. The drill opens as an overlay (side peek 480px, centre peek up to 720px, or the `/drill` page) and never reflows the Dashboard. Mobile keeps the bottom sheet.

### 6.1 Principles in this design

| Apple principle | How it shows up |
| --- | --- |
| **Familiarity:** same look, same behaviour | One gesture (click = drill-down) for every number. Every clickable number shows the same chevron or underline on hover and the same pressed colour. |
| **Wayfinding:** where am I, how do I get out | The panel header names the question. A breadcrumb shows pivots. ✕, Esc and Back always work. |
| **Grouping and mapping** | The panel docks beside the content it explains. The selected mark stays highlighted, so the link between them is visible. |
| **Simplicity, not minimalism** | Fewer cards (§4.1), one headline, inclusion rules shown. Adding context (the "of" amounts) simplifies understanding. |
| **Agency and forgiveness** | Inspecting is read-only and changes nothing. Editing stays explicit and goes through the existing editor. |
| **Direct, specific labels** | "Spending on Sun 1 Nov", "Allocate", "New Monthly Budget", never "Details" or "Workflows". |
| **Feedback: status, completion, warning, error** | Attention items carry the warning kind. A pending reason is status. An edit made from the panel updates the total in place (completion). |

### 6.2 Motion

All values come from `src/lib/motion.ts` (STYLE.md: shared presets, ≤300ms timed, springs from
presets).

| Interaction | Behaviour | Value |
| --- | --- | --- |
| Press on a mark or row | Highlight on **pointer-down**, commit on release. Rows change colour only (STYLE.md: no scale). | instant colour, `DURATION.instant` |
| Panel open (desktop docked) | Slides in from the right edge. The main column width follows on the same spring. | `SPRING.snappy` (0.3s, bounce 0) |
| Panel close | **Same path out**, to the right (spatial consistency). | `SPRING.snappy` |
| Select another mark while open | **Interruptible retarget**: the panel never closes and reopens. Content cross-fades, and the total animates with `value-swap.tsx`. | `TRANSITION.fast` |
| Selected mark | Stays highlighted. Other marks dim to about 45% opacity, which hints at the link to the panel. | `TRANSITION.base` |
| Expand a Record row | Height springs open, the chevron rotates 90°. | `SPRING.snappy` |
| Pivot to a Statement | Pushes left. Back pushes right (path symmetry). | `TRANSITION.base` |
| Mobile sheet | Rises from the bottom and exits to the bottom. Drag tracks 1:1 from the grab point. On release, projects momentum (`d = 0.99`) to choose a detent or dismiss. Rubber-bands past the top detent. | `SPRING.lively` only after a flick, otherwise `SPRING.snappy` |
| Chart resize when the panel docks | Charts resize **without** replaying the 450ms data intro. The intro plays once per data context (existing rule). | n/a |
| Reduced motion | Slides and springs become opacity cross-fades. No dimming animation. | `TRANSITION.fast` |

### 6.3 Surfaces and materials

- **Desktop panel: non-modal, no scrim** ("separate to keep flow"). It is a parallel task, not a
  modal one. Use a solid card surface with a soft left shadow; never stack translucent layers. The
  sticky header uses a scroll-edge fade, not a hard border.
- **Mobile: bottom sheet with two detents.** At medium (about 55%) the chart peeks above. Large is
  about 92%. A light scrim appears only at the large detent.
- `prefers-reduced-transparency`: no blur, solid surfaces. `prefers-contrast: more`: a defined
  border on the panel.

### 6.4 Copy and state

| Where | State | Copy |
| --- | --- | --- |
| Income metric | No income this month, but income in past months | "None yet · usually ~$4,500 by the 25th" |
| Income metric | No income ever | "None recorded · Add income ›" |
| Left over | Month in progress and income not in | "—" in neutral colour, with "Waiting for income". **Never red mid-month without income.** |
| Left over | Income in | "$1,181 · 26% of income" |
| Spent delta | Month in progress | "$10 more than usual so far". Neutral colour; red/green only for over/under **plan**. |
| Biggest changes | Any | "$47 more than usual (avg $40 over the same days)". The window is always named. |
| Category trend | Any | "Full months, and this month so far". The window is always named. |
| Forecast | Any | "At this pace about $2,960 of $3,150 by 30 Nov". The pacing explanation sits behind a definition (§6.6). |

All copy follows STYLE.md: sentence case, British spelling, `pluralize` for counted nouns.

### 6.5 Headline and attention list

- **Headline:** a template only, no generated prose. It is built from three facts:
  1. spent of plan ("You've spent $1,530 of your $3,150 plan.");
  2. the largest share ("Rent is most of it."), only when one category is ≥50%;
  3. the time left ("27 days left.") or month status ("November closed $210 under plan.").
- **Attention list:** at most 3, ranked:
  1. a Monthly Budget over plan;
  2. unallocated Statements ("totals may be low until these are allocated");
  3. Pending Records (with the reason);
  4. unbudgeted spending.

  Budget and unbudgeted rows open their drill-down; work-list rows (Pending Records, Pending Statements, unallocated Statements) open their filtered list, as §9 keeps those links. This replaces the review chips row.

### 6.6 Definitions in place

A `Term` component gives a dotted underline. Hover or tap shows one plain sentence plus an
example. Sources:

- `CONTEXT.md` definitions, rewritten for users (Record, Statement, Allocation, Pending Record,
  Monthly Budget, Treatment, Unbudgeted).
- Metric definitions (Left over, pace).

It is used in panel headers, metric labels, filter labels (Treatment) and budget rows. This keeps
canonical terms while removing the jargon wall (F7).

### 6.7 Accessibility

- Chart marks are real buttons with labels ("1 November, $1,440.31 spent across 4 Records"), using
  a roving tabindex and arrow keys across marks.
- The desktop panel is `role="region"` with `aria-labelledby` its header. The mobile sheet is
  `role="dialog"`. On open, focus goes to the header; on close, it returns to the mark.
- Expandable rows use `aria-expanded`. The total is announced through a polite live region on
  retarget.
- Amounts are always readable as words or signs, never by colour alone (Money out / Money in).
- Mobile targets are at least 44px.

## 7. Data and logic

### 7.1 Measures (correctness is the feature)

Each chart shows a specific **measure**, and the drill-down must filter by the same one or totals
won't reconcile (F12, Sol §3 found Monthly Records includes a $500 contribution that overview
spending excludes).

- Name the measures already computed by `src/logic/analytics.ts` / `dashboard.ts`:
  - `spending` (net of refunds);
  - `gross_spending`;
  - `outflow` (category mix);
  - `income`;
  - `contributions`.
- Every chart declares its measure, and every selection carries it.
- New `src/logic/drilldown.ts`: `getDrilldown({ month, year, scope, selection })` returns
  `{ title, measure, rules, total, rows, groups? }`. It **reuses** the dashboard's record selection
  and summarising helpers (export the minimum from `dashboard.ts`), so `total` is computed exactly
  as the dashboard number was.
- Record rows reuse `enrichRecords` (it already provides `allocated_amount`, `statement_count` and
  `pending_statement_count`), which is enough to derive the pending reason with no extra queries.
- Expanded Allocations reuse `getRecord` / `getStatement` (`RecordDetail.statements[].pivot`,
  `StatementDetail.records[].pivot`), loaded with `useLiveQuery` only on expand.
- Add a pure `pendingReason(record)` helper in `src/logic/records.ts` so the table, panel and
  detail page share one implementation (STYLE.md: one implementation per domain rule).

### 7.2 URL schema (ADR)

| Param | Values | Example |
| --- | --- | --- |
| `drill` | `day:<yyyy-mm-dd>`, `category:<id>`, `budget:<id>`, `month:<yyyy-mm>[,category:<id>]`, `metric:<name>`, `largest`, `attention:<kind>`, `compare:<category id>` | `?month=November&year=2026&scope=all&drill=day:2026-11-01` |
| `focus` | `record:<id>` or `statement:<id>`. One pivot only. | `&focus=statement:abc` |

- Each change is a `router.push`, so browser Back steps through it.
- `month`, `year` and `scope` stay where they are today (`useMonthParams`).
- Invalid values close the panel silently. They never error.

### 7.3 Largest Records, amount sort, reconciliation

- `largest` returns the top N Records by absolute amount for the measure and scope.
- Records table: add a client-side amount sort to `paginated-data-table.tsx` / `record-columns.tsx`
  if its pagination allows, or a `sort` URL param in `listRecords`. Pick whichever matches the
  existing pagination path; check before choosing.
- **F12 investigation first:** find what the $2.50 between category rows and budget totals is
  (likely refunds or unbudgeted spending). Then show one reconciling line wherever two totals sit
  together: "incl. $2.50 not in any Monthly Budget".

### 7.4 Forecast pacing (ADR, D3)

**Today:** `buildProjection` in `src/logic/dashboard.ts` uses
`dailySpending = summary.gross_spending / elapsedDays` and adds `dailySpending × remainingDays`.
Day-1 rent is projected as a daily habit, so the forecast says $14,000 on an $1,800 plan.

| Option | How | Verdict |
| --- | --- | --- |
| A. History-shaped | projected = spent so far + scheduled + the average of what past included months spent **from this day to month-end** (scaled to the month's length). Rent falls on day 1 in past months too, so it never repeats. | **Recommended.** No new concepts, it handles any lumpy pattern, and it explains itself ("you usually spend $1,430 more after the 3rd"). |
| B. Fall back to trimmed pace | When there is no history: pace = median daily spending of elapsed days, so one big day doesn't multiply. | **Use as a fallback** for A |
| C. Skip "recurring" Monthly Budgets | Exclude budgets named Recurring from the pace | **Reject.** Monthly Budget names are user data, not semantics. |

- Domain tests: day-1 rent with no history; rent with 2 months of history; a mid-month big
  purchase; a future month; a completed month.
- The comparison window must match the existing `COMPARISON_MONTHS` rule.

## 8. Components: reuse, extend, create

### 8.1 Reuse as-is

`Card`, `Badge`, `Button`, `Tooltip`, `Sheet` (Radix: `modal={false}` for the md–lg overlay),
`ScrollArea`, `MonthlyBudgetBadge`, `Icon`, `value-swap.tsx`, `useHistory` (`handlePush` for
"Open in Records"), `useMonthParams`, the `rowEnter` row motion, `DataTable` / `PaginatedDataTable`
plus `mobileRow`, and `RecordEditorDialog`.

### 8.2 Extend

| Component | Change |
| --- | --- |
| `RecordAmount` | Replace the cryptic `[$7.27]` with `AllocationProgress` ("$7.27 of $14.55 allocated") on both layouts. |
| `record-columns.tsx`, `statement-columns.tsx` | Expand column plus a sub-row render (`AllocationRows`), and an amount sort. |
| `DataTable` | Optional `renderExpanded(row)`. TanStack `getCanExpand`/`getIsExpanded` is the library default; no hand-rolled state. |
| `MetricGrid` / `Metric` | An optional `onSelect`, and a state-aware `detail`. |
| `MonthlyBudgetUsage` | Drop the donut and keep the rows. `onSelect` opens the drill-down. |
| `CategoryMovers` | Word deltas, neutral colour mid-month. |
| Record editor form | A Money out / Money in segmented control (`toggle-group.tsx`). |

### 8.3 Chart click contract (D4: shared helper API shape change)

**Today** there are three shapes:

- `recordHref(id, at)` → Link (categories, trend, movers);
- `onSelect(date)` → navigate (calendar `openDay`, `total-spending-chart`, `daily-spending-chart`);
- `onSelect(budgetId)` → set scope (budget usage).

**Proposed:** one prop, `onDrill(selection: Selection)`, on every chart. The page owns what a
drill does (push `drill=`). Charts become simpler and consistent, and tests can assert a single
behaviour. AGENTS.md requires asking before this change.

### 8.4 Create

| New | Purpose | Location |
| --- | --- | --- |
| `DrillPanel` | The container: docked (xl), overlay (md–lg), sheet (mobile). Header, breadcrumb, body, footer. | `src/components/drill-panel.tsx` |
| `DrillRecordRow` | A Record row with pending reason and expand. | in `drill-panel.tsx` unless reused by tables |
| `AllocationRows` | Allocation list for either direction: "$12.40 of $49.60", shared-with chip, remainder row. **Reused by** the panel, the Records/Statements expand and both detail pages. | `src/components/allocation-rows.tsx` |
| `AllocationProgress` | "X of Y allocated", used in tables and the panel. | `src/components/allocation-progress.tsx` |
| `Term` | Inline definition. | `src/components/term.tsx` |
| `Headline`, `AttentionList` | Top-of-dashboard summary. | in `app/(month)/page.tsx` (page-scoped, STYLE.md) |
| `LargestRecords` | Card. | `src/components/charts/largest-records.tsx` |
| `useDrill()` | Reads and writes `drill`/`focus` and exposes `open(selection)`, `pivot(focus)`, `close()`. | `src/hooks/use-drill.ts` |

## 9. Removals (dismantling)

| Remove | Why | Care needed |
| --- | --- | --- |
| Spending by weekday card plus `weekday-bars.tsx` | Not actionable. No persona used it. | Delete its tests. Remove its `weekday` field from `getDashboard` if nothing else reads it. |
| Spending by day card (`daily-spending-chart.tsx`) | Duplicates the calendar and forecast | Only `app/(month)/page.tsx` imports it (checked) |
| Surplus / Shortfall chart (`total-spending-chart.tsx`) | The summary band sparklines carry it | Only the dashboard imports it (checked) |
| Monthly budgets donut | "Segment size = planned share" is unreadable for users | Keep the rows |
| 4 pace KPI tiles | Replaced by one forecast line | Keep the data in `getPaceView` |
| Saving and investment 4-metric block | Jargon ("Net withdrawals / income") | Replaced by the "Saved this month" row plus its drill-down |
| Review chips row | Merged into the Attention list | Keep the same deep links as drill-down actions |
| Monthly Records tab (D6) | A second ledger, and the drill-down covers its job | A redirect keeps all params. Last ticket. |
| Calendar footer "View Records" button | The day opens the drill-down directly | — |

Every removal drops its dead logic, types, tests and graph entries in the same ticket. Edited tests
are named in the ticket report (AGENTS.md).

## 10. Vocabulary (D5)

- Add **Drill-down** to `CONTEXT.md`: "The panel that lists the Records behind a number on the
  Dashboard, and their Allocations." _Avoid_: inspect panel, breakdown, details.
- Records, Statements and Allocations keep their names in the UI. Plainness comes from `Term`
  definitions and sub-labels, e.g. "Statement" with "from your bank" on first appearance in the
  panel.
- "Workflows" becomes **Allocate** in the sidebar (D7): the page's actual job, in canonical
  vocabulary.
- "Total shortfall/surplus" becomes **Left over**. "Total surplus rate" is folded into Left over.
  Check `CONTEXT.md` has no conflicting term, and add "Left over" if it becomes a recurring label.

## 11. Task step counts: today vs target

Counts are clicks or taps after the dashboard has loaded, from R2 and V.

| Task | Today | Target |
| --- | --- | --- |
| Which Records made this day's total? | 3 + a page change (calendar, View Records) or 6+ by filters (Dana) | **1** (click the day) |
| Which Records are in this category? | 1 + a page change, chart lost | **1**, chart stays |
| Which Records are in this Monthly Budget? | ~4 (Records tab, budget filter); a card click re-scopes instead | **1** |
| What was my biggest expense? | ~6 (amount filter workaround) | **0** (Largest Records) |
| Which bank activity backs this Record? | 2 + a page change; Sol failed | **1** (expand) |
| Which Records does this Statement fund? | 2 + a page change | **1** (expand) |
| Why is this Record pending? | Not answerable | **0** (reason shown) |
| How is this category vs usual? | ~4 + memory (flip months) | **1** (Biggest changes row) |
| What did the trip cost? | Budgets page, hard to find | **1** (Budgets line in the dashboard) |
| Get back to where I was | Back to overview, scope and scroll lost | **1** (Esc/Back), state exact |

These become the acceptance criteria for ticket 19.

## 12. Delivery: tracer-bullet tickets

Each ticket is a vertical slice: logic + UI + tests. No PRs (user, 2026-11-07): all tickets land as
commits on one branch, `ai/insight-drilldown`, cut from `main`, in dependency order, one ticket at a
time in the shared checkout. The prototype lives on its own branch `ai/drilldown-prototype` and is
never merged.

| # | Ticket | Phase | Blocked by |
| --- | --- | --- | --- |
| 00 | **Prototype** the docked drill-down (D1) and the mobile sheet: retarget, Record row expand to Statements, pivot with breadcrumb, new dashboard order. Throwaway, on a `prototype/drilldown-panel` branch, no PR. Output: the user previews it and answers D8 plus any layout notes. | P0 | — |
| 01 | **Day drill-down end-to-end:** `drilldown.ts` with `day` and measures, the `drill` param and `useDrill`, `DrillPanel` (chosen container), calendar day → panel, close/restore, domain test (panel total = calendar total for every demo day), core e2e plus animation test. | P0 | 00, D4 |
| 02 | **Pacing model** (§7.4) plus forecast line copy, with domain tests. | P0 | D3 |
| 03 | **Allocation rows:** `AllocationRows`, `AllocationProgress`, `pendingReason`. Used on the Records/Statements expand and both detail pages. Mobile parity (F14). | P0 | — |
| 04 | **Category and trend drill-downs:** categories, trend month bars and breakdown rows, Biggest changes (non-compare). The `onDrill` contract applied to these charts. | P1 | 01 |
| 05 | **Budget drill-down:** budget rows and forecast legend. Donut removed. "Show the dashboard for…" action. "New Monthly Budget" label. | P1 | 01, D2 |
| 06 | **Record expand and Statement pivot inside the panel:** `focus` param, breadcrumb, Back, path-symmetric motion. | P1 | 01, 03 |
| 07 | **Edit from the panel:** open the Record editor, live total update, return focus. "Allocate…" deep link. | P1 | 06 |
| 08 | **Summary band rework:** 3 metrics, state-aware copy, metric drill-downs, "Saved this month" row (removes the investment block). | P1 | 01 |
| 09 | **Term definitions** plus copy pass (F7, F13a) and the `CONTEXT.md` additions (D5). | P1 | D5 |
| 10 | **Biggest changes in words**, comparison window labels, compare-mode drill-down. | P1 | 04 |
| 11 | **Headline and Attention list**, replacing the review chips. | P2 | 01, 08 |
| 12 | **Largest Records card** plus Records amount sort. | P2 | 01 |
| 13 | **Remove** Spending by day, Surplus/Shortfall chart, weekday card, pace tiles, calendar footer button. | P2 | 01, 02 |
| 14 | **Empty states:** whole-page start state, "Go to October" for an empty month. | P2 | — |
| 15 | **Mobile:** section order, sheet detents, drag-to-dismiss (D8). | P2 | 01 |
| 16 | **F12 reconciliation:** investigate, then add reconciling lines. Custom-period Budgets line in the Monthly budgets footer. | P2 | 01 |
| 17 | **Retire the Monthly Records tab:** month navigation on Records, redirect with params, shell without tabs (D6). | P3 | 04, 05, 12 |
| 18 | **Money out / Money in** in the Record editor (F17), the sidebar rename "Allocate", and moving Duplicates and Replace pending under Statements with redirects (D7, §13.1). | P2 | — |
| 19 | **Acceptance:** re-run the 10 personas plus Sol's 12 goals on a production build; compare step counts with §11; triage new findings. | P3 | all P0–P2 |

**Critical path:** 00 → 01 → (04, 05, 06, 08) → 07/10/11 → 17 → 19. Tickets 02, 03, 14 and 18
can run in parallel from day one.

**Per ticket, done means:**

- logic in `src/logic/*`, never in UI;
- `bun test` passes, with a new domain test for any logic;
- the touched browser test files pass on desktop and mobile;
- a new browser test file joins exactly one CI group in `.github/workflows/ci.yml`;
- animation tests run alone;
- `bun lint:check` and `bun types:check` are clean;
- `graphify update .` is run, and the `graphify-out/` files are included;
- every new feature is documented (D5): new terms in `CONTEXT.md`, ADRs in `docs/adr/`, user-visible
  behaviour in README or in-app copy;
- edited tests are named in the report;
- the ticket records its evidence and is set to `resolved`.

## 13. Decisions (answered 2026-11-07)

| # | Decision | Answer |
| --- | --- | --- |
| D1 | Drill-down container on desktop | **Docked inspector**: the main column narrows, nothing is dimmed. Below xl the same panel is a bottom sheet. |
| D2 | Monthly Budget row click opens the drill-down; re-scoping becomes an action inside it | Yes (recommendation taken) |
| D3 | Pacing: history-shaped projection (A) with trimmed-pace fallback (B) | Yes. Record it as an ADR. |
| D4 | Unify chart click props into one `onDrill(selection)` | Yes (recommendation taken) |
| D5 | Vocabulary and docs | Document everything needed. **Every new feature is documented properly**: terms in `CONTEXT.md`, hard choices in `docs/adr/`, user-visible behaviour in README and in-app copy. Part of every ticket's done-definition. |
| D6 | Retire the Monthly Records tab, last ticket | Yes (recommendation taken) |
| D7 | Rename "Workflows" → **"Allocate"** | Yes, **and** move Duplicates and Replace pending out, because they are Statement cleanup, not Allocation. See §13.1. |
| D8 | Mobile drag-to-dismiss | Ship without drag first; decide after the prototype (recommendation taken) |
| D9 | Remove weekday, Spending by day, Surplus/Shortfall charts | Remove (recommendation taken) |

### 13.1 D7 follow-up: where Duplicates and Replace pending go

Both pages change Statements only (merge duplicate imports; swap a Pending Statement for its imported
twin). They move under **Statements** as tabs: `Statements · Replace pending · Duplicates`
(`/statements`, `/statements/pending`, `/statements/duplicates`), with redirects from the old
`/allocator/pending` and `/allocator/duplicates`. The sidebar "Allocate" item then opens a single-purpose
page (the Allocator). Attention-list rows deep-link to the new tabs. Ticket 18 grows to cover this.

## 14. Risks

- **Reconciliation drift:** if the drill-down re-implements selection logic, totals will disagree.
  Mitigation: shared helpers plus the "every demo selection reconciles" domain test (ticket 01
  onwards).
- **Docked panel reflow cost:** charts resize on open. Mitigation: measure in 00, and keep chart
  intros from replaying.
- **Removing charts someone liked:** the user owns this call (D9). Removals are isolated in ticket 13
  so they revert cleanly.
- **URL schema churn:** decide it once in an ADR before ticket 01.
- **Scope creep from the Statement side:** pivots stay one level deep. No nested accordions.

## 15. Not doing (with reasons)

- **Savings goals, tags/trips as tags, cash-runway planner** (Wei, Sofia, Sol's idea): these are new
  domain concepts. Each deserves its own idea thread through grilling.
- **Generated (LLM) insights or advice:** the headline is a fixed template, which is predictable
  and testable.
- **Source-document view** (PDF/CSV behind a Statement): there is no data model for it (Opus).
- **"Unusual Record" detection:** needs a statistical rule the user hasn't chosen. Revisit after
  ticket 19.

## 16. Overnight run (2026-11-07, user asleep)

- ONE branch to review: `ai/insight-drilldown`. The prototype commit (5accc9a on `ai/drilldown-prototype`)
  is cherry-picked onto it after ticket 02, and ticket 01 hardens that code instead of rewriting it.
- Every ticket saves screenshots of what it changed to `review/<NN>-<what>.png` (desktop 1440 + mobile
  390, DARK MODE (Settings/theme toggle "Dark" or `--color-scheme dark`), production build, demo data) and a one-line "look for" note in its ticket Comments.
- Morning: one review page (artifact) with the branch, each ticket's screenshots and what to judge.
- Pacing: `codex-pace` before each ticket; Sol medium; stop when both plans have <10% left.
- Until 10:00 2026-11-07: no chat updates to the user (save tokens). At 10:00 if not done: brief summary, then normal updates.
