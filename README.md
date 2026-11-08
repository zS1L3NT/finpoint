![Finpoint Cover Image](https://res.cloudinary.com/zs1l3nt/image/upload/v1793559402/repositories/finpoint.png)

# Finpoint

![License](https://img.shields.io/github/license/zS1L3NT/finpoint?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/finpoint?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/finpoint?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/finpoint?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/finpoint?style=for-the-badge)

Finpoint is a local-first personal finance tracker that lets you import account activity, organise it into meaningful financial records and understand where your money goes. Your data stays in your browser unless you choose to back it up to a file or sync it with your own Google Drive.

## Motivation

I am someone who loves to track where my expenses go, and track how I'm spending. I have been trying to find an effective way to track my finances for many years. I went through various apps: Wallet by Budget Bakers (3 years), Toshl (6 months), Notion (3 months), and I could never find a solution that meets my exact use case.

The problem with all these finance trackers is that they rely on YOU to cross refer to your bank statements manually to determine whether you missed any records or not. There was no way for me to have the system / application itself solve the issue of bank statement to app record reconciliation. This means that whenever I forget to do finance tracking for a few days, or when I make online transactions, I will need to eye-ball my bank statements and compare directly to what my finance tracker currently shows; and this was VERY time consuming.

I then decided to take things into my own hands, and that's how Finpoint was born.

I ideated for a few hours with AI on how the core structure of the solution could work, then I self-wrote (not vibe coded) all the core ideas behind this project using Laravel and React, and planned how this issue of bank statement and app record reconciliation could be resolved.

### Core Idea

The core model behind Finpoint that no other finance tracker out there has is this:

`Bank Statements` (CSV from Bank) -< `Allocations` (Many to Many) >- `App Records` (Your labels)

The rest of Finpoint builds on this core idea.

### Future plans

After the core idea was solved, I just added my own graphs, statistics, useful metrics and features that I want in my personal finance tracker. I've been using it successfully since March 2026 and plan to constantly maintain this project.

I've also hosted Finpoint on my personal subdomain at https://finpoint.zectan.com if you ever want to try it out or use it! (You can try out the demo data)

## Features

- Dashboard
  - Monthly income, spending and Left over
  - Spending forecast for all budgets or a single Monthly Budget, with a projected month-end and recommended pace
  - Spending against each Monthly Budget's amount and previous-month comparisons
  - A spending calendar that opens the Records behind each day
  - Category and Monthly Budget totals, with category trends that open each month's Records
  - Biggest category changes against your usual spending
  - Page-wide Monthly Budget scope that stays across chart links and month changes
  - Reusable Monthly Budgets with monthly amount overrides
  - Review links for Pending Records, Pending Statements, unallocated Statements and unbudgeted spending
  - A start state on an empty workspace offering statement import or demo data
  - A notice on an empty month offering the latest recorded month
- Records
  - Create, update and delete Records
  - Assign Categories, Monthly Budgets and accounting treatments
  - Allocate one or more Statements to a Record
  - Suggested details learned from your past Records
  - Autofilled details from Statement Rules
  - Search, filter and paginate Records
  - Records month navigation, with old Monthly Records links redirecting to the same filtered Records view
- Statements
  - Import Statements from
    - DBS
    - OCBC
    - UOB
    - Revolut
  - CSV, XLS and XLSX support
  - Automatically create missing Accounts during import
  - Skip duplicate Statements and preserve same-day ordering
  - Flag possible Duplicate Statements with a badge
  - Create handwritten Pending Statements
  - Search and filter by Account, status and date
  - Replace a Pending Statement with imported activity while preserving its Allocations
  - Fix Duplicate Statements by keeping one and moving its Allocations to it
  - Mark same-day pairs as separate so they are no longer suggested
- Statement Rules
  - Recognise recurring Statements by description (contains, is exactly or regex match)
  - Autofill Record title, people, location, Category, treatment and Monthly Budget
  - Live preview of the Statements a rule matches
  - Suggested rules drafted from Records you keep labelling the same way
- Allocate
  - Allocate Statements to existing or new Records
  - Split amounts across multiple Records
  - Review incomplete Allocations
- Planning
  - Categories
    - Nested subcategories
    - Default accounting treatments
    - Default Monthly Budgets
  - Monthly Budgets
    - Default, one-month and from-this-month-onward amount rules
    - A spending forecast for each Monthly Budget
  - Budgets
    - Custom date periods and amounts
    - Automatic or manual Record membership
    - Progress tracking
- Data management
  - Local IndexedDB storage with no account required
  - Optional automatic sync through your own Google Drive
  - Manual JSON backup and restore
  - Conflict handling when both the browser and Drive copy change, without flagging untouched starter workspaces
  - Generated demo data
  - Default filter date ranges
  - Suggestion accuracy measured on your own Records
  - Light, dark and system themes, with picked colours toned to match each theme
  - Progressive Web Application support

## Usage

Install the dependencies and start the development server.

```sh
$ bun install
$ npm run dev
```

Finpoint will be available at [http://localhost:5173](http://localhost:5173). The application works without any environment variables and stores its data in the browser.

Google Drive sync is optional. To enable it, copy the `.env.example` file to `.env`, create a Web OAuth client in Google Cloud Console and fill in the credentials.

```sh
$ cp .env.example .env
```

## Credits

The interface is built with [shadcn/ui](https://ui.shadcn.com/) and [Base UI](https://base-ui.com/), with icons from [Lucide](https://lucide.dev/).

## Tests

Domain and importer tests run on Bun with an in-memory IndexedDB. Browser tests run on Playwright against the dev servers; see [tests/README.md](tests/README.md) for the layout and how to pick cases.

```sh
$ bun test
$ bun run test:e2e
```

The codebase can also be checked with the following commands.

```sh
$ bun lint:check
$ bun types:check
$ bun run build
```

To stress-test the UI with realistic worst-case data (long and one-letter names, emoji, huge amounts), run the dev server, or build with `NEXT_PUBLIC_DEV_TOOLS=1`. The Dashboard then shows a "Demo data / Worst case / Empty" switch at the bottom. Each option replaces the whole local workspace.

## Built with

- TypeScript
  - [![Next.js](https://img.shields.io/badge/next.js-%5E16.3.5-red?style=flat-square)](https://www.npmjs.com/package/next/v/16.3.5)
  - [![React](https://img.shields.io/badge/react-%5E19.2.0-red?style=flat-square)](https://www.npmjs.com/package/react/v/19.2.0)
  - Interface
    - [![Base UI](https://img.shields.io/badge/%40base--ui%2Freact-%5E1.4.0-red?style=flat-square)](https://www.npmjs.com/package/@base-ui/react/v/1.4.0)
    - [![shadcn](https://img.shields.io/badge/shadcn-%5E4.3.0-red?style=flat-square)](https://www.npmjs.com/package/shadcn/v/4.3.0)
    - [![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%5E4.0.0-red?style=flat-square)](https://www.npmjs.com/package/tailwindcss/v/4.0.0)
    - [![Framer Motion](https://img.shields.io/badge/framer--motion-%5E12.38.0-red?style=flat-square)](https://www.npmjs.com/package/framer-motion/v/12.38.0)
    - [![Lucide React](https://img.shields.io/badge/lucide--react-%5E1.55.0-red?style=flat-square)](https://www.npmjs.com/package/lucide-react/v/1.55.0)
  - Data
    - [![Dexie](https://img.shields.io/badge/dexie-%5E4.4.6-red?style=flat-square)](https://www.npmjs.com/package/dexie/v/4.4.6)
    - [![TanStack Table](https://img.shields.io/badge/%40tanstack%2Freact--table-%5E8.21.3-red?style=flat-square)](https://www.npmjs.com/package/@tanstack/react-table/v/8.21.3)
    - [![Papa Parse](https://img.shields.io/badge/papaparse-%5E5.7.0-red?style=flat-square)](https://www.npmjs.com/package/papaparse/v/5.7.0)
    - [![SheetJS](https://img.shields.io/badge/xlsx-%5E0.18.5-red?style=flat-square)](https://www.npmjs.com/package/xlsx/v/0.18.5)
    - [![Luxon](https://img.shields.io/badge/luxon-%5E3.7.2-red?style=flat-square)](https://www.npmjs.com/package/luxon/v/3.7.2)
  - Miscellaneous
    - [![TanStack Form](https://img.shields.io/badge/%40tanstack%2Freact--form-%5E1.29.0-red?style=flat-square)](https://www.npmjs.com/package/@tanstack/react-form/v/1.29.0)
    - [![jose](https://img.shields.io/badge/jose-%5E6.2.12-red?style=flat-square)](https://www.npmjs.com/package/jose/v/6.2.12)
    - [![Biome](https://img.shields.io/badge/%40biomejs%2Fbiome-%5E2.4.12-red?style=flat-square)](https://www.npmjs.com/package/@biomejs/biome/v/2.4.12)

Click a Spending calendar day to open its Drill-down: Records sorted by amount and the day’s effective spending total. It opens over the Dashboard, which never moves: as a side peek from the right (the default), a centre peek or a full page. Close it with Escape, the close button, or browser Back; the Dashboard returns to the same scroll position with the opener focused. “Open in Records” carries the selected day and budget scope into the Records page.

Select a Statement title in the Statements list to open its detail page and see the Records it funds. Record and Statement detail pages retain their tables and editors, with allocated portions shown alongside amounts. Expand a Record in the Dashboard drill-down to inspect its Allocations. Pending Records in the Drill-down state their reason before expansion: no Statement, an amount still to allocate, unconfirmed account activity, or opposite amount signs. Pending Records show allocation progress; fully allocated list rows keep their compact layout.

Expand a Record in the Dashboard Drill-down to see its Statements. Select a Statement to see its amount, account, date and time, and the Records it funds. The header follows the focused Statement; Back restores the selection total. The breadcrumb and Back button return to the selection; browser Back restores the previous expansion. These views survive reloads and shared links through the `focus` URL parameter.

Category rows, category trend month bars and their category lists open the Drill-down without leaving the Dashboard. Category rows and trend totals exclude refunds; Biggest changes describes each rise or fall in words and names the included comparison months. Open a row to compare this month with its same-period average, with refunds subtracted. The two columns list the Records behind each side; “Only this month” and “Only in comparison” identify titles absent from the other side. Current months compare the same days so far; completed months compare full months.

Forecast days, Monthly Budget cards and forecast legend entries open their Records in the Drill-down. Choose “Show the dashboard for … only” inside a budget panel to change the dashboard scope. Use “New Monthly Budget” to create a plan; Edit remains a separate action.

Use the **Open as** menu in the Drill-down header to switch between Side peek, Center peek and Full page; the choice applies at once and is remembered the next time you open a Drill-down. The expand button opens just the current Drill-down as a full page, whose **Back to Dashboard** button returns you to where you were. On mobile the peek is a bottom sheet, and Full page is still available.

On mobile the Drill-down is a bottom sheet. It opens half height so the Dashboard stays visible above it; tap the handle at its top (or press Enter on it) to expand it to full height and again to collapse. Close it with the X, Escape or Back. Dragging the sheet is not supported yet.

The Dashboard summary shows Spent, Income and Left over. Select a metric to inspect its Records; Saved this month shows contributions less withdrawals. While income is still missing in the current month, Left over waits neutrally for income. Historical income comparisons cover the same days so far.

The Dashboard uses the spending calendar and forecast for daily spending. Select a calendar day to open its Records directly. Redundant daily bars, surplus chart, weekday card and pace tiles have been removed.

In the Dashboard drill-down, expand a Record and choose **Edit Record**. Saved changes update the total immediately. Close the editor to return to its action. An unallocated Statement in the Statement view offers **Allocate…**, opening the Allocator with that Statement selected.

**Largest Records** shows the selected month and scope’s five largest Spending Records by absolute amount, including refunds. **See all** opens the sorted drill-down. On Records, **Sort Records** offers newest first or absolute amount in either direction; sorting applies before pagination and survives reloads in the URL.

Allocate assigns Statements to Records. Statement cleanup lives in the Statements, Replace pending and Duplicates tabs; old cleanup URLs redirect with filters preserved. In the Record editor, choose Money out or Money in and enter a positive amount.

Dashboard metric labels open their Records directly. Dotted-underlined terms in drill-down copy offer definitions with examples. Hover, focus, or tap a term; press Escape to close. Effective spending follows treatment rules and includes refunds. Left over means income minus personal spending, before saving and investment contributions.

The Dashboard starts with a factual month headline and an Attention list of up to three
things to review. Over-plan Monthly Budgets come first, followed by unallocated Statements,
Pending Records, Pending Statements and unbudgeted spending. Select a budget row to see
its Records in the drill-down; other rows take you to the filtered work list. Changing the
budget scope updates the headline while Attention continues to cover the whole month.

Dashboard cards use natural heights and stack when the main column is narrow. Attention keeps small unbudgeted amounts visible below higher-priority work, shows the amount without a Monthly Budget, and highlights only the first row.

The Dashboard Monthly budgets footer shows total spending, including spending not in any Monthly Budget, after refunds. Categories show expenses minus refunds so their total can be compared with spending. The footer links to Budgets for plans with a custom date period; these may overlap Monthly Budgets and are not added to their totals.

On mobile, the Dashboard drill-down opens at half height with a clear backdrop and compact header. The grab handle expands it to full height with a dimmed backdrop; press it again to collapse. Pending allocation captions wrap beneath amounts to keep Record titles readable.

The Spending forecast names its dotted previous-month comparison in the caption and prefixes that line’s endpoint value pill with the month abbreviation.

Comparison Drill-downs sort both columns by amount, show the included months’ combined spending divided by their count, and state the difference from that average in the header.

Spending Drill-downs label refunds and show their positive amounts with a plus sign in green. When refunds are present, the header shows gross spending minus refunds so the total can be reconciled.

Past months without Records show one dated empty-state message and an Import statements action. Empty charts and summary cards stay hidden for those months.

The Dashboard hides a Back action pointing to its current month. Records treats the selected month as navigation context: Clear filters counts user filters and preserves that month.

The Spent Drill-down groups Records by Category, with net subtotals that add up to the header. At half height the mobile sheet keeps the Record count and Spending label compact; expand it to read the inclusion rules. Attention’s Pending and unallocated rows continue to open their filtered work lists.
