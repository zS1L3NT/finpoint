# Graph Report - t3-b88747ce  (2026-10-14)

## Corpus Check
- 186 files · ~109,584 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1461 nodes · 5605 edges · 80 communities (71 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `012469d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lucide-react
- Button
- cn
- export-import.ts
- Application Architecture
- monthly/page.tsx
- app-sidebar.tsx
- pending/page.tsx
- dashboard.ts
- TypeScript Compiler Configuration
- Runtime Dependencies
- sync/page.tsx
- Suspicious Code Rules
- package.json
- allocator-tabs.tsx
- Correctness Lint Rules
- db.ts
- (month)/page.tsx
- category-history-chart.tsx
- date-range.tsx
- auto-sync.ts
- importer/page.tsx
- UI Component Configuration
- utils.ts
- test-data.ts
- AmountFilter
- paginated-data-table.tsx
- Domain View Types
- auth-vault.ts
- drive-sync.ts
- providers.tsx
- records.ts
- use-appearance.tsx
- Validator
- cashflow-chart.tsx
- chart.tsx
- sidebar.tsx
- google-drive.ts
- JavaScript Formatting Rules
- category-filter.tsx
- Graph Refresh Workflow
- Biome Tool Configuration
- Type Safety Rules
- daily-spending-chart.tsx
- next
- Web App Manifest
- Canonical Finance Concepts
- General Formatting Rules
- Development Dependencies
- total-spending-chart.tsx
- Platform Native Dependencies
- Project Commands
- statements.ts
- Style Lint Rules
- Icon Concept Branding
- Shadow Icon Branding
- Finpoint Brand Identity
- Apple Touch Icon
- JPEG Favicon Branding
- PNG Favicon Branding
- SVG Favicon Branding
- Small App Icon
- Large App Icon
- Next.js Development Workflow
- Finpoint Application Icon
- Code Quality Checks
- Domain Primary Keys
- Search Crawler Policy
- monthly-budget-usage.tsx
- spending-calendar.tsx
- history.tsx
- Repository Code Style
- hashSnapshot
- Finance Feature Overview
- Commit Branch Conventions
- Local Data Synchronization
- Generated Demo Data
- Progressive Web App

## God Nodes (most connected - your core abstractions)
1. `cn()` - 302 edges
2. `Button()` - 108 edges
3. `react` - 88 edges
4. `formatCurrency()` - 73 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `next` - 39 edges
10. `useHistory()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `MonthLayout()` --calls--> `PageContent()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/layout/page-content.tsx
- `MonthLayout()` --calls--> `Button()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button.tsx
- `MonthLayout()` --calls--> `ButtonGroup()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/button-group.tsx
- `MonthLayout()` --calls--> `MonthPicker()`  [EXTRACTED]
  app/(month)/layout.tsx → src/components/ui/monthpicker.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (80 total, 9 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.22
Nodes (11): lucide-react, react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal() (+3 more)

### Community 1 - "Button"
Cohesion: 0.08
Nodes (100): CandidateResults(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, class-variance-authority, sonner, @tanstack/react-form (+92 more)

### Community 2 - "cn"
Cohesion: 0.08
Nodes (36): AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+28 more)

### Community 3 - "export-import.ts"
Cohesion: 0.23
Nodes (12): EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS (+4 more)

### Community 4 - "Application Architecture"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 5 - "monthly/page.tsx"
Cohesion: 0.29
Nodes (15): ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), RecordFilters(), Props, SelectContent() (+7 more)

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.19
Nodes (23): NotFound(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+15 more)

### Community 7 - "pending/page.tsx"
Cohesion: 0.08
Nodes (92): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard() (+84 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.15
Nodes (33): contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+25 more)

### Community 9 - "TypeScript Compiler Configuration"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "sync/page.tsx"
Cohesion: 0.14
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+18 more)

### Community 12 - "Suspicious Code Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, @biomejs/biome, clsx, cmdk, dexie, @fontsource-variable/inter (+21 more)

### Community 14 - "allocator-tabs.tsx"
Cohesion: 0.54
Nodes (6): AllocatorTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAllocator(), pathAllocatorPending()

### Community 15 - "Correctness Lint Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "db.ts"
Cohesion: 0.09
Nodes (15): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, MetaRow (+7 more)

### Community 17 - "(month)/page.tsx"
Cohesion: 0.13
Nodes (18): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+10 more)

### Community 18 - "category-history-chart.tsx"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 19 - "date-range.tsx"
Cohesion: 0.21
Nodes (16): BudgetState, @base-ui/react, DateField(), Props, DateRange(), DateRangeValue, formatRange(), Props (+8 more)

### Community 20 - "auto-sync.ts"
Cohesion: 0.14
Nodes (19): useSyncStatus(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), refreshTimes(), sameSnapshot() (+11 more)

### Community 21 - "importer/page.tsx"
Cohesion: 0.16
Nodes (33): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), asPending(), BANKS, ensureAccount(), combine() (+25 more)

### Community 22 - "UI Component Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "utils.ts"
Cohesion: 0.07
Nodes (69): BUDGET_STATES, BudgetCard(), formatBudgetDateWindow(), InvestmentRow(), radix-ui, react, AllocateBar(), CategoryMovers() (+61 more)

### Community 24 - "test-data.ts"
Cohesion: 0.18
Nodes (15): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal (+7 more)

### Community 25 - "AmountFilter"
Cohesion: 0.11
Nodes (21): AmountFilter(), readRange(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput() (+13 more)

### Community 26 - "paginated-data-table.tsx"
Cohesion: 0.11
Nodes (42): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), pageHref(), pageWindow(), PaginationFooter(), GroupHeaderRow() (+34 more)

### Community 27 - "Domain View Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 28 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 29 - "drive-sync.ts"
Cohesion: 0.28
Nodes (21): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+13 more)

### Community 30 - "providers.tsx"
Cohesion: 0.20
Nodes (13): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/speed-insights, ShellHeader(), SidebarInset() (+5 more)

### Community 31 - "records.ts"
Cohesion: 0.13
Nodes (18): AllocationRow, db, getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly(), AllocationTally, tallyAllocations(), budgetCovers() (+10 more)

### Community 32 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 33 - "Validator"
Cohesion: 0.23
Nodes (18): updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory(), createMonthlyBudget() (+10 more)

### Community 34 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 35 - "chart.tsx"
Cohesion: 0.22
Nodes (10): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+2 more)

### Community 36 - "sidebar.tsx"
Cohesion: 0.11
Nodes (23): AppHeader(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarInput() (+15 more)

### Community 37 - "google-drive.ts"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken() (+6 more)

### Community 38 - "JavaScript Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "category-filter.tsx"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 40 - "Graph Refresh Workflow"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "Biome Tool Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "Type Safety Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 43 - "daily-spending-chart.tsx"
Cohesion: 0.24
Nodes (16): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro() (+8 more)

### Community 44 - "next"
Cohesion: 0.19
Nodes (10): MonthLayout(), ReviewLinks(), nextConfig, luxon, next, TITLES, SearchInit, useMonthParams() (+2 more)

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Canonical Finance Concepts"
Cohesion: 0.23
Nodes (13): Account, Allocation, Budget, Category, Finpoint, Monthly Budget, Monthly Budget amount, Pending Record (+5 more)

### Community 47 - "General Formatting Rules"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "Development Dependencies"
Cohesion: 0.25
Nodes (8): devDependencies, @biomejs/biome, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react, @types/react-dom

### Community 49 - "total-spending-chart.tsx"
Cohesion: 0.36
Nodes (8): LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart(), CashflowHistoryMonth

### Community 50 - "Platform Native Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "Project Commands"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "statements.ts"
Cohesion: 0.18
Nodes (20): countSuggestions(), AnalyticsRecord, AnalyticsSummary, dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+12 more)

### Community 53 - "Style Lint Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 54 - "Icon Concept Branding"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 55 - "Shadow Icon Branding"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 56 - "Finpoint Brand Identity"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 58 - "Apple Touch Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 59 - "JPEG Favicon Branding"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 60 - "PNG Favicon Branding"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 61 - "SVG Favicon Branding"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 62 - "Small App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 63 - "Large App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 70 - "monthly-budget-usage.tsx"
Cohesion: 0.39
Nodes (6): arc(), centerCurrency(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, compactAmount, formatChartCurrency()

### Community 71 - "spending-calendar.tsx"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 72 - "history.tsx"
Cohesion: 0.40
Nodes (4): getStoredHistory(), HistoryContext, HistoryItem, HistoryProvider()

### Community 77 - "Repository Code Style"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 78 - "hashSnapshot"
Cohesion: 0.43
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 82 - "Finance Feature Overview"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 86 - "Commit Branch Conventions"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 87 - "Local Data Synchronization"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

## Knowledge Gaps
- **76 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 491 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `lucide-react`, `Button`, `monthly/page.tsx`, `app-sidebar.tsx`, `pending/page.tsx`, `sync/page.tsx`, `allocator-tabs.tsx`, `(month)/page.tsx`, `date-range.tsx`, `importer/page.tsx`, `utils.ts`, `AmountFilter`, `paginated-data-table.tsx`, `providers.tsx`, `chart.tsx`, `sidebar.tsx`, `category-filter.tsx`, `daily-spending-chart.tsx`, `next`, `total-spending-chart.tsx`, `monthly-budget-usage.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07566437007874016 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `lucide-react`, `Button`, `cn`, `monthly/page.tsx`, `pending/page.tsx`, `sync/page.tsx`, `package.json`, `(month)/page.tsx`, `category-history-chart.tsx`, `date-range.tsx`, `auto-sync.ts`, `importer/page.tsx`, `AmountFilter`, `paginated-data-table.tsx`, `providers.tsx`, `use-appearance.tsx`, `chart.tsx`, `sidebar.tsx`, `category-filter.tsx`, `daily-spending-chart.tsx`, `next`, `total-spending-chart.tsx`, `monthly-budget-usage.tsx`, `history.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._
- **Why does `Button()` connect `Button` to `lucide-react`, `cn`, `sidebar.tsx`, `monthly/page.tsx`, `app-sidebar.tsx`, `pending/page.tsx`, `category-filter.tsx`, `sync/page.tsx`, `next`, `(month)/page.tsx`, `date-range.tsx`, `importer/page.tsx`, `utils.ts`, `AmountFilter`, `paginated-data-table.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `Application Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.09956709956709957 - nodes in this community are weakly interconnected._