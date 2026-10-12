# Graph Report - t3-3cd2d1b1  (2026-10-12)

## Corpus Check
- 179 files · ~105,335 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1424 nodes · 5507 edges · 68 communities (58 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a0f305a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Accounts and Allocation
- Record Forms and Dialogs
- Budgets Tables and Metrics
- Menu and Button Primitives
- Architecture and Domain Documentation
- Financial Charts
- Sidebar and Settings Navigation
- Monthly Dashboard
- Dashboard Aggregation Engine
- TypeScript Compiler Settings
- Runtime Dependencies
- Sync Settings Interface
- Lint Safety Rules
- Package Metadata
- Date Forms and Filters
- Lint Correctness Rules
- Database Schema
- Importer and Category Views
- Buttons and Date Controls
- Pending Statement Review
- Background Sync Engine
- Statement Replacement Logic
- Component Generator Settings
- Bank Statement Import
- Seed and Sample Data
- Google Drive File Operations
- Shared Domain Types
- OAuth Broker and Cookies
- Application Boot and Layout
- Appearance and Theme State
- Allocation and Record Queries
- Google Drive Authentication
- Budget Analytics View
- Shared Month Navigation
- Sidebar Primitives
- JavaScript Formatting Rules
- Data Import and Settings
- Graph Maintenance Workflow
- Biome Tool Configuration
- Lint Complexity Rules
- Category History Charts
- Chart Primitives
- Web App Manifest
- Shell Headers and Titles
- General Formatting Settings
- Development Dependencies
- Spending Calendar
- Platform Binary Dependencies
- Project Commands
- Accounting Treatment Analytics
- Lint Style Rules
- Brand Icon Concept
- Shadow Icon Variant
- Vector Brand Icon
- Apple Touch Icon
- JPG Favicon Artwork
- PNG Favicon Artwork
- SVG Favicon Artwork
- Small App Icon
- Large App Icon
- Next.js Development Instructions
- Brand Palette Prompt
- Biome Verification
- String Primary Keys
- Crawler Policy

## God Nodes (most connected - your core abstractions)
1. `cn()` - 301 edges
2. `Button()` - 108 edges
3. `react` - 86 edges
4. `formatCurrency()` - 70 edges
5. `RecordEditorDialog()` - 62 edges
6. `RecordCreatorDialog()` - 46 edges
7. `UiIcon()` - 45 edges
8. `DataSettingsPage()` - 41 edges
9. `ValidationError` - 40 edges
10. `PageContent()` - 38 edges

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
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_spending_bucket, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]

## Communities (68 total, 10 thin omitted)

### Community 0 - "Accounts and Allocation"
Cohesion: 0.09
Nodes (74): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard() (+66 more)

### Community 1 - "Record Forms and Dialogs"
Cohesion: 0.08
Nodes (96): CandidateResults(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, class-variance-authority, sonner, @tanstack/react-form (+88 more)

### Community 2 - "Budgets Tables and Metrics"
Cohesion: 0.05
Nodes (80): framer-motion, @tanstack/react-table, Sparkline(), Delta, Metric(), DataTable(), PaginatedDataTable(), pageHref() (+72 more)

### Community 3 - "Menu and Button Primitives"
Cohesion: 0.27
Nodes (13): NotFound(), AllocatorTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAccounts(), pathAllocator(), pathAllocatorPending() (+5 more)

### Community 4 - "Architecture and Domain Documentation"
Cohesion: 0.07
Nodes (32): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+24 more)

### Community 5 - "Financial Charts"
Cohesion: 0.22
Nodes (15): BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CHART_INTRO_MS, useChartIntro(), BucketLine (+7 more)

### Community 6 - "Sidebar and Settings Navigation"
Cohesion: 0.20
Nodes (17): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), SidebarFooter() (+9 more)

### Community 7 - "Monthly Dashboard"
Cohesion: 0.11
Nodes (27): BucketDailyData, BucketUsageBar(), Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardBucket, DashboardCategory (+19 more)

### Community 8 - "Dashboard Aggregation Engine"
Cohesion: 0.18
Nodes (24): avg(), buildBuckets(), buildCashflowHistory(), buildCategories(), buildComparison(), buildProjection(), buildSeries(), buildTrend() (+16 more)

### Community 9 - "TypeScript Compiler Settings"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Sync Settings Interface"
Cohesion: 0.16
Nodes (22): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+14 more)

### Community 12 - "Lint Safety Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "Package Metadata"
Cohesion: 0.07
Nodes (27): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+19 more)

### Community 14 - "Date Forms and Filters"
Cohesion: 0.08
Nodes (45): BudgetCard(), BudgetState, formatBudgetDateWindow(), react-day-picker, DateField(), Props, DateRange(), DateRangeValue (+37 more)

### Community 15 - "Lint Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "Database Schema"
Cohesion: 0.11
Nodes (15): dexie, AccountRow, AnalyticsMonthRow, BucketDefaultRow, BucketRow, BucketTargetRow, BudgetRecordRow, BudgetRow (+7 more)

### Community 17 - "Importer and Category Views"
Cohesion: 0.09
Nodes (61): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BucketStatus(), DashboardPage(), ScopedCardTitle(), ScopeLabel() (+53 more)

### Community 18 - "Buttons and Date Controls"
Cohesion: 0.36
Nodes (7): CashflowChart(), CashflowPoint, colorChange(), currencyOrDash(), LegendItem(), seriesLabel(), StatefulActiveDot()

### Community 19 - "Pending Statement Review"
Cohesion: 0.09
Nodes (50): @base-ui/react, radix-ui, react, PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet() (+42 more)

### Community 20 - "Background Sync Engine"
Cohesion: 0.13
Nodes (24): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+16 more)

### Community 21 - "Statement Replacement Logic"
Cohesion: 0.07
Nodes (63): countSuggestions(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), FieldError(), asPending(), BANKS (+55 more)

### Community 22 - "Component Generator Settings"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 24 - "Seed and Sample Data"
Cohesion: 0.17
Nodes (16): DEFAULT_BUCKETS, DEFAULT_CATEGORIES, FinpointExport, BANK_BLURB, between(), BUCKETS, CATEGORIES, DAILY (+8 more)

### Community 25 - "Google Drive File Operations"
Cohesion: 0.34
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 27 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Bucket, Budget, Category (+10 more)

### Community 28 - "OAuth Broker and Cookies"
Cohesion: 0.28
Nodes (15): POST(), POST(), POST(), jose, next, AUTH_COOKIE_NAME, authCookie(), authCookieConfig() (+7 more)

### Community 29 - "Application Boot and Layout"
Cohesion: 0.20
Nodes (12): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarProvider() (+4 more)

### Community 30 - "Appearance and Theme State"
Cohesion: 0.23
Nodes (15): lucide-react, Toaster(), applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 31 - "Allocation and Record Queries"
Cohesion: 0.15
Nodes (17): AllocationRow, loadDashboardTables(), AllocationTally, isPendingRecord(), pendingStatementIds(), tallyAllocations(), ConflictError, deleteRecord() (+9 more)

### Community 32 - "Google Drive Authentication"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent() (+6 more)

### Community 35 - "Shared Month Navigation"
Cohesion: 0.17
Nodes (13): MonthLayout(), luxon, getStoredHistory(), HistoryContext, HistoryItem, HistoryProvider(), useHistory(), SearchInit (+5 more)

### Community 36 - "Sidebar Primitives"
Cohesion: 0.11
Nodes (23): SidebarContent(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarHeader(), SidebarInput(), SidebarInset() (+15 more)

### Community 38 - "JavaScript Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "Data Import and Settings"
Cohesion: 0.18
Nodes (14): clearAllData(), downloadExport(), EXPORT_VERSION, importData(), parseImportFile(), SYNC_TABLES, tableCounts(), TableName (+6 more)

### Community 40 - "Graph Maintenance Workflow"
Cohesion: 0.20
Nodes (9): Graph health warnings, graphify-out/graph.json, graphify-out/.graphify_labels.json, graphify-out/manifest.json, graphify-out/GRAPH_REPORT.md, graphify skill, graphify update ., Local graph artifacts (+1 more)

### Community 41 - "Biome Tool Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 42 - "Lint Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 43 - "Category History Charts"
Cohesion: 0.24
Nodes (11): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+3 more)

### Community 44 - "Chart Primitives"
Cohesion: 0.14
Nodes (20): recharts, LegendItem(), niceStep(), roundTick(), surplusAxis(), SurplusPoint, surplusZeroOffset(), TotalSpendingChart() (+12 more)

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Shell Headers and Titles"
Cohesion: 0.53
Nodes (4): AppHeader(), ShellHeader(), TITLES, SidebarTrigger()

### Community 47 - "General Formatting Settings"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 48 - "Development Dependencies"
Cohesion: 0.25
Nodes (8): devDependencies, @biomejs/biome, @tailwindcss/postcss, @types/luxon, @types/node, @types/papaparse, @types/react, @types/react-dom

### Community 49 - "Spending Calendar"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 50 - "Platform Binary Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 51 - "Project Commands"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:check, start, types:check

### Community 52 - "Accounting Treatment Analytics"
Cohesion: 0.24
Nodes (10): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), buildSpendingHistory(), getMonthlyRecords(), MonthlyFilters (+2 more)

### Community 53 - "Lint Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 54 - "Brand Icon Concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 55 - "Shadow Icon Variant"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 56 - "Vector Brand Icon"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 58 - "Apple Touch Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 59 - "JPG Favicon Artwork"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 60 - "PNG Favicon Artwork"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 61 - "SVG Favicon Artwork"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 62 - "Small App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 63 - "Large App Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **70 isolated node(s):** `@fontsource-variable/inter`, `react-dom`, `shadcn`, `tailwindcss`, `tw-animate-css` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 477 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Budgets Tables and Metrics` to `Accounts and Allocation`, `Record Forms and Dialogs`, `Shared Month Navigation`, `Menu and Button Primitives`, `Financial Charts`, `Sidebar Primitives`, `Monthly Dashboard`, `Sidebar and Settings Navigation`, `Sync Settings Interface`, `Chart Primitives`, `Date Forms and Filters`, `Shell Headers and Titles`, `Importer and Category Views`, `Spending Calendar`, `Pending Statement Review`, `Statement Replacement Logic`, `Application Boot and Layout`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `react-dom`, `shadcn` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts and Allocation` be split into smaller, more focused modules?**
  _Cohesion score 0.09013157894736842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Pending Statement Review` to `Accounts and Allocation`, `Record Forms and Dialogs`, `Budgets Tables and Metrics`, `Shared Month Navigation`, `Sidebar Primitives`, `Financial Charts`, `Monthly Dashboard`, `Sync Settings Interface`, `Chart Primitives`, `Package Metadata`, `Date Forms and Filters`, `Shell Headers and Titles`, `Importer and Category Views`, `Background Sync Engine`, `Statement Replacement Logic`, `Application Boot and Layout`, `Appearance and Theme State`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Record Forms and Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.08047690014903129 - nodes in this community are weakly interconnected._
- **Why does `next` connect `OAuth Broker and Cookies` to `Accounts and Allocation`, `Record Forms and Dialogs`, `Budget Analytics View`, `Shared Month Navigation`, `Menu and Button Primitives`, `Financial Charts`, `Sidebar and Settings Navigation`, `Monthly Dashboard`, `Budgets Tables and Metrics`, `Sync Settings Interface`, `Chart Primitives`, `Package Metadata`, `Shell Headers and Titles`, `Importer and Category Views`, `Buttons and Date Controls`, `Statement Replacement Logic`, `Domain Validation and Targets`, `Application Boot and Layout`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `Budgets Tables and Metrics` be split into smaller, more focused modules?**
  _Cohesion score 0.053267326732673266 - nodes in this community are weakly interconnected._