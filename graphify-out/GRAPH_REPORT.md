# Graph Report - t3code-af43b5a2  (2026-10-11)

## Corpus Check
- 190 files · ~105,149 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1421 nodes · 5508 edges · 70 communities (63 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.85)
- Token cost: unavailable for host-agent semantic extraction; zero values in the local cost tracker are placeholders, not measured usage. Structural extraction used no LLM tokens.

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
- Domain Validation and Targets
- Shared Domain Types
- OAuth Broker and Cookies
- Application Boot and Layout
- Appearance and Theme State
- Allocation and Record Queries
- Google Drive Authentication
- Budget Analytics View
- Combobox Components
- Shared Month Navigation
- Sidebar Primitives
- Amount and Category Filters
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
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `AccountPage()` --calls--> `AccountDialog()`  [EXTRACTED]
  app/accounts/[id]/page.tsx → src/components/dialogs/account.tsx
- `AccountPage()` --calls--> `PendingStatementDialog()`  [EXTRACTED]
  app/accounts/[id]/page.tsx → src/components/dialogs/pending-statement.tsx
- `AccountPage()` --calls--> `Metric()`  [EXTRACTED]
  app/accounts/[id]/page.tsx → src/components/metric.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Separate meaning, accounting and spending planning** — context_category, context_treatment, context_spending_bucket, context_record [EXTRACTED 1.00]
- **Imported activity explained by managed records** — context_statement, context_allocation, context_record [EXTRACTED 1.00]
- **Separated application layers** — agents_ui_layer, agents_domain_operations, agents_persistence_layer [EXTRACTED 1.00]
- **Committed graph refresh artifacts** — agents_graph_json, agents_graph_report, agents_graph_manifest, agents_graph_labels [EXTRACTED 1.00]

## Communities (70 total, 7 thin omitted)

### Community 0 - "Accounts and Allocation"
Cohesion: 0.06
Nodes (111): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), AllocatorPendingPage(), CandidatePage, PendingCard() (+103 more)

### Community 1 - "Record Forms and Dialogs"
Cohesion: 0.07
Nodes (107): CandidateResults(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, sonner, @tanstack/react-form, AccountDialog(), BucketDialog(), EditableBucket (+99 more)

### Community 2 - "Budgets Tables and Metrics"
Cohesion: 0.08
Nodes (55): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), framer-motion, @tanstack/react-table, rangeFromValue() (+47 more)

### Community 3 - "Menu and Button Primitives"
Cohesion: 0.06
Nodes (42): Amount(), AlertAction(), ButtonGroupSeparator(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+34 more)

### Community 4 - "Architecture and Domain Documentation"
Cohesion: 0.07
Nodes (32): Background Drive sync, CONTEXT.md, Dexie IndexedDB, First-run seed, Generated test data, JSON export/import, Installed Next.js documentation, React Compiler (+24 more)

### Community 5 - "Financial Charts"
Cohesion: 0.15
Nodes (32): luxon, recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), colorChange(), CashflowChart() (+24 more)

### Community 6 - "Sidebar and Settings Navigation"
Cohesion: 0.14
Nodes (32): NotFound(), AllocatorTabs(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+24 more)

### Community 7 - "Monthly Dashboard"
Cohesion: 0.11
Nodes (31): BucketDailyData, BucketUsageBar(), Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardBucket, DashboardCategory (+23 more)

### Community 8 - "Dashboard Aggregation Engine"
Cohesion: 0.14
Nodes (30): db, avg(), buildBuckets(), buildCategories(), buildComparison(), buildProjection(), buildSeries(), buildSpendingHistory() (+22 more)

### Community 9 - "TypeScript Compiler Settings"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 11 - "Sync Settings Interface"
Cohesion: 0.14
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+18 more)

### Community 12 - "Lint Safety Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 13 - "Package Metadata"
Cohesion: 0.07
Nodes (27): private, $schema, type, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter, lightningcss-linux-x64-gnu (+19 more)

### Community 14 - "Date Forms and Filters"
Cohesion: 0.15
Nodes (23): @base-ui/react, DateField(), Props, parseValue(), Props, toInputValue(), CategoryFilter(), CategoryFilterItem() (+15 more)

### Community 15 - "Lint Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 16 - "Database Schema"
Cohesion: 0.08
Nodes (17): dexie, AccountRow, AnalyticsMonthRow, BucketDefaultRow, BucketRow, BucketTargetRow, BudgetRecordRow, BudgetRow (+9 more)

### Community 17 - "Importer and Category Views"
Cohesion: 0.25
Nodes (21): ImporterPage(), Step(), BucketStatus(), WeekdayCard(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+13 more)

### Community 18 - "Buttons and Date Controls"
Cohesion: 0.17
Nodes (14): class-variance-authority, radix-ui, react, react-day-picker, DateRangeValue, formatRange(), Props, badgeVariants (+6 more)

### Community 19 - "Pending Statement Review"
Cohesion: 0.32
Nodes (19): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), Input(), Sheet() (+11 more)

### Community 20 - "Background Sync Engine"
Cohesion: 0.13
Nodes (23): useSyncStatus(), emit(), eventListeners, finishCycle(), flushOnHide(), getSyncSnapshot(), ingestManualResult(), markDirty() (+15 more)

### Community 21 - "Statement Replacement Logic"
Cohesion: 0.19
Nodes (21): countSuggestions(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement (+13 more)

### Community 22 - "Component Generator Settings"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 23 - "Bank Statement Import"
Cohesion: 0.25
Nodes (19): asPending(), ensureAccount(), combine(), dbsDescriptionKey(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+11 more)

### Community 24 - "Seed and Sample Data"
Cohesion: 0.17
Nodes (16): DEFAULT_BUCKETS, DEFAULT_CATEGORIES, FinpointExport, BANK_BLURB, between(), BUCKETS, CATEGORIES, DAILY (+8 more)

### Community 25 - "Google Drive File Operations"
Cohesion: 0.34
Nodes (18): exportData(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+10 more)

### Community 26 - "Domain Validation and Targets"
Cohesion: 0.35
Nodes (10): updateAccount(), createBucket(), setBucketTarget(), updateBucket(), validateBudget(), cleanInput(), validateRecordInput(), updateSettings() (+2 more)

### Community 27 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Bucket, Budget, Category (+10 more)

### Community 28 - "OAuth Broker and Cookies"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 29 - "Application Boot and Layout"
Cohesion: 0.19
Nodes (13): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, SidebarInset() (+5 more)

### Community 30 - "Appearance and Theme State"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 31 - "Allocation and Record Queries"
Cohesion: 0.18
Nodes (14): AllocationRow, AllocationTally, pendingStatementIds(), tallyAllocations(), budgetCovers(), enrichRecords(), expandCategoryIds(), listRecords() (+6 more)

### Community 32 - "Google Drive Authentication"
Cohesion: 0.20
Nodes (14): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DRIVE_FILENAME, DRIVE_SCOPE, DriveFileMeta, ensureDriveToken() (+6 more)

### Community 33 - "Budget Analytics View"
Cohesion: 0.26
Nodes (12): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), Sparkline(), Delta, Metric(), ValueSwap() (+4 more)

### Community 34 - "Combobox Components"
Cohesion: 0.17
Nodes (11): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel(), ComboboxSeparator() (+3 more)

### Community 35 - "Shared Month Navigation"
Cohesion: 0.22
Nodes (11): MonthLayout(), ButtonGroup(), ButtonGroupText(), buttonGroupVariants, ButtonVariant, Month, MonthCal(), MonthCalProps (+3 more)

### Community 36 - "Sidebar Primitives"
Cohesion: 0.24
Nodes (11): lucide-react, SidebarContext, SidebarContextProps, SidebarMenuButton(), sidebarMenuButtonVariants, SidebarMenuSkeleton(), Skeleton(), Tooltip() (+3 more)

### Community 37 - "Amount and Category Filters"
Cohesion: 0.25
Nodes (12): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroupAddon() (+4 more)

### Community 38 - "JavaScript Formatting Rules"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 39 - "Data Import and Settings"
Cohesion: 0.27
Nodes (10): EXPORT_VERSION, importData(), SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings() (+2 more)

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
Cohesion: 0.27
Nodes (10): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+2 more)

### Community 44 - "Chart Primitives"
Cohesion: 0.22
Nodes (10): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+2 more)

### Community 45 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 46 - "Shell Headers and Titles"
Cohesion: 0.36
Nodes (6): AppHeader(), ShellHeader(), TITLES, SidebarTrigger(), SearchInit, useMonthParams()

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
Cohesion: 0.43
Nodes (5): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), fromCents()

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
- **70 isolated node(s):** `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu`, `lightningcss-win32-x64-msvc`, `react-dom` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 476 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Menu and Button Primitives` to `Accounts and Allocation`, `Record Forms and Dialogs`, `Budgets Tables and Metrics`, `Financial Charts`, `Sidebar and Settings Navigation`, `Monthly Dashboard`, `Sync Settings Interface`, `Date Forms and Filters`, `Importer and Category Views`, `Buttons and Date Controls`, `Pending Statement Review`, `Application Boot and Layout`, `Budget Analytics View`, `Combobox Components`, `Shared Month Navigation`, `Sidebar Primitives`, `Amount and Category Filters`, `Chart Primitives`, `Shell Headers and Titles`, `Spending Calendar`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@fontsource-variable/inter`, `lightningcss-linux-x64-gnu` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts and Allocation` be split into smaller, more focused modules?**
  _Cohesion score 0.05861522691268288 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Buttons and Date Controls` to `Accounts and Allocation`, `Record Forms and Dialogs`, `Budgets Tables and Metrics`, `Menu and Button Primitives`, `Financial Charts`, `Monthly Dashboard`, `Sync Settings Interface`, `Package Metadata`, `Date Forms and Filters`, `Importer and Category Views`, `Pending Statement Review`, `Background Sync Engine`, `Application Boot and Layout`, `Appearance and Theme State`, `Budget Analytics View`, `Combobox Components`, `Shared Month Navigation`, `Sidebar Primitives`, `Amount and Category Filters`, `Chart Primitives`, `Shell Headers and Titles`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `Record Forms and Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.06860598477739548 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Accounts and Allocation` to `Record Forms and Dialogs`, `Budgets Tables and Metrics`, `Shared Month Navigation`, `Financial Charts`, `Sidebar and Settings Navigation`, `Monthly Dashboard`, `Sync Settings Interface`, `Package Metadata`, `Shell Headers and Titles`, `Importer and Category Views`, `OAuth Broker and Cookies`, `Application Boot and Layout`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `Budgets Tables and Metrics` be split into smaller, more focused modules?**
  _Cohesion score 0.08269394714407502 - nodes in this community are weakly interconnected._
## Generation Notes
- This is a static knowledge graph, not a runtime trace. Common UI utilities and configuration nodes can dominate rankings; low cohesion alone does not justify a refactor.
- The initial AST extraction reported 3 dangling-endpoint edges and 34 same-endpoint edge collapses. The refreshed serialized graph passes endpoint integrity checks, but an incremental refresh cannot recover relationship details lost during the initial build.
- JPG, PNG, and SVG favicon variants now have separate semantic node IDs and source provenance.
- postcss.config.mjs yielded no symbols; its file node is retained.
- The graph data, report, manifest, and community labels are shared in Git. Caches, local HTML, and machine-specific files are ignored.
