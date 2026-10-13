# Graph Report - t3-b88747ce  (2026-10-14)

## Corpus Check
- 185 files · ~108,835 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1452 nodes · 5569 edges · 77 communities (67 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4db100e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (month)/layout.tsx
- record-editor.tsx
- cn
- export-import.ts
- Application Architecture
- record-search.tsx
- app-sidebar.tsx
- pagination.tsx
- dashboard.ts
- TypeScript Compiler Configuration
- Runtime Dependencies
- sync/page.tsx
- Suspicious Code Rules
- package.json
- use-persistent-state.ts
- Correctness Lint Rules
- db.ts
- (month)/page.tsx
- category-history-chart.tsx
- auto-sync.ts
- round2
- UI Component Configuration
- Button
- test-data.ts
- react
- paginated-data-table.tsx
- Domain View Types
- auth-vault.ts
- drive-sync.ts
- providers.tsx
- records.ts
- use-appearance.tsx
- Validator
- cashflow-chart.tsx
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
- luxon
- Repository Code Style
- snapshot-hash.ts
- Finance Feature Overview
- Commit Branch Conventions
- Local Data Synchronization
- Generated Demo Data
- Progressive Web App

## God Nodes (most connected - your core abstractions)
1. `cn()` - 302 edges
2. `Button()` - 108 edges
3. `react` - 88 edges
4. `formatCurrency()` - 70 edges
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
- `MonthLayout()` --calls--> `useHistory()`  [EXTRACTED]
  app/(month)/layout.tsx → src/history.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_monthly_budget, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (77 total, 10 thin omitted)

### Community 0 - "(month)/layout.tsx"
Cohesion: 0.11
Nodes (29): MonthLayout(), lucide-react, react-day-picker, DateField(), Props, DatetimeField(), parseValue(), Props (+21 more)

### Community 1 - "record-editor.tsx"
Cohesion: 0.08
Nodes (94): AllocatorPendingPage(), CandidatePage, CandidateResults(), PendingCard(), class-variance-authority, sonner, @tanstack/react-form, AccountDialog() (+86 more)

### Community 2 - "cn"
Cohesion: 0.09
Nodes (27): AlertAction(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+19 more)

### Community 3 - "export-import.ts"
Cohesion: 0.24
Nodes (11): EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS (+3 more)

### Community 4 - "Application Architecture"
Cohesion: 0.10
Nodes (10): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+2 more)

### Community 5 - "record-search.tsx"
Cohesion: 0.29
Nodes (19): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), badgeVariants, Input() (+11 more)

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.14
Nodes (32): AllocatorTabs(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+24 more)

### Community 7 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.16
Nodes (32): AllocationRow, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+24 more)

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
Nodes (28): private, $schema, type, @base-ui/react, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 15 - "Correctness Lint Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "db.ts"
Cohesion: 0.09
Nodes (15): dexie, AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+7 more)

### Community 17 - "(month)/page.tsx"
Cohesion: 0.17
Nodes (26): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+18 more)

### Community 18 - "category-history-chart.tsx"
Cohesion: 0.15
Nodes (20): BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), aggregateSeries(), CategoryHistoryChart(), ChartMonth (+12 more)

### Community 20 - "auto-sync.ts"
Cohesion: 0.13
Nodes (22): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), markDirty(), refreshSyncDisplay() (+14 more)

### Community 21 - "round2"
Cohesion: 0.29
Nodes (17): ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult, importRevolut() (+9 more)

### Community 22 - "UI Component Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "Button"
Cohesion: 0.05
Nodes (141): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BudgetPage(), getBudgetAnalytics(), getCategoryData() (+133 more)

### Community 24 - "test-data.ts"
Cohesion: 0.18
Nodes (15): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal (+7 more)

### Community 25 - "react"
Cohesion: 0.11
Nodes (27): react, AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound() (+19 more)

### Community 26 - "paginated-data-table.tsx"
Cohesion: 0.12
Nodes (38): framer-motion, @tanstack/react-table, Sparkline(), Delta, Metric(), DataTable(), PaginatedDataTable(), GroupHeaderRow() (+30 more)

### Community 27 - "Domain View Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 28 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 29 - "drive-sync.ts"
Cohesion: 0.35
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 30 - "providers.tsx"
Cohesion: 0.15
Nodes (17): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarInset() (+9 more)

### Community 31 - "records.ts"
Cohesion: 0.12
Nodes (22): db, BudgetFilters, createBudget(), getBudget(), listBudgets(), getMonthlyRecords(), MonthlyFilters, expandCategoryIdsForMonthly() (+14 more)

### Community 32 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 33 - "Validator"
Cohesion: 0.20
Nodes (21): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), CategoryInput, cleanInput(), createCategory(), TREATMENTS, updateCategory() (+13 more)

### Community 34 - "cashflow-chart.tsx"
Cohesion: 0.31
Nodes (9): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), mobileAmount, seriesLabel(), StatefulActiveDot() (+1 more)

### Community 36 - "sidebar.tsx"
Cohesion: 0.09
Nodes (30): radix-ui, AppHeader(), ShellHeader(), TITLES, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+22 more)

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
Cohesion: 0.17
Nodes (15): recharts, MonthlyBudgetLine, MonthlyBudgetBadge(), ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent() (+7 more)

### Community 44 - "next"
Cohesion: 0.22
Nodes (4): nextConfig, next, HistoryContext, HistoryItem

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
Cohesion: 0.12
Nodes (30): countSuggestions(), asPending(), AnalyticsRecord, AnalyticsSummary, updateRecord(), validateAllocations(), dayDifference(), ensureCanReplace() (+22 more)

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

### Community 71 - "luxon"
Cohesion: 0.31
Nodes (8): luxon, compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 77 - "Repository Code Style"
Cohesion: 0.27
Nodes (10): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order, React / TypeScript Style (+2 more)

### Community 78 - "snapshot-hash.ts"
Cohesion: 0.40
Nodes (4): FinpointDB, digestSnapshot(), hashLegacySnapshot(), Snapshot

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 487 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `(month)/layout.tsx`, `record-editor.tsx`, `sidebar.tsx`, `record-search.tsx`, `app-sidebar.tsx`, `monthly-budget-usage.tsx`, `luxon`, `category-filter.tsx`, `pagination.tsx`, `sync/page.tsx`, `daily-spending-chart.tsx`, `(month)/page.tsx`, `total-spending-chart.tsx`, `Button`, `react`, `paginated-data-table.tsx`, `providers.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(month)/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10510510510510511 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `(month)/layout.tsx`, `record-editor.tsx`, `cn`, `record-search.tsx`, `pagination.tsx`, `sync/page.tsx`, `package.json`, `use-persistent-state.ts`, `(month)/page.tsx`, `category-history-chart.tsx`, `auto-sync.ts`, `Button`, `paginated-data-table.tsx`, `providers.tsx`, `use-appearance.tsx`, `sidebar.tsx`, `category-filter.tsx`, `daily-spending-chart.tsx`, `next`, `total-spending-chart.tsx`, `monthly-budget-usage.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08175473579262213 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Runtime Dependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._