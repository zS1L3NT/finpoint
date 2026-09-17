![Finpoint Cover Image](https://res.cloudinary.com/zs1l3nt/image/upload/repositories/finpoint.png)

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
  - Monthly income, spending and surplus or shortfall
  - Daily spending pace and previous-month comparisons
  - Spending by day and weekday
  - Category and spending bucket breakdowns
  - Monthly spending bucket targets
  - Pending Record and Statement summaries
- Records
  - Create, update and delete Records
  - Assign Categories, spending buckets and accounting treatments
  - Attach one or more Statements through Allocations
  - Search, filter and paginate Records
  - Monthly Records view with month navigation
- Statements
  - Import Statements from
    - DBS
    - UOB
    - Revolut
  - CSV, XLS and XLSX support
  - Automatically create missing Accounts during import
  - Skip duplicate Statements and preserve same-day ordering
  - Create handwritten Pending Statements
  - Search and filter by Account, status and date
- Allocator
  - Allocate Statements to existing or new Records
  - Split amounts across multiple Records
  - Review incomplete Allocations
  - Replace a Pending Statement with imported activity while preserving its Allocations
- Planning
  - Categories
    - Nested subcategories
    - Default accounting treatments
    - Default spending buckets
  - Spending buckets
    - Core, outlier and custom groups
    - Daily, recurring or unpaced spending
    - Default monthly targets and month-specific overrides
  - Budgets
    - Custom date periods and amounts
    - Automatic or manual Record membership
    - Progress tracking
- Data management
  - Local IndexedDB storage with no account required
  - Optional automatic sync through your own Google Drive
  - Manual JSON backup and restore
  - Conflict handling when both the browser and Drive copy change
  - Generated demo data
  - Light, dark and system themes
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

Finpoint does not currently have an automated test suite. The codebase can be checked with the following commands.

```sh
$ bun lint:check
$ bun types:check
$ bun run build
```

## Built with

- TypeScript
  - [![Next.js](https://img.shields.io/badge/next.js-%5E16.3.5-red?style=flat-square)](https://www.npmjs.com/package/next/v/16.3.5)
  - [![React](https://img.shields.io/badge/react-%5E19.2.0-red?style=flat-square)](https://www.npmjs.com/package/react/v/19.2.0)
  - Interface
    - [![Base UI](https://img.shields.io/badge/%40base--ui%2Freact-%5E1.4.0-red?style=flat-square)](https://www.npmjs.com/package/@base-ui/react/v/1.4.0)
    - [![shadcn](https://img.shields.io/badge/shadcn-%5E4.3.0-red?style=flat-square)](https://www.npmjs.com/package/shadcn/v/4.3.0)
    - [![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%5E4.0.0-red?style=flat-square)](https://www.npmjs.com/package/tailwindcss/v/4.0.0)
    - [![Framer Motion](https://img.shields.io/badge/framer--motion-%5E12.38.0-red?style=flat-square)](https://www.npmjs.com/package/framer-motion/v/12.38.0)
    - [![Lucide React](https://img.shields.io/badge/lucide--react-%5E1.14.0-red?style=flat-square)](https://www.npmjs.com/package/lucide-react/v/1.14.0)
  - Data
    - [![Dexie](https://img.shields.io/badge/dexie-%5E4.4.6-red?style=flat-square)](https://www.npmjs.com/package/dexie/v/4.4.6)
    - [![TanStack Table](https://img.shields.io/badge/%40tanstack%2Freact--table-%5E8.21.3-red?style=flat-square)](https://www.npmjs.com/package/@tanstack/react-table/v/8.21.3)
    - [![Recharts](https://img.shields.io/badge/recharts-3.8.0-red?style=flat-square)](https://www.npmjs.com/package/recharts/v/3.8.0)
    - [![Papa Parse](https://img.shields.io/badge/papaparse-%5E5.7.0-red?style=flat-square)](https://www.npmjs.com/package/papaparse/v/5.7.0)
    - [![SheetJS](https://img.shields.io/badge/xlsx-%5E0.18.5-red?style=flat-square)](https://www.npmjs.com/package/xlsx/v/0.18.5)
    - [![Luxon](https://img.shields.io/badge/luxon-%5E3.7.2-red?style=flat-square)](https://www.npmjs.com/package/luxon/v/3.7.2)
  - Miscellaneous
    - [![TanStack Form](https://img.shields.io/badge/%40tanstack%2Freact--form-%5E1.29.0-red?style=flat-square)](https://www.npmjs.com/package/@tanstack/react-form/v/1.29.0)
    - [![jose](https://img.shields.io/badge/jose-%5E6.2.12-red?style=flat-square)](https://www.npmjs.com/package/jose/v/6.2.12)
    - [![Biome](https://img.shields.io/badge/%40biomejs%2Fbiome-%5E2.4.12-red?style=flat-square)](https://www.npmjs.com/package/@biomejs/biome/v/2.4.12)
