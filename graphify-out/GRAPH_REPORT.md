# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1944 nodes · 7810 edges · 95 communities (84 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 29,404 input · 1,225 output

## Graph Freshness
- Built from commit: `1a9267b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Test Source Analysis Helpers
- Duplicates and Record Dialogs
- Dexie Database Schema
- Graph Artifact Rules
- App Shell and Sidebar
- Dashboard Analytics Builders
- Filters and Combobox UI
- Appearance Theme Hook
- Chart E2E Tests
- Statement Importer Logic
- Data Table Components
- TypeScript Config
- Editor and Sheet Tests
- Month Layout and Recurring
- Logic and Data Layers
- Month Overview Page
- Runtime Dependencies
- Test Data Fixtures
- Monthly Budgets and Duplicates Logic
- Spending Calendar
- UI Layer Conventions
- Statement Replacements Logic
- Category History Chart
- Biome Suspicious Rules
- Package Manifest
- Test Component Inventory
- Biome Correctness Rules
- Suggestion Scoring Logic
- Playwright Component Tests
- Drive Sync Engine
- Animation Test Helpers
- Route Animation and Fixtures
- Google Drive Client
- UI Architecture Rules
- Export Import and Seeding
- shadcn Components Config
- Seed Defaults and Test Data
- Vite Harness Config
- Search Sheets and Filters
- Shared Domain Types
- Domain Glossary
- Auth Route Handlers
- Accounts and Allocator Pages
- Duplicate Detection Logic
- Sync Toasts and Boot
- Bar Chart Components
- Navigation E2E Tests
- Biome Formatter Options
- Dev Dependencies
- Pagination Components
- Records and Analytics Logic
- Project Commands
- Next.js Auth Broker
- Route and Table Tests
- Biome Config
- Biome Complexity Rules
- Web App Manifest
- Importer and Dashboard Pages
- NPM Scripts
- Data Settings and Dialogs
- Biome Formatter Settings
- Product Feature Overview
- Form Field Components
- Domain and Tracker Docs
- Optional Platform Dependencies
- E2E TypeScript Config
- Biome Style Rules
- Icon Concept Shadow
- Icon With Shadow
- Issue Tracker Docs
- Finpoint Icon
- Domain Docs Guide
- Local Tracker Operations
- Local-first Sync Features
- F Monogram Icon
- JPG Favicon
- PNG Favicon
- SVG Favicon
- F Monogram Dot
- F Monogram Letterform
- App Icon Palette
- Domain Docs Conflicts
- Conventions
- Crawler Policy
- Generated Demo Data
- Progressive Web App
- Header and Button UI
- Month Picker
- Workflow E2E Tests
- Dashboard Chart Components
- Settings Hook
- Validation Error Handling

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

## Communities (95 total, 11 thin omitted)

### Community 0 - "Test Source Analysis Helpers"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 1 - "Duplicates and Record Dialogs"
Cohesion: 0.07
Nodes (115): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+107 more)

### Community 2 - "Dexie Database Schema"
Cohesion: 0.08
Nodes (21): dexie, fake-indexeddb, xlsx, AccountRow, AnalyticsMonthRow, DB_NAME, DB_VERSION, FinpointDB (+13 more)

### Community 3 - "Graph Artifact Rules"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "App Shell and Sidebar"
Cohesion: 0.09
Nodes (42): metadata, RootLayout(), viewport, Providers(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar() (+34 more)

### Community 5 - "Dashboard Analytics Builders"
Cohesion: 0.10
Nodes (42): AllocationRow, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison() (+34 more)

### Community 6 - "Filters and Combobox UI"
Cohesion: 0.09
Nodes (54): CategoryFilter(), CategoryFilterItem(), AlertAction(), AlertDialogTrigger(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear() (+46 more)

### Community 7 - "Appearance Theme Hook"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 8 - "Chart E2E Tests"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "Statement Importer Logic"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 10 - "Data Table Components"
Cohesion: 0.17
Nodes (30): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal() (+22 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Editor and Sheet Tests"
Cohesion: 0.13
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 13 - "Month Layout and Recurring"
Cohesion: 0.13
Nodes (34): MonthLayout(), ReviewLinks(), LANES, ordinal(), RecurringPage(), NotFound(), Template(), nextConfig (+26 more)

### Community 14 - "Logic and Data Layers"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 15 - "Month Overview Page"
Cohesion: 0.12
Nodes (25): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+17 more)

### Community 16 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Test Data Fixtures"
Cohesion: 0.13
Nodes (22): BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, MonthlyBudgetDefaultRow, buildDense(), buildEmpty(), buildPopulated() (+14 more)

### Community 18 - "Monthly Budgets and Duplicates Logic"
Cohesion: 0.22
Nodes (21): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), fixDuplicates(), pairIds(), restoreDuplicatePair(), amountFor() (+13 more)

### Community 19 - "Spending Calendar"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 20 - "UI Layer Conventions"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 21 - "Statement Replacements Logic"
Cohesion: 0.16
Nodes (24): countSuggestions(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+16 more)

### Community 22 - "Category History Chart"
Cohesion: 0.31
Nodes (10): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+2 more)

### Community 23 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "Package Manifest"
Cohesion: 0.06
Nodes (31): private, $schema, type, babel-plugin-react-compiler, @base-ui/react, @biomejs/biome, clsx, cmdk (+23 more)

### Community 25 - "Test Component Inventory"
Cohesion: 0.11
Nodes (24): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable, openFacets, RouteEntry, routeInventory (+16 more)

### Community 26 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "Suggestion Scoring Logic"
Cohesion: 0.10
Nodes (35): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+27 more)

### Community 28 - "Playwright Component Tests"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "Drive Sync Engine"
Cohesion: 0.14
Nodes (37): SYNC_TABLES, downloadBackupFile(), driveFetch(), findBackupFile(), getClockSkewMs(), getFileMeta(), isDriveConfigured(), uploadBackupFile() (+29 more)

### Community 30 - "Animation Test Helpers"
Cohesion: 0.18
Nodes (17): denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade(), matrixIsIdentity() (+9 more)

### Community 31 - "Route Animation and Fixtures"
Cohesion: 0.19
Nodes (16): denseCardConsumers, Child, october, september, installDateOnly(), revisions, setDateOnly(), assertSeeded() (+8 more)

### Community 32 - "Google Drive Client"
Cohesion: 0.24
Nodes (12): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), DriveFileMeta, ensureDriveToken(), ensureDriveTokenSilent(), googleClientId() (+4 more)

### Community 33 - "UI Architecture Rules"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "Export Import and Seeding"
Cohesion: 0.20
Nodes (19): db, clearAllData(), downloadExport(), exportData(), importData(), parseImportFile(), tableCounts(), TableName (+11 more)

### Community 35 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Seed Defaults and Test Data"
Cohesion: 0.15
Nodes (18): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES (+10 more)

### Community 37 - "Vite Harness Config"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 38 - "Search Sheets and Filters"
Cohesion: 0.18
Nodes (27): radix-ui, react, PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+19 more)

### Community 39 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "Domain Glossary"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "Auth Route Handlers"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "Accounts and Allocator Pages"
Cohesion: 0.05
Nodes (141): AccountPage(), AccountCard(), AccountRow, AccountsPage(), AllocatorPage(), BudgetPage(), getBudgetAnalytics(), getCategoryData() (+133 more)

### Community 43 - "Duplicate Detection Logic"
Cohesion: 0.27
Nodes (9): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, DuplicateStatement, eligible(), FixDuplicatesInput, GENERIC, sameDayKey() (+1 more)

### Community 44 - "Sync Toasts and Boot"
Cohesion: 0.50
Nodes (4): Boot(), useSyncToasts(), subscribeSyncEvents(), listCategoryIconNames()

### Community 45 - "Bar Chart Components"
Cohesion: 0.17
Nodes (18): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), SurplusPoint (+10 more)

### Community 47 - "Biome Formatter Options"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "Pagination Components"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "Records and Analytics Logic"
Cohesion: 0.13
Nodes (21): asPending(), AnalyticsRecord, AnalyticsSummary, createBudget(), analyticsValues(), budgetCovers(), ConflictError, createRecord() (+13 more)

### Community 51 - "Project Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js Auth Broker"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 54 - "Route and Table Tests"
Cohesion: 0.22
Nodes (9): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows() (+1 more)

### Community 55 - "Biome Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Importer and Dashboard Pages"
Cohesion: 0.21
Nodes (24): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), DashboardPage(), ScopedCardTitle(), ScopeLabel(), WeekdayCard() (+16 more)

### Community 59 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "Data Settings and Dialogs"
Cohesion: 0.13
Nodes (28): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+20 more)

### Community 62 - "Biome Formatter Settings"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Product Feature Overview"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Form Field Components"
Cohesion: 0.08
Nodes (47): BudgetState, react-dom, CategoryField(), ComboboxField(), Props, DateField(), Props, DateRange() (+39 more)

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

### Community 72 - "Icon Concept Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Icon With Shadow"
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

### Community 79 - "Local-first Sync Features"
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

### Community 84 - "F Monogram Dot"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F Monogram Letterform"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 95 - "Header and Button UI"
Cohesion: 0.12
Nodes (30): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldContent(), FieldLegend() (+22 more)

### Community 98 - "Month Picker"
Cohesion: 0.29
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 100 - "Dashboard Chart Components"
Cohesion: 0.15
Nodes (20): CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix(), DailySpendingChart(), MonthlyBudgetLine, MonthlyBudgetBadge() (+12 more)

### Community 101 - "Settings Hook"
Cohesion: 0.83
Nodes (3): useDefaultFilterEndDateToday(), useDefaultFilterStartDate(), useSettings()

### Community 102 - "Validation Error Handling"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

## Knowledge Gaps
- **83 isolated node(s):** `Agent Behavior`, `Generated / Ignored Files`, `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 590 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Header and Button UI` to `Form Field Components`, `Duplicates and Record Dialogs`, `Month Picker`, `Dashboard Chart Components`, `App Shell and Sidebar`, `Search Sheets and Filters`, `Filters and Combobox UI`, `Accounts and Allocator Pages`, `Data Table Components`, `Month Layout and Recurring`, `Bar Chart Components`, `Month Overview Page`, `Pagination Components`, `Spending Calendar`, `Importer and Dashboard Pages`, `Data Settings and Dialogs`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `Agent Behavior`, `Generated / Ignored Files`, `Build app step` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Duplicates and Record Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.06717325227963526 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Search Sheets and Filters` to `Duplicates and Record Dialogs`, `App Shell and Sidebar`, `Filters and Combobox UI`, `Appearance Theme Hook`, `Data Table Components`, `Month Layout and Recurring`, `Month Overview Page`, `Spending Calendar`, `Category History Chart`, `Package Manifest`, `Accounts and Allocator Pages`, `Sync Toasts and Boot`, `Bar Chart Components`, `Pagination Components`, `Importer and Dashboard Pages`, `Data Settings and Dialogs`, `Form Field Components`, `Header and Button UI`, `Month Picker`, `Dashboard Chart Components`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `Dexie Database Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.07965860597439545 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `Logic and Data Layers` to `UI Architecture Rules`, `App Shell and Sidebar`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `Graph Artifact Rules` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._