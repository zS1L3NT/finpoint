# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1941 nodes · 7806 edges · 95 communities (86 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 29,623 input · 1,244 output

## Graph Freshness
- Built from commit: `6bd66abb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Accounts and Duplicates Pages
- Record Dialogs and Budgets
- Database Schema and Rows
- Graph Artifact Rules
- UI Primitive Components
- Analytics and Dashboard Logic
- Dropdown and Button Group UI
- Appearance and Theme
- Chart Tests
- Statement Importer
- Data Table Components
- TypeScript Compiler Config
- Editor and Sheet Tests
- Month Layout and Recurring
- Small Display Widgets
- Dashboard Page and Comparisons
- Runtime Dependencies
- Workflow E2E Tests
- Monthly Budgets and Duplicate Fixing
- Spending Calendar
- Dashboard Trend Charts
- Statement Replacements
- Category History Chart
- Biome Suspicious Lint Rules
- Package Manifest
- Test Component Inventory
- Biome Correctness Lint Rules
- Record Suggestions Model
- Component and Modal Tests
- Auto Sync Engine
- Animation Modal and Table Tests
- Workspace Test Fixtures
- Drive Backup Sync
- Layer Segregation Architecture
- Export and Import Data
- shadcn Components Config
- Seed and Default Data
- Combobox Components
- Search Sheets and Badges
- Shared Domain Types
- Domain Glossary
- Auth Broker Routes
- Amount Filter Controls
- Duplicate Detection Logic
- Database Snapshot Hashing
- Chart Primitives
- Navigation and Playwright Config
- Biome Formatter Options
- Dev Dependencies
- Pagination Components
- Accounts, Budgets, Categories Logic
- Commands and Linting
- Auth Broker and Next.js
- Category Filter and Command
- Route Tests
- Biome Config
- Biome Complexity Lint Rules
- PWA Web Manifest
- Test Lint Helpers
- NPM Scripts
- Google Drive Auth
- Providers and Sync Toasts
- Biome Formatter Settings
- Domain Model Concepts
- Vite Harness Config
- Agent Skills and Docs
- Optional Platform Dependencies
- Pages and URL State
- E2E TypeScript Config
- Biome Style Rules
- Root Layout and Testing
- Style and Validation Rules
- Icon With Shadow
- Icon With Shadow Halo
- Local Issue Tracker
- Finpoint Icon
- Domain Docs Guide
- Local Tracker Operations
- Drive Sync Product
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
- Generated Demo Data
- Progressive Web App
- UI Layer Rules

## God Nodes (most connected - your core abstractions)
1. `cn()` - 323 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 98 edges
5. `formatCurrency()` - 79 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 57 edges
8. `RecordCreatorDialog()` - 57 edges
9. `round2()` - 47 edges
10. `next` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx
- `SECTIONS` --calls--> `treatmentLabel()`  [EXTRACTED]
  app/categories/page.tsx → src/lib/analytics.ts

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

## Communities (95 total, 9 thin omitted)

### Community 0 - "Accounts and Duplicates Pages"
Cohesion: 0.05
Nodes (138): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+130 more)

### Community 1 - "Record Dialogs and Budgets"
Cohesion: 0.07
Nodes (132): CandidateResults(), BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), ImporterPage(), EmptyRecords(), metadata (+124 more)

### Community 2 - "Database Schema and Rows"
Cohesion: 0.08
Nodes (28): dexie, fake-indexeddb, xlsx, AnalyticsMonthRow, DB_NAME, DB_VERSION, MetaRow, MonthlyBudgetAmountRow (+20 more)

### Community 3 - "Graph Artifact Rules"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "UI Primitive Components"
Cohesion: 0.08
Nodes (58): Providers(), AppearanceSwitch(), AlertAction(), AlertDialogTrigger(), CardFooter(), DropdownMenu(), DropdownMenuGroup(), DropdownMenuPortal() (+50 more)

### Community 5 - "Analytics and Dashboard Logic"
Cohesion: 0.11
Nodes (42): db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories() (+34 more)

### Community 6 - "Dropdown and Button Group UI"
Cohesion: 0.11
Nodes (34): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, DropdownMenuCheckboxItem() (+26 more)

### Community 7 - "Appearance and Theme"
Cohesion: 0.24
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 8 - "Chart Tests"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "Statement Importer"
Cohesion: 0.23
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importOcbc(), ImportResult (+12 more)

### Community 10 - "Data Table Components"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), MOBILE_LIST_CLASS (+17 more)

### Community 11 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Editor and Sheet Tests"
Cohesion: 0.13
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 13 - "Month Layout and Recurring"
Cohesion: 0.05
Nodes (84): BudgetState, MonthLayout(), ReviewLinks(), LANES, ordinal(), RecurringPage(), NotFound(), COUNT_ROWS (+76 more)

### Community 14 - "Small Display Widgets"
Cohesion: 0.14
Nodes (17): react-dom, AllocateBar(), Sparkline(), DetailSummaryItem(), Delta, Metric(), RecordAmount(), ValueSwap() (+9 more)

### Community 15 - "Dashboard Page and Comparisons"
Cohesion: 0.13
Nodes (29): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+21 more)

### Community 16 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Workflow E2E Tests"
Cohesion: 0.11
Nodes (19): AccountRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, DBS_VALID, buildDense(), buildEmpty(), buildPopulated() (+11 more)

### Community 18 - "Monthly Budgets and Duplicate Fixing"
Cohesion: 0.22
Nodes (21): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair() (+13 more)

### Community 19 - "Spending Calendar"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 20 - "Dashboard Trend Charts"
Cohesion: 0.25
Nodes (10): BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CashflowChart(), CashflowPoint, SurplusPoint, TotalSpendingChart(), TrendChart() (+2 more)

### Community 21 - "Statement Replacements"
Cohesion: 0.16
Nodes (24): countSuggestions(), asPending(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+16 more)

### Community 22 - "Category History Chart"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 23 - "Biome Suspicious Lint Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "Package Manifest"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+20 more)

### Community 25 - "Test Component Inventory"
Cohesion: 0.11
Nodes (24): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry, routeInventory (+16 more)

### Community 26 - "Biome Correctness Lint Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "Record Suggestions Model"
Cohesion: 0.09
Nodes (42): CategoryRow, MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue (+34 more)

### Community 28 - "Component and Modal Tests"
Cohesion: 0.18
Nodes (9): bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput(), settledOverlayAlpha() (+1 more)

### Community 29 - "Auto Sync Engine"
Cohesion: 0.14
Nodes (21): SYNC_TABLES, emit(), eventListeners, finishCycle(), flushOnHide(), ingestManualResult(), markDirty(), refreshSyncDisplay() (+13 more)

### Community 30 - "Animation Modal and Table Tests"
Cohesion: 0.18
Nodes (17): denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade(), matrixIsIdentity() (+9 more)

### Community 31 - "Workspace Test Fixtures"
Cohesion: 0.24
Nodes (11): ScenarioName, WorkspaceDataset, WorkspaceTables, assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace() (+3 more)

### Community 32 - "Drive Backup Sync"
Cohesion: 0.28
Nodes (21): exportData(), disconnectDrive(), downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured() (+13 more)

### Community 33 - "Layer Segregation Architecture"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 34 - "Export and Import Data"
Cohesion: 0.21
Nodes (16): clearAllData(), downloadExport(), importData(), parseImportFile(), tableCounts(), TableName, TABLES, DEFAULT_SETTINGS (+8 more)

### Community 35 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Seed and Default Data"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 37 - "Combobox Components"
Cohesion: 0.13
Nodes (19): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+11 more)

### Community 38 - "Search Sheets and Badges"
Cohesion: 0.33
Nodes (18): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), Badge(), badgeVariants, Sheet() (+10 more)

### Community 39 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "Domain Glossary"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "Auth Broker Routes"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "Amount Filter Controls"
Cohesion: 0.24
Nodes (12): AmountFilter(), AmountRange, COMPARISONS, describe(), Draft, readRange(), upperBound(), InputGroupInput() (+4 more)

### Community 43 - "Duplicate Detection Logic"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 44 - "Database Snapshot Hashing"
Cohesion: 0.33
Nodes (5): FinpointDB, withoutActionModes(), digestSnapshot(), hashLegacySnapshot(), Snapshot

### Community 45 - "Chart Primitives"
Cohesion: 0.19
Nodes (16): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+8 more)

### Community 46 - "Navigation and Playwright Config"
Cohesion: 0.15
Nodes (5): desktopOnly, expectBackAboveHeadingFromKeyboardNavigation(), keyboardBack(), APP_URL, HARNESS_URL

### Community 47 - "Biome Formatter Options"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "Pagination Components"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "Accounts, Budgets, Categories Logic"
Cohesion: 0.09
Nodes (33): AllocationRow, round2(), AccountActivity, NO_ACTIVITY, BudgetDetail, BudgetFilters, createBudget(), getBudget() (+25 more)

### Community 51 - "Commands and Linting"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Auth Broker and Next.js"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "Category Filter and Command"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 54 - "Route Tests"
Cohesion: 0.17
Nodes (14): denseCardConsumers, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+6 more)

### Community 55 - "Biome Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "Biome Complexity Lint Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "PWA Web Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Test Lint Helpers"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 59 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "Google Drive Auth"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId(), hasFreshDriveToken() (+4 more)

### Community 61 - "Providers and Sync Toasts"
Cohesion: 0.36
Nodes (7): Boot(), @vercel/analytics, @vercel/speed-insights, seedIfEmpty(), useSyncToasts(), subscribeSyncEvents(), listCategoryIconNames()

### Community 62 - "Biome Formatter Settings"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Domain Model Concepts"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Vite Harness Config"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 65 - "Agent Skills and Docs"
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 66 - "Optional Platform Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "Pages and URL State"
Cohesion: 0.33
Nodes (5): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination)

### Community 68 - "E2E TypeScript Config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Root Layout and Testing"
Cohesion: 0.22
Nodes (8): bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), String primary keys (not auto-increment), Verification, metadata, RootLayout(), viewport

### Community 71 - "Style and Validation Rules"
Cohesion: 0.13
Nodes (17): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator, APIs, Arguments, And Props, Code Style, Consistency, Copy (+9 more)

### Community 72 - "Icon With Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Icon With Shadow Halo"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Local Issue Tracker"
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

### Community 79 - "Drive Sync Product"
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

### Community 94 - "UI Layer Rules"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **83 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 588 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Dropdown and Button Group UI` to `Accounts and Duplicates Pages`, `Record Dialogs and Budgets`, `UI Primitive Components`, `Combobox Components`, `Search Sheets and Badges`, `Amount Filter Controls`, `Data Table Components`, `Month Layout and Recurring`, `Small Display Widgets`, `Dashboard Page and Comparisons`, `Chart Primitives`, `Pagination Components`, `Spending Calendar`, `Category Filter and Command`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts and Duplicates Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.051974138472161195 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Record Dialogs and Budgets` to `Accounts and Duplicates Pages`, `UI Primitive Components`, `Dropdown and Button Group UI`, `Appearance and Theme`, `Data Table Components`, `Month Layout and Recurring`, `Small Display Widgets`, `Dashboard Page and Comparisons`, `Spending Calendar`, `Dashboard Trend Charts`, `Category History Chart`, `Package Manifest`, `Combobox Components`, `Search Sheets and Badges`, `Amount Filter Controls`, `Chart Primitives`, `Pagination Components`, `Category Filter and Command`, `Providers and Sync Toasts`, `Root Layout and Testing`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `Record Dialogs and Budgets` be split into smaller, more focused modules?**
  _Cohesion score 0.06790505675954592 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `Layer Segregation Architecture` to `Providers and Sync Toasts`, `Root Layout and Testing`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `Database Schema and Rows` be split into smaller, more focused modules?**
  _Cohesion score 0.08181818181818182 - nodes in this community are weakly interconnected._