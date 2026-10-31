# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1933 nodes · 7738 edges · 95 communities (84 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 29,857 input · 1,252 output

## Graph Freshness
- Built from commit: `335c0b45`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Test Source Analysis Helpers
- Record and Account Dialogs
- Test Database and Snapshots
- Project Graph Rules
- Sidebar and Appearance
- Dashboard Calculations
- Dropdown Menu Primitives
- Root Layout and Providers
- Chart Browser Tests
- Statement Importer
- Data Table Components
- TypeScript Compiler Config
- Editor and Sheet Tests
- App Sidebar and Header
- Categories Page and Charts
- Month Layout and Dashboard
- Runtime Dependencies
- Database Schema Rows
- Monthly Budget Logic
- Spending Calendar
- Code Style Guide
- Statement Replacements
- Category History Chart
- Biome Suspicious Rules
- Package Manifest
- Component Inventory Tests
- Biome Correctness Rules
- Statement Rules
- Component and Modal Tests
- Drive Sync Status
- Animation Browser Tests
- Route and Table Tests
- Google Drive Auth
- Layer Architecture Rules
- Export and Import Data
- shadcn Components Config
- Defaults and Test Data
- Vite Harness Config
- Search and Filter Sheets
- Domain Type Definitions
- Domain Glossary
- Auth Broker Routes
- Accounts and Duplicates Pages
- Duplicate Statement Detection
- Category Filter and Command
- Bar and Trend Charts
- Navigation Browser Tests
- Biome Formatter Style
- Dev Dependencies
- Pagination Components
- Budgets and Records Logic
- Commands and Agent Behavior
- Verification and Next.js Rules
- Analytics and Categories Logic
- Navigation History Provider
- Biome Configuration
- Biome Complexity Rules
- PWA Web Manifest
- Playwright Config and URLs
- NPM Scripts
- Data Settings and Alerts
- Biome Formatter Options
- Dashboard and Budgets Features
- Combobox Components
- Domain and Tracker Docs
- Optional Platform Dependencies
- E2E TypeScript Config
- Biome Style Rules
- Finpoint Icon Concept
- Finpoint Icon With Shadow
- Local Issue Tracker
- Finpoint Icon Elements
- Domain Docs Guide
- Local Tracker Operations
- Drive Sync and Backup
- F Monogram Icon
- JPG Favicon Icon
- PNG Favicon Icon
- SVG Favicon Icon
- F Monogram Icon Variant
- F Monogram Icon Copy
- App Icon Palette
- Domain Docs Conflicts
- Conventions
- Crawler Policy
- Generated Demo Data
- Progressive Web App
- Button Group and Separators
- Month Picker
- Workflow Browser Tests
- Charts and Next Templates
- Validation Logic

## God Nodes (most connected - your core abstractions)
1. `cn()` - 321 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 77 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `next` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx
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

## Communities (95 total, 11 thin omitted)

### Community 0 - "Test Source Analysis Helpers"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 1 - "Record and Account Dialogs"
Cohesion: 0.07
Nodes (108): react, react-day-picker, react-dom, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+100 more)

### Community 2 - "Test Database and Snapshots"
Cohesion: 0.12
Nodes (12): dexie, fake-indexeddb, xlsx, FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot (+4 more)

### Community 3 - "Project Graph Rules"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "Sidebar and Appearance"
Cohesion: 0.13
Nodes (31): AppearanceSwitch(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+23 more)

### Community 5 - "Dashboard Calculations"
Cohesion: 0.11
Nodes (40): AllocationRow, db, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison() (+32 more)

### Community 6 - "Dropdown Menu Primitives"
Cohesion: 0.09
Nodes (46): AlertAction(), AlertDialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel() (+38 more)

### Community 7 - "Root Layout and Providers"
Cohesion: 0.14
Nodes (24): metadata, RootLayout(), viewport, Boot(), Providers(), ShellHeader(), Toaster(), Appearance (+16 more)

### Community 8 - "Chart Browser Tests"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "Statement Importer"
Cohesion: 0.19
Nodes (26): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), CardFooter(), BANKS, ensureAccount(), combine() (+18 more)

### Community 10 - "Data Table Components"
Cohesion: 0.16
Nodes (30): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal() (+22 more)

### Community 11 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Editor and Sheet Tests"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+14 more)

### Community 13 - "App Sidebar and Header"
Cohesion: 0.19
Nodes (27): NotFound(), lucide-react, AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator() (+19 more)

### Community 14 - "Categories Page and Charts"
Cohesion: 0.18
Nodes (14): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, CategoryMovers(), Mover, CategorySpendingMix(), arc() (+6 more)

### Community 15 - "Month Layout and Dashboard"
Cohesion: 0.11
Nodes (29): MonthLayout(), Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage() (+21 more)

### Community 16 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Database Schema Rows"
Cohesion: 0.11
Nodes (28): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION, DuplicateDismissalRow (+20 more)

### Community 18 - "Monthly Budget Logic"
Cohesion: 0.21
Nodes (21): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), restoreDuplicatePair(), amountFor(), createMonthlyBudget() (+13 more)

### Community 19 - "Spending Calendar"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 20 - "Code Style Guide"
Cohesion: 0.17
Nodes (13): APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions, Grouping And Order (+5 more)

### Community 21 - "Statement Replacements"
Cohesion: 0.18
Nodes (21): asPending(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement (+13 more)

### Community 22 - "Category History Chart"
Cohesion: 0.24
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 23 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "Package Manifest"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 25 - "Component Inventory Tests"
Cohesion: 0.11
Nodes (24): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry, routeInventory (+16 more)

### Community 26 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "Statement Rules"
Cohesion: 0.07
Nodes (49): Rule, RuleSentence(), StatementRulesPage(), ruleValueLabel(), byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules() (+41 more)

### Community 28 - "Component and Modal Tests"
Cohesion: 0.23
Nodes (6): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha()

### Community 29 - "Drive Sync Status"
Cohesion: 0.13
Nodes (39): downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile(), useSyncStatus() (+31 more)

### Community 30 - "Animation Browser Tests"
Cohesion: 0.17
Nodes (19): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, pickOption(), attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement() (+11 more)

### Community 31 - "Route and Table Tests"
Cohesion: 0.14
Nodes (22): Child, october, september, PREMATURE, routeReady, titles, getScenario(), installDateOnly() (+14 more)

### Community 32 - "Google Drive Auth"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 33 - "Layer Architecture Rules"
Cohesion: 0.15
Nodes (17): app/**/page.tsx, Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Pages take no props (+9 more)

### Community 34 - "Export and Import Data"
Cohesion: 0.17
Nodes (21): withoutActionModes(), clearAllData(), downloadExport(), exportData(), importData(), parseImportFile(), SYNC_TABLES, tableCounts() (+13 more)

### Community 35 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Defaults and Test Data"
Cohesion: 0.16
Nodes (16): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, BANK_BLURB, between(), CATEGORIES, DAILY (+8 more)

### Community 37 - "Vite Harness Config"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 38 - "Search and Filter Sheets"
Cohesion: 0.20
Nodes (25): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+17 more)

### Community 39 - "Domain Type Definitions"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "Domain Glossary"
Cohesion: 0.18
Nodes (16): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+8 more)

### Community 41 - "Auth Broker Routes"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "Accounts and Duplicates Pages"
Cohesion: 0.05
Nodes (171): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+163 more)

### Community 43 - "Duplicate Statement Detection"
Cohesion: 0.21
Nodes (16): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+8 more)

### Community 44 - "Category Filter and Command"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 45 - "Bar and Trend Charts"
Cohesion: 0.19
Nodes (17): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+9 more)

### Community 47 - "Biome Formatter Style"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "Pagination Components"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "Budgets and Records Logic"
Cohesion: 0.12
Nodes (22): round2(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), listBudgets(), updateBudget(), inferRecordDatetime() (+14 more)

### Community 51 - "Commands and Agent Behavior"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Verification and Next.js Rules"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 53 - "Analytics and Categories Logic"
Cohesion: 0.21
Nodes (9): AnalyticsRecord, AnalyticsSummary, CategoryInput, createCategory(), updateCategory(), fromCents(), slugify(), TREATMENT_VALUES (+1 more)

### Community 54 - "Navigation History Provider"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 55 - "Biome Configuration"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "PWA Web Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Playwright Config and URLs"
Cohesion: 0.38
Nodes (3): desktopOnly, APP_URL, HARNESS_URL

### Community 59 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "Data Settings and Alerts"
Cohesion: 0.16
Nodes (24): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+16 more)

### Community 62 - "Biome Formatter Options"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Dashboard and Budgets Features"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Combobox Components"
Cohesion: 0.11
Nodes (24): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+16 more)

### Community 65 - "Domain and Tracker Docs"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Optional Platform Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "E2E TypeScript Config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "Finpoint Icon Concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Finpoint Icon With Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Local Issue Tracker"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint Icon Elements"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Domain Docs Guide"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 77 - "Local Tracker Operations"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 79 - "Drive Sync and Backup"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 80 - "F Monogram Icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 81 - "JPG Favicon Icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 82 - "PNG Favicon Icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 83 - "SVG Favicon Icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 84 - "F Monogram Icon Variant"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F Monogram Icon Copy"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 95 - "Button Group and Separators"
Cohesion: 0.22
Nodes (11): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+3 more)

### Community 98 - "Month Picker"
Cohesion: 0.33
Nodes (6): ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 100 - "Charts and Next Templates"
Cohesion: 0.20
Nodes (15): InvestmentRow(), ReviewLinks(), Template(), nextConfig, next, CashflowChart(), CashflowPoint, DailySpendingChart() (+7 more)

### Community 102 - "Validation Logic"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

## Knowledge Gaps
- **83 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 588 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Sidebar and Appearance` to `Combobox Components`, `Record and Account Dialogs`, `Month Picker`, `Search and Filter Sheets`, `Dropdown Menu Primitives`, `Statement Importer`, `Accounts and Duplicates Pages`, `Data Table Components`, `Category Filter and Command`, `Bar and Trend Charts`, `Categories Page and Charts`, `Month Layout and Dashboard`, `App Sidebar and Header`, `Pagination Components`, `Spending Calendar`, `Statement Rules`, `Data Settings and Alerts`, `Button Group and Separators`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Record and Account Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.07278636856101645 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Record and Account Dialogs` to `Sidebar and Appearance`, `Dropdown Menu Primitives`, `Root Layout and Providers`, `Statement Importer`, `Data Table Components`, `App Sidebar and Header`, `Categories Page and Charts`, `Month Layout and Dashboard`, `Spending Calendar`, `Category History Chart`, `Package Manifest`, `Statement Rules`, `Drive Sync Status`, `Search and Filter Sheets`, `Accounts and Duplicates Pages`, `Category Filter and Command`, `Bar and Trend Charts`, `Pagination Components`, `Navigation History Provider`, `Data Settings and Alerts`, `Combobox Components`, `Button Group and Separators`, `Month Picker`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `Test Database and Snapshots` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `Layer Architecture Rules` to `Root Layout and Providers`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Project Graph Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._