# Graph Report - t3-c0745187  (2026-10-14)

## Corpus Check
- 205 files · ~115,550 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1535 nodes · 5828 edges · 83 communities (72 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Button Components
- Utils Components
- Pending Page
- App Sidebar
- Budgets Page
- Cn Components
- Dashboard Aggregation
- TypeScript Compiler Settings
- Daily Spending Chart
- Application Route Views
- Application Dependencies
- Domain Validation
- Sync Page
- Lint and Formatting Rules
- Background Drive Sync
- Application Dependencies
- Lint and Formatting Rules
- Records and Allocations
- Statements Components
- Category Filter
- Input Components
- Project Agent Instructions
- Components Components
- Drive Sync Operations
- Shared Components
- Database Schema and Migrations
- Next Components
- Sidebar Components
- Importer Components
- Types.D Components
- Duplicate Feature Specification
- Auth Vault
- Date Range
- Google Drive
- Data Backup and Restore
- Lint and Formatting Rules
- Financial Domain Vocabulary
- Pagination Footer
- Project Agent Instructions
- Lint and Formatting Rules
- Lint and Formatting Rules
- Cashflow Chart
- Duplicate Detection and Cleanup
- Code Style Guide
- Manifest Components
- Category History Chart
- Application Dependencies
- Duplicate Feature Specification
- Total Spending Chart
- Local Markdown Tracker
- Lint and Formatting Rules
- Signed Commit Conventions
- Records Components
- Importer.Test Components
- Monthly Budget Usage
- Spending Calendar
- Application Dependencies
- Application Dependencies
- Lint and Formatting Rules
- Shell Header
- Finpoint Icon Concept
- Finpoint Icon With Charcoal Shadow
- Local Markdown Tracker
- Finpoint Components
- Domain Documentation Rules
- Google Drive Sync
- Duplicate Feature Ticket
- F Monogram Icon
- Jpg Favicon Icon
- Png Favicon Icon
- Svg Favicon Icon
- F Monogram Icon
- F Monogram Icon
- Use Persistent State
- Project Agent Instructions
- Finpoint App Icon
- Project Agent Instructions
- Project Agent Instructions
- Unrestricted Crawler Policy
- Generated Demo Data
- Progressive Web Application

## God Nodes (most connected - your core abstractions)
1. `cn()` - 302 edges
2. `Button()` - 112 edges
3. `react` - 89 edges
4. `formatCurrency()` - 76 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `PageContent()` - 40 edges
10. `next` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `PendingCard()` --calls--> `classForCurrency()`  [EXTRACTED]
  app/allocator/pending/page.tsx → src/lib/utils.ts
- `PendingCard()` --calls--> `cn()`  [EXTRACTED]
  app/allocator/pending/page.tsx → src/lib/utils.ts
- `PendingCard()` --calls--> `formatCurrency()`  [EXTRACTED]
  app/allocator/pending/page.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (83 total, 11 thin omitted)

### Community 0 - "Button Components"
Cohesion: 0.06
Nodes (113): DuplicateReviewDialog(), CandidateResults(), class-variance-authority, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog() (+105 more)

### Community 1 - "Utils Components"
Cohesion: 0.06
Nodes (97): AccountPage(), AccountRow, AccountsPage(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), CategoriesPage() (+89 more)

### Community 2 - "Pending Page"
Cohesion: 0.11
Nodes (61): DuplicateGroupCard(), FixDuplicatesPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard(), ScopeSelect(), byRecordDay (+53 more)

### Community 3 - "App Sidebar"
Cohesion: 0.06
Nodes (66): metadata, RootLayout(), viewport, NotFound(), Boot(), Providers(), lucide-react, @vercel/analytics (+58 more)

### Community 4 - "Budgets Page"
Cohesion: 0.11
Nodes (43): AccountCard(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table (+35 more)

### Community 5 - "Cn Components"
Cohesion: 0.08
Nodes (37): radix-ui, Amount(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem() (+29 more)

### Community 6 - "Dashboard Aggregation"
Cohesion: 0.13
Nodes (36): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories() (+28 more)

### Community 7 - "TypeScript Compiler Settings"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 8 - "Daily Spending Chart"
Cohesion: 0.15
Nodes (26): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro() (+18 more)

### Community 9 - "Application Route Views"
Cohesion: 0.12
Nodes (28): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+20 more)

### Community 10 - "Application Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Domain Validation"
Cohesion: 0.23
Nodes (20): updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory(), dismissDuplicatePair() (+12 more)

### Community 12 - "Sync Page"
Cohesion: 0.14
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+18 more)

### Community 13 - "Lint and Formatting Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 14 - "Background Drive Sync"
Cohesion: 0.14
Nodes (26): isDriveConfigured(), useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot() (+18 more)

### Community 15 - "Application Dependencies"
Cohesion: 0.07
Nodes (26): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, jose (+18 more)

### Community 16 - "Lint and Formatting Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 17 - "Records and Allocations"
Cohesion: 0.12
Nodes (20): AllocationRow, BudgetFilters, createBudget(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, pendingStatementIds() (+12 more)

### Community 18 - "Statements Components"
Cohesion: 0.17
Nodes (22): countSuggestions(), asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+14 more)

### Community 19 - "Category Filter"
Cohesion: 0.17
Nodes (21): MonthLayout(), @base-ui/react, DateField(), Props, CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty() (+13 more)

### Community 20 - "Input Components"
Cohesion: 0.34
Nodes (17): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Input(), Sheet(), SheetContent() (+9 more)

### Community 21 - "Project Agent Instructions"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 22 - "Components Components"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "Drive Sync Operations"
Cohesion: 0.23
Nodes (19): FinpointDB, exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile() (+11 more)

### Community 24 - "Shared Components"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 25 - "Database Schema and Migrations"
Cohesion: 0.10
Nodes (18): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, DuplicateDismissalRow (+10 more)

### Community 26 - "Next Components"
Cohesion: 0.16
Nodes (11): nextConfig, luxon, next, CategoryMovers(), Mover, CategorySpendingMix(), HistoryContext, HistoryItem (+3 more)

### Community 27 - "Sidebar Components"
Cohesion: 0.15
Nodes (17): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+9 more)

### Community 28 - "Importer Components"
Cohesion: 0.25
Nodes (18): papaparse, xlsx, ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc() (+10 more)

### Community 29 - "Types.D Components"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 30 - "Duplicate Feature Specification"
Cohesion: 0.11
Nodes (18): Drive Baseline Migration, Duplicate Dismissal Migration, Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals (+10 more)

### Community 31 - "Auth Vault"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 32 - "Date Range"
Cohesion: 0.16
Nodes (14): react-day-picker, DateRangeValue, formatRange(), Props, rangeFromValue(), buttonVariants, Calendar(), CalendarDayButton() (+6 more)

### Community 33 - "Google Drive"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken() (+6 more)

### Community 34 - "Data Backup and Restore"
Cohesion: 0.25
Nodes (10): db, importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings (+2 more)

### Community 35 - "Lint and Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 36 - "Financial Domain Vocabulary"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 37 - "Pagination Footer"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 38 - "Project Agent Instructions"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 39 - "Lint and Formatting Rules"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 40 - "Lint and Formatting Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 41 - "Cashflow Chart"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 42 - "Duplicate Detection and Cleanup"
Cohesion: 0.25
Nodes (10): StatementRow, descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), duplicateReview(), FixDuplicatesInput, GENERIC (+2 more)

### Community 43 - "Code Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 44 - "Manifest Components"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 45 - "Category History Chart"
Cohesion: 0.31
Nodes (9): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+1 more)

### Community 46 - "Application Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react (+1 more)

### Community 47 - "Duplicate Feature Specification"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 48 - "Total Spending Chart"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), CashflowHistoryMonth

### Community 49 - "Local Markdown Tracker"
Cohesion: 0.25
Nodes (8): Local Agent Skills, Domain and Importer Tests, Domain Documentation Conflicts, Single-context Domain Docs, Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 50 - "Lint and Formatting Rules"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 51 - "Signed Commit Conventions"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 52 - "Records Components"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 54 - "Monthly Budget Usage"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 55 - "Spending Calendar"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 56 - "Application Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 57 - "Application Dependencies"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 58 - "Lint and Formatting Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 59 - "Shell Header"
Cohesion: 0.53
Nodes (4): AppHeader(), ShellHeader(), TITLES, SidebarTrigger()

### Community 60 - "Finpoint Icon Concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 61 - "Finpoint Icon With Charcoal Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 62 - "Local Markdown Tracker"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 63 - "Finpoint Components"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 64 - "Domain Documentation Rules"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 66 - "Google Drive Sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 67 - "Duplicate Feature Ticket"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 68 - "F Monogram Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 69 - "Jpg Favicon Icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 70 - "Png Favicon Icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 71 - "Svg Favicon Icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 72 - "F Monogram Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 73 - "F Monogram Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **97 isolated node(s):** `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu`, `lightningcss-win32-x64-msvc`, `react-dom` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 532 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Cn Components` to `Button Components`, `Utils Components`, `Pending Page`, `App Sidebar`, `Budgets Page`, `Date Range`, `Pagination Footer`, `Daily Spending Chart`, `Application Route Views`, `Shell Header`, `Sync Page`, `Total Spending Chart`, `Category Filter`, `Input Components`, `Monthly Budget Usage`, `Spending Calendar`, `Next Components`, `Sidebar Components`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06276074732450572 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button Components` to `Utils Components`, `Pending Page`, `App Sidebar`, `Budgets Page`, `Cn Components`, `Daily Spending Chart`, `Application Route Views`, `Sync Page`, `Background Drive Sync`, `Application Dependencies`, `Category Filter`, `Input Components`, `Next Components`, `Sidebar Components`, `Date Range`, `Pagination Footer`, `Category History Chart`, `Total Spending Chart`, `Monthly Budget Usage`, `Shell Header`, `Use Persistent State`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Utils Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06090322580645161 - nodes in this community are weakly interconnected._
- **Why does `luxon` connect `Next Components` to `Button Components`, `Utils Components`, `Pending Page`, `App Sidebar`, `Budgets Page`, `Date Range`, `Data Backup and Restore`, `Dashboard Aggregation`, `Daily Spending Chart`, `Application Route Views`, `Cashflow Chart`, `Application Dependencies`, `Total Spending Chart`, `Records and Allocations`, `Category Filter`, `Spending Calendar`, `Shared Components`, `Database Schema and Migrations`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Pending Page` be split into smaller, more focused modules?**
  _Cohesion score 0.10938007140538786 - nodes in this community are weakly interconnected._