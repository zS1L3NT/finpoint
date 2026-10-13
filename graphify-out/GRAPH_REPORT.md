# Graph Report - t3-c0745187  (2026-10-14)

## Corpus Check
- 194 files · ~115,552 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1537 nodes · 5830 edges · 92 communities (82 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3691d057`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- statement-replacement-review.tsx
- allocator/page.tsx
- app-sidebar.tsx
- paginated-data-table.tsx
- cn
- dashboard.ts
- compilerOptions
- category-history-chart.tsx
- (month)/page.tsx
- Application Dependencies
- Validator
- sync/page.tsx
- suspicious
- auto-sync.ts
- package.json
- correctness
- records.ts
- amount-filter.tsx
- category-filter.tsx
- formatCurrency
- Next.js App Router
- Components Components
- drive-sync.ts
- Shared Components
- db.ts
- next
- sidebar.tsx
- importer/page.tsx
- types.d.ts
- Changed Bank Descriptions
- auth-vault.ts
- utils.ts
- google-drive.ts
- export-import.ts
- formatter
- Record
- PaginationFooter
- Graph refresh after code tasks
- biome.json
- rules
- cashflow-chart.tsx
- duplicates/page.tsx
- Style Guide
- manifest.json
- monthly/page.tsx
- devDependencies
- Fix duplicate bank statements
- total-spending-chart.tsx
- Local Markdown Issue Tracker
- formatter
- Commit Guide
- Records
- accounts/[id]/page.tsx
- monthly-budget-usage.tsx
- spending-calendar.tsx
- optionalDependencies
- scripts
- style
- shell-header.tsx
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Google Drive sync
- 01: Review and fix duplicate bank statements in Workflows
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- react
- Next.js development server
- Finpoint app icon
- Biome checks
- String primary keys
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- records/[id]/page.tsx
- providers.tsx
- use-appearance.tsx
- budgets/[id]/page.tsx
- icon.tsx
- chart.tsx
- allocator-tabs.tsx
- statement-columns.tsx
- budgets/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 302 edges
2. `Button()` - 112 edges
3. `react` - 89 edges
4. `formatCurrency()` - 76 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `next` - 40 edges
10. `PageContent()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `MonthLayout()` --calls--> `PageContent()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/layout/page-content.tsx
- `MonthLayout()` --calls--> `Button()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button.tsx
- `MonthLayout()` --calls--> `ButtonGroup()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button-group.tsx
- `MonthLayout()` --calls--> `useHistory()`  [EXTRACTED]
  app/(month)/layout.tsx → src/history.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (92 total, 10 thin omitted)

### Community 0 - "Button"
Cohesion: 0.07
Nodes (95): DuplicateGroupCard(), DuplicateReviewDialog(), CandidatePage, CandidateResults(), countSuggestions(), framer-motion, sonner, @tanstack/react-form (+87 more)

### Community 1 - "statement-replacement-review.tsx"
Cohesion: 0.23
Nodes (23): ScopedCardTitle(), WeekdayCard(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, SettingsPage(), MethodHeader() (+15 more)

### Community 2 - "allocator/page.tsx"
Cohesion: 0.22
Nodes (33): FixDuplicatesPage(), AllocatorPage(), AllocatorPendingPage(), ScopeSelect(), MonthlyRecordFilters(), RecordCreatorHost(), RecordFilters(), RecordsPage() (+25 more)

### Community 3 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (25): NotFound(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+17 more)

### Community 4 - "paginated-data-table.tsx"
Cohesion: 0.24
Nodes (23): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+15 more)

### Community 5 - "cn"
Cohesion: 0.08
Nodes (40): class-variance-authority, radix-ui, AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem() (+32 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.15
Nodes (33): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+25 more)

### Community 7 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 8 - "category-history-chart.tsx"
Cohesion: 0.14
Nodes (26): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), aggregateSeries(), CategoryHistoryChart() (+18 more)

### Community 9 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (25): Comparison, ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView, InvestmentRow(), PaceData (+17 more)

### Community 10 - "Application Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Validator"
Cohesion: 0.26
Nodes (16): updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory(), createMonthlyBudget() (+8 more)

### Community 12 - "sync/page.tsx"
Cohesion: 0.16
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+15 more)

### Community 13 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 14 - "auto-sync.ts"
Cohesion: 0.14
Nodes (26): isDriveConfigured(), useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot() (+18 more)

### Community 15 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 16 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 17 - "records.ts"
Cohesion: 0.13
Nodes (21): AllocationRow, db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, pendingStatementIds(), tallyAllocations() (+13 more)

### Community 18 - "amount-filter.tsx"
Cohesion: 0.11
Nodes (46): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe() (+38 more)

### Community 19 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 20 - "formatCurrency"
Cohesion: 0.28
Nodes (11): PendingCard(), comparisonRateText(), comparisonText(), deltaOf(), SummaryBand(), AllocateBar(), Amount(), RecordAmount() (+3 more)

### Community 21 - "Next.js App Router"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 22 - "Components Components"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "drive-sync.ts"
Cohesion: 0.23
Nodes (19): FinpointDB, exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), uploadBackupFile() (+11 more)

### Community 24 - "Shared Components"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 25 - "db.ts"
Cohesion: 0.10
Nodes (19): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, DuplicateDismissalRow (+11 more)

### Community 27 - "sidebar.tsx"
Cohesion: 0.11
Nodes (23): SidebarContent(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel(), SidebarInput(), SidebarInset() (+15 more)

### Community 28 - "importer/page.tsx"
Cohesion: 0.23
Nodes (20): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey() (+12 more)

### Community 29 - "types.d.ts"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 30 - "Changed Bank Descriptions"
Cohesion: 0.11
Nodes (18): Drive Baseline Migration, Duplicate Dismissal Migration, Duplicate Allocation Resolution, Atomic Statement Cleanup, Dismissal Migration and Backup, Desktop and Mobile Smoke Checks, Conservative Duplicate Suggestions, Pair-specific Dismissals (+10 more)

### Community 31 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 32 - "utils.ts"
Cohesion: 0.10
Nodes (37): MonthLayout(), @base-ui/react, luxon, react-day-picker, Props, DateField(), Props, DateRangeValue (+29 more)

### Community 33 - "google-drive.ts"
Cohesion: 0.22
Nodes (13): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+5 more)

### Community 34 - "export-import.ts"
Cohesion: 0.13
Nodes (13): dexie, fake-indexeddb, clearAllData(), downloadExport(), importData(), parseImportFile(), SYNC_TABLES, tableCounts() (+5 more)

### Community 35 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 36 - "Record"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 37 - "PaginationFooter"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 38 - "Graph refresh after code tasks"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 39 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 40 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 41 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 42 - "duplicates/page.tsx"
Cohesion: 0.23
Nodes (16): removeStatementDismissals(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), dismissedDuplicatePairs(), DuplicateGroup, duplicateGroups(), duplicateReview() (+8 more)

### Community 43 - "Style Guide"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 44 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 45 - "monthly/page.tsx"
Cohesion: 0.13
Nodes (27): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, ScopeLabel(), byRecordDay, FILTER_KEYS, Filters (+19 more)

### Community 46 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse (+2 more)

### Community 47 - "Fix duplicate bank statements"
Cohesion: 0.22
Nodes (8): Fix duplicate bank statements, Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Solution, Testing Decisions, User Stories

### Community 48 - "total-spending-chart.tsx"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), CashflowHistoryMonth

### Community 49 - "Local Markdown Issue Tracker"
Cohesion: 0.25
Nodes (8): Local Agent Skills, Domain and Importer Tests, Domain Documentation Conflicts, Single-context Domain Docs, Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 50 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 51 - "Commit Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 52 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 53 - "accounts/[id]/page.tsx"
Cohesion: 0.23
Nodes (14): AccountPage(), AccountCard(), AccountRow, AccountsPage(), PageHeader(), MetricGrid(), dayLabel(), bankMeta() (+6 more)

### Community 54 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 55 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 56 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 57 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 58 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 59 - "shell-header.tsx"
Cohesion: 0.36
Nodes (6): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), SearchInit, useMonthParams()

### Community 60 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 61 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 62 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 63 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 64 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 66 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 67 - "01: Review and fix duplicate bank statements in Workflows"
Cohesion: 0.50
Nodes (3): 01: Review and fix duplicate bank statements in Workflows, Completion evidence, PR preparation

### Community 68 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 69 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 70 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 71 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 72 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 73 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 74 - "react"
Cohesion: 0.12
Nodes (19): react, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel() (+11 more)

### Community 83 - "records/[id]/page.tsx"
Cohesion: 0.29
Nodes (13): RecordPage(), StatementPage(), DetailSummary(), DetailSummaryItem(), Badge(), badgeVariants, useFetch(), EditableRecord (+5 more)

### Community 84 - "providers.tsx"
Cohesion: 0.18
Nodes (14): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarProvider() (+6 more)

### Community 85 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): lucide-react, Toaster(), applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 86 - "budgets/[id]/page.tsx"
Cohesion: 0.31
Nodes (11): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Sparkline(), Metric(), ValueSwap(), parseDatetime() (+3 more)

### Community 87 - "icon.tsx"
Cohesion: 0.24
Nodes (10): DynamicUiIcon(), iconNameSet, loadedIcons, loadIcon(), loadingIcons, normalize(), preloadCategoryIcons(), UiIcon() (+2 more)

### Community 88 - "chart.tsx"
Cohesion: 0.23
Nodes (11): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 89 - "allocator-tabs.tsx"
Cohesion: 0.38
Nodes (8): AllocatorTabs(), readSettings(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), getSettings(), pathAllocatorDuplicates(), pathAllocatorPending()

### Community 90 - "statement-columns.tsx"
Cohesion: 0.36
Nodes (10): amountTone(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions (+2 more)

### Community 91 - "budgets/page.tsx"
Cohesion: 0.42
Nodes (8): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), parseDate(), listBudgets(), pathBudget()

## Knowledge Gaps
- **98 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 534 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `statement-replacement-review.tsx`, `allocator/page.tsx`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `category-history-chart.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `amount-filter.tsx`, `category-filter.tsx`, `formatCurrency`, `sidebar.tsx`, `importer/page.tsx`, `utils.ts`, `PaginationFooter`, `monthly/page.tsx`, `total-spending-chart.tsx`, `accounts/[id]/page.tsx`, `monthly-budget-usage.tsx`, `spending-calendar.tsx`, `shell-header.tsx`, `react`, `records/[id]/page.tsx`, `providers.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `chart.tsx`, `allocator-tabs.tsx`, `statement-columns.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07330186205087857 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `statement-replacement-review.tsx`, `allocator/page.tsx`, `paginated-data-table.tsx`, `cn`, `category-history-chart.tsx`, `(month)/page.tsx`, `sync/page.tsx`, `auto-sync.ts`, `package.json`, `amount-filter.tsx`, `category-filter.tsx`, `sidebar.tsx`, `importer/page.tsx`, `utils.ts`, `PaginationFooter`, `duplicates/page.tsx`, `monthly/page.tsx`, `total-spending-chart.tsx`, `accounts/[id]/page.tsx`, `monthly-budget-usage.tsx`, `shell-header.tsx`, `records/[id]/page.tsx`, `providers.tsx`, `use-appearance.tsx`, `budgets/[id]/page.tsx`, `icon.tsx`, `chart.tsx`, `statement-columns.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07616892911010557 - nodes in this community are weakly interconnected._
- **Why does `luxon` connect `utils.ts` to `Button`, `allocator/page.tsx`, `app-sidebar.tsx`, `paginated-data-table.tsx`, `dashboard.ts`, `category-history-chart.tsx`, `(month)/page.tsx`, `package.json`, `records.ts`, `Shared Components`, `db.ts`, `export-import.ts`, `cashflow-chart.tsx`, `monthly/page.tsx`, `total-spending-chart.tsx`, `accounts/[id]/page.tsx`, `spending-calendar.tsx`, `shell-header.tsx`, `budgets/[id]/page.tsx`, `allocator-tabs.tsx`, `budgets/page.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._