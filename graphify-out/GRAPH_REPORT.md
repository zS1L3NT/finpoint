# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1943 nodes · 7809 edges · 103 communities (92 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 52,654 input · 1,347 output

## Graph Freshness
- Built from commit: `f5ae5138`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Duplicate & Pending Views
- Budget & Record Dialogs
- Domain & Importer Tests
- Graph Refresh Rules
- Sidebar & Appearance Shell
- Analytics Calculations
- Dropdown & Alert Primitives
- Appearance Theme Hook
- Chart Browser Tests
- Statement File Importers
- Data Table Components
- TypeScript Compiler Config
- Editor & Sheet Tests
- App Sidebar & Header
- Month Layout & Metrics
- Dashboard View
- Runtime Dependencies
- Database Schema Types
- Monthly Budget Logic
- Spending Calendar
- Budget & Cashflow Charts
- Duplicate Replacement Logic
- Category History Chart
- Biome Suspicious Rules
- Package Manifest
- Component Inventory Tooling
- Biome Correctness Rules
- Record Suggestions Engine
- Component Browser Tests
- Sync Status & Auto-sync
- Animation Tests
- Workspace Test Fixtures
- Google Drive Integration
- Layer Architecture Rules
- Export & Import Data
- shadcn Component Config
- Seed & Test Data
- Combobox Components
- Search Sheets & Filters
- Domain Type Definitions
- Domain Glossary
- Auth Broker Routes
- Categories & Monthly Pages
- Duplicate Detection Logic
- Database & Seeding
- Bar & Trend Charts
- Navigation Tests
- Biome Formatter Options
- Dev Dependencies
- Pagination Components
- Budgets & Pending Logic
- Commands & Tooling Rules
- Verification & Next.js Rules
- Month Filters & Command
- Route & Table Tests
- Biome Config
- Biome Complexity Rules
- Web App Manifest
- Accounts & Importer Pages
- NPM Scripts
- Data Settings & Alerts
- Records & Statements Pages
- Biome Formatter Settings
- Core Domain Concepts
- Budgets Page & Date Fields
- Agent Skills & Docs
- Optional Platform Dependencies
- Record Table Columns
- E2E TypeScript Config
- Biome Style Rules
- Root Layout & Harness
- Code Style Guide
- Icon With Shadow
- Icon With Shadow Variant
- Issue Tracker Docs
- Finpoint Icon
- Domain Docs Guide
- Local Tracker Operations
- Drive Sync Overview
- F Monogram Icon
- JPG Favicon
- PNG Favicon
- SVG Favicon
- F Monogram Icon Variant
- F Monogram Icon Copy
- App Icon Palette
- Domain Docs Conflicts
- Conventions
- Crawler Policy
- Demo Data Generation
- PWA Setup
- Statement Rules Logic
- UI Header & Button Group
- Recurring Charge Suggestions
- Recurring Page & Month Params
- Month Picker & Toaster
- Workflow E2E Tests
- History Navigation Context
- Workflow Tabs & Settings
- Validation Errors

## God Nodes (most connected - your core abstractions)
1. `cn()` - 323 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 98 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 57 edges
9. `round2()` - 47 edges
10. `next` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Change-scoped required checks that always report** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Group matrix to gate and merged HTML report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_blob_report_merge, github_workflows_ci_core, github_workflows_ci_animations [EXTRACTED 0.95]
- **Test file to CI group membership enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, tests_readme_areas, github_workflows_ci_ci [EXTRACTED 0.95]
- **CI browser test pipeline: setup, grouped runs, gated report merge** — github_actions_setup_action_setup, github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, _github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Change-scoped job skipping with required checks still reporting** — github_workflows_ci_changes, github_workflows_ci_checks, github_workflows_ci_domain, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_required_checks [EXTRACTED 1.00]
- **Test group to gate to merged report flow** — github_workflows_ci_core_group, github_workflows_ci_animations_group, github_workflows_ci_core, github_workflows_ci_animations, github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Every browser test file joins exactly one CI group, enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, github_workflows_ci_core_group, github_workflows_ci_animations_group, agents_verification_rules [INFERRED 0.95]

## Communities (103 total, 11 thin omitted)

### Community 0 - "Duplicate & Pending Views"
Cohesion: 0.20
Nodes (31): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+23 more)

### Community 1 - "Budget & Record Dialogs"
Cohesion: 0.07
Nodes (130): CandidateResults(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), SECTIONS, ImporterPage(), Step() (+122 more)

### Community 2 - "Domain & Importer Tests"
Cohesion: 0.14
Nodes (7): dexie, fake-indexeddb, xlsx, decided(), live(), record(), statement()

### Community 3 - "Graph Refresh Rules"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "Sidebar & Appearance Shell"
Cohesion: 0.12
Nodes (33): Providers(), AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 5 - "Analytics Calculations"
Cohesion: 0.11
Nodes (42): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+34 more)

### Community 6 - "Dropdown & Alert Primitives"
Cohesion: 0.10
Nodes (42): AlertAction(), AlertDialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+34 more)

### Community 7 - "Appearance Theme Hook"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 8 - "Chart Browser Tests"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "Statement File Importers"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 10 - "Data Table Components"
Cohesion: 0.25
Nodes (23): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+15 more)

### Community 11 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Editor & Sheet Tests"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+14 more)

### Community 13 - "App Sidebar & Header"
Cohesion: 0.20
Nodes (25): ReviewLinks(), Template(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+17 more)

### Community 14 - "Month Layout & Metrics"
Cohesion: 0.18
Nodes (17): framer-motion, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric(), RecordAmount() (+9 more)

### Community 15 - "Dashboard View"
Cohesion: 0.12
Nodes (35): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+27 more)

### Community 16 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Database Schema Types"
Cohesion: 0.11
Nodes (30): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+22 more)

### Community 18 - "Monthly Budget Logic"
Cohesion: 0.27
Nodes (16): updateAccount(), validateBudget(), cleanInput(), restoreDuplicatePair(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS, PACE_KINDS, setMonthlyBudgetAmount() (+8 more)

### Community 19 - "Spending Calendar"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 20 - "Budget & Cashflow Charts"
Cohesion: 0.26
Nodes (11): BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CashflowChart(), CashflowPoint, SurplusPoint, TotalSpendingChart(), TrendChart() (+3 more)

### Community 21 - "Duplicate Replacement Logic"
Cohesion: 0.16
Nodes (24): countSuggestions(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+16 more)

### Community 22 - "Category History Chart"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 23 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "Package Manifest"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 25 - "Component Inventory Tooling"
Cohesion: 0.07
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "Record Suggestions Engine"
Cohesion: 0.10
Nodes (32): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+24 more)

### Community 28 - "Component Browser Tests"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "Sync Status & Auto-sync"
Cohesion: 0.11
Nodes (26): Boot(), db, useSyncStatus(), useSyncToasts(), emit(), eventListeners, finishCycle(), getSyncSnapshot() (+18 more)

### Community 30 - "Animation Tests"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "Workspace Test Fixtures"
Cohesion: 0.24
Nodes (11): ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace() (+3 more)

### Community 32 - "Google Drive Integration"
Cohesion: 0.18
Nodes (29): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+21 more)

### Community 33 - "Layer Architecture Rules"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 34 - "Export & Import Data"
Cohesion: 0.19
Nodes (16): clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), parseImportFile(), SYNC_TABLES, TableName (+8 more)

### Community 35 - "shadcn Component Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Seed & Test Data"
Cohesion: 0.18
Nodes (15): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, BANK_BLURB, between(), CATEGORIES, DAILY, generateTestData(), Meal (+7 more)

### Community 37 - "Combobox Components"
Cohesion: 0.11
Nodes (24): Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+16 more)

### Community 38 - "Search Sheets & Filters"
Cohesion: 0.20
Nodes (26): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+18 more)

### Community 39 - "Domain Type Definitions"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "Domain Glossary"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "Auth Broker Routes"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "Categories & Monthly Pages"
Cohesion: 0.13
Nodes (27): CategoriesPage(), CategoryDialogState, CategoryTile(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordsPage(), Rule (+19 more)

### Community 43 - "Duplicate Detection Logic"
Cohesion: 0.23
Nodes (15): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, eligible() (+7 more)

### Community 44 - "Database & Seeding"
Cohesion: 0.23
Nodes (11): FinpointDB, withoutActionModes(), exportData(), tableCounts(), SEED_HASH_KEY, seedIfEmpty(), digestSnapshot(), hashLegacySnapshot() (+3 more)

### Community 45 - "Bar & Trend Charts"
Cohesion: 0.19
Nodes (16): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+8 more)

### Community 47 - "Biome Formatter Options"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "Pagination Components"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "Budgets & Pending Logic"
Cohesion: 0.13
Nodes (26): PendingCard(), round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), listBudgets(), pendingStatementIds() (+18 more)

### Community 51 - "Commands & Tooling Rules"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Verification & Next.js Rules"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 53 - "Month Filters & Command"
Cohesion: 0.17
Nodes (21): MonthLayout(), @base-ui/react, DateField(), CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup() (+13 more)

### Community 54 - "Route & Table Tests"
Cohesion: 0.18
Nodes (13): Child, october, september, PREMATURE, routeReady, titles, installDateOnly(), revisions (+5 more)

### Community 55 - "Biome Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Accounts & Importer Pages"
Cohesion: 0.13
Nodes (19): AccountCard(), AccountRow, AccountsPage(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, NotFound(), metadata, SECTIONS (+11 more)

### Community 59 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "Data Settings & Alerts"
Cohesion: 0.15
Nodes (26): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+18 more)

### Community 61 - "Records & Statements Pages"
Cohesion: 0.32
Nodes (17): AccountPage(), AllocatorPage(), RecordsPage(), StatementsPage(), PageHeader(), SelectionBar(), byDay(), usePaginatedTableState() (+9 more)

### Community 62 - "Biome Formatter Settings"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Core Domain Concepts"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Budgets Page & Date Fields"
Cohesion: 0.19
Nodes (18): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), RecordCreatorHost(), react-day-picker, Props (+10 more)

### Community 65 - "Agent Skills & Docs"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Optional Platform Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "Record Table Columns"
Cohesion: 0.19
Nodes (21): amountTone(), formatRowTime(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell(), RecordAmountCell(), RecordEditButton() (+13 more)

### Community 68 - "E2E TypeScript Config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Root Layout & Harness"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 71 - "Code Style Guide"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 72 - "Icon With Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Icon With Shadow Variant"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Issue Tracker Docs"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint Icon"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Domain Docs Guide"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 77 - "Local Tracker Operations"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 79 - "Drive Sync Overview"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 80 - "F Monogram Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 81 - "JPG Favicon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 82 - "PNG Favicon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 83 - "SVG Favicon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 84 - "F Monogram Icon Variant"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F Monogram Icon Copy"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 94 - "Statement Rules Logic"
Cohesion: 0.21
Nodes (14): StatementRow, TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), previewStatementRule() (+6 more)

### Community 95 - "UI Header & Button Group"
Cohesion: 0.18
Nodes (12): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+4 more)

### Community 96 - "Recurring Charge Suggestions"
Cohesion: 0.26
Nodes (12): parseDatetime(), inferRecordDatetime(), createModel(), loadTables(), monthlyPattern(), prepareSuggestions(), recordSuggestions(), recurringCharges() (+4 more)

### Community 97 - "Recurring Page & Month Params"
Cohesion: 0.29
Nodes (9): LANES, ordinal(), RecurringPage(), luxon, SearchInit, useMonthParams(), STALE_MONTH_CLASS, takeMonthDirection() (+1 more)

### Community 98 - "Month Picker & Toaster"
Cohesion: 0.22
Nodes (8): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS, Toaster()

### Community 100 - "History Navigation Context"
Cohesion: 0.36
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 101 - "Workflow Tabs & Settings"
Cohesion: 0.62
Nodes (5): WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings(), pathAllocatorDuplicates()

### Community 102 - "Validation Errors"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

## Knowledge Gaps
- **83 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 589 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Sidebar & Appearance Shell` to `Duplicate & Pending Views`, `Budget & Record Dialogs`, `Dropdown & Alert Primitives`, `Data Table Components`, `Month Layout & Metrics`, `Dashboard View`, `Spending Calendar`, `Combobox Components`, `Search Sheets & Filters`, `Categories & Monthly Pages`, `Bar & Trend Charts`, `Pagination Components`, `Budgets & Pending Logic`, `Month Filters & Command`, `Accounts & Importer Pages`, `Data Settings & Alerts`, `Records & Statements Pages`, `Budgets Page & Date Fields`, `Record Table Columns`, `UI Header & Button Group`, `Recurring Page & Month Params`, `Month Picker & Toaster`, `Workflow Tabs & Settings`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Budget & Record Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.06548577563070317 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Categories & Monthly Pages` to `Duplicate & Pending Views`, `Budget & Record Dialogs`, `Sidebar & Appearance Shell`, `Dropdown & Alert Primitives`, `Appearance Theme Hook`, `Data Table Components`, `App Sidebar & Header`, `Month Layout & Metrics`, `Dashboard View`, `Spending Calendar`, `Budget & Cashflow Charts`, `Category History Chart`, `Package Manifest`, `Sync Status & Auto-sync`, `Combobox Components`, `Search Sheets & Filters`, `Bar & Trend Charts`, `Pagination Components`, `Month Filters & Command`, `Accounts & Importer Pages`, `Data Settings & Alerts`, `Records & Statements Pages`, `Budgets Page & Date Fields`, `Record Table Columns`, `Root Layout & Harness`, `UI Header & Button Group`, `Recurring Page & Month Params`, `Month Picker & Toaster`, `History Navigation Context`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `Domain & Importer Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `Layer Architecture Rules` to `Sync Status & Auto-sync`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `Graph Refresh Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._