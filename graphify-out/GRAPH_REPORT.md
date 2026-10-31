# Graph Report - finpoint  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1938 nodes · 7773 edges · 91 communities (81 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.84)
- Token cost: 29,329 input · 1,177 output

## Graph Freshness
- Built from commit: `76a777ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Accounts and Duplicates Pages
- Record and Budget Dialogs
- Statement Rules Logic
- Graph Artifact Rules
- UI Primitives and Combobox
- Analytics and Dashboard Logic
- Layout and Button Primitives
- Root Layout and Providers
- Chart Tests
- Statement Importer
- Charts and Summary Widgets
- TypeScript Compiler Config
- Editor and Sheet Tests
- Month Layout and Date Fields
- Next Config and Routing
- Dashboard Month View
- Package Dependencies
- Workflow Tests and Test Data
- Budget and Duplicate Operations
- Spending Calendar
- Dashboard Charts
- Statement Replacements
- Dashboard and Static Pages
- Biome Suspicious Rules
- Package Manifest
- Test Inventory and Tooling
- Biome Correctness Rules
- Record Suggestions Engine
- Playwright Component Tests
- Sync Settings and Alert Dialog
- Animation Tests
- Test Fixtures and Seeding
- Google Drive Storage
- UI Layer Architecture
- Export Import and Settings
- shadcn Components Config
- Seeding and Default Data
- Budget Detail Page
- Search Sheets and Filters
- Shared Domain Types
- Domain Glossary
- Auth Broker Routes
- Sidebar and Selection Bar
- Duplicate Detection Logic
- Database Schema
- Chart Primitives
- Navigation Tests
- Biome Formatter Style
- Dev Dependencies
- Pagination Components
- Records Logic
- Commands and Tooling
- Next.js Auth Broker Setup
- Category Filter and Command
- Route and Table Tests
- Biome Config
- Biome Complexity Rules
- PWA Manifest
- Navigation History Provider
- npm Scripts
- Biome Formatter Options
- Core Product Features
- Domain Docs and Tracker
- Optional Platform Dependencies
- TypeScript E2E Config
- Biome Style Rules
- Data and Logic Layers
- Validation Errors
- Icon with Shadow Concept
- Icon Shadow Variant
- Local Issue Tracker Docs
- Finpoint Icon Concept
- Domain Docs Guide
- Local Tracker Operations
- Drive Sync and Backup
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
- Agent and UI Rules

## God Nodes (most connected - your core abstractions)
1. `cn()` - 322 edges
2. `PrimitivesSection()` - 180 edges
3. `Button()` - 126 edges
4. `react` - 97 edges
5. `formatCurrency()` - 78 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 57 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 47 edges
10. `next` - 43 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx
- `setup composite action` --implements--> `frozen production bundles (app 5273, harness 5274)`  [INFERRED]
  .github/actions/setup/action.yml → tests/README.md

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

## Communities (91 total, 10 thin omitted)

### Community 0 - "Accounts and Duplicates Pages"
Cohesion: 0.07
Nodes (119): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+111 more)

### Community 1 - "Record and Budget Dialogs"
Cohesion: 0.07
Nodes (108): SECTIONS, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog() (+100 more)

### Community 2 - "Statement Rules Logic"
Cohesion: 0.10
Nodes (19): dexie, fake-indexeddb, xlsx, RecordRow, StatementRow, byCreation(), conditionPattern(), deleteStatementRule() (+11 more)

### Community 3 - "Graph Artifact Rules"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "UI Primitives and Combobox"
Cohesion: 0.07
Nodes (60): @base-ui/react, Props, AlertAction(), AlertDialogTrigger(), CardFooter(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+52 more)

### Community 5 - "Analytics and Dashboard Logic"
Cohesion: 0.10
Nodes (46): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories() (+38 more)

### Community 6 - "Layout and Button Primitives"
Cohesion: 0.13
Nodes (27): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+19 more)

### Community 7 - "Root Layout and Providers"
Cohesion: 0.11
Nodes (29): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, normalize() (+21 more)

### Community 8 - "Chart Tests"
Cohesion: 0.23
Nodes (7): @playwright/test, cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb()

### Community 9 - "Statement Importer"
Cohesion: 0.20
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), BANKS, ensureAccount(), combine(), dbsDescriptionKey() (+17 more)

### Community 10 - "Charts and Summary Widgets"
Cohesion: 0.09
Nodes (45): framer-motion, react-dom, @tanstack/react-table, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta (+37 more)

### Community 11 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "Editor and Sheet Tests"
Cohesion: 0.12
Nodes (22): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectPointerCursor() (+14 more)

### Community 13 - "Month Layout and Date Fields"
Cohesion: 0.09
Nodes (39): BudgetState, MonthLayout(), lucide-react, luxon, react-day-picker, DateField(), Props, DateRange() (+31 more)

### Community 14 - "Next Config and Routing"
Cohesion: 0.18
Nodes (21): ReviewLinks(), NotFound(), Template(), nextConfig, next, TITLES, pathAccounts(), pathAllocator() (+13 more)

### Community 15 - "Dashboard Month View"
Cohesion: 0.12
Nodes (26): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardView, deltaOf() (+18 more)

### Community 16 - "Package Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "Workflow Tests and Test Data"
Cohesion: 0.11
Nodes (18): DBS_VALID, buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables(), getScenario() (+10 more)

### Community 18 - "Budget and Duplicate Operations"
Cohesion: 0.23
Nodes (20): updateAccount(), createBudget(), validateBudget(), cleanInput(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget(), MONTHLY_BUDGET_GROUPS (+12 more)

### Community 19 - "Spending Calendar"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 20 - "Dashboard Charts"
Cohesion: 0.19
Nodes (15): CashflowChart(), CashflowPoint, CategoryMovers(), Mover, CategorySpendingMix(), DailySpendingChart(), MonthlyBudgetLine, SurplusPoint (+7 more)

### Community 21 - "Statement Replacements"
Cohesion: 0.15
Nodes (26): countSuggestions(), asPending(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+18 more)

### Community 22 - "Dashboard and Static Pages"
Cohesion: 0.17
Nodes (29): DashboardPage(), RecurringCard(), ScopedCardTitle(), ScopeLabel(), WeekdayCard(), EmptyRecords(), metadata, PrivacyPage() (+21 more)

### Community 23 - "Biome Suspicious Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "Package Manifest"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 25 - "Test Inventory and Tooling"
Cohesion: 0.06
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 26 - "Biome Correctness Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "Record Suggestions Engine"
Cohesion: 0.10
Nodes (34): MonthlyBudgetRow, allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS (+26 more)

### Community 28 - "Playwright Component Tests"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 29 - "Sync Settings and Alert Dialog"
Cohesion: 0.14
Nodes (27): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+19 more)

### Community 30 - "Animation Tests"
Cohesion: 0.17
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 31 - "Test Fixtures and Seeding"
Cohesion: 0.31
Nodes (9): assertSeeded(), checkSeededMarker(), countStore(), seedInBrowser(), seedWorkspace(), STORE_NAMES, test, waitForBoot() (+1 more)

### Community 32 - "Google Drive Storage"
Cohesion: 0.11
Nodes (50): exportData(), SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch() (+42 more)

### Community 33 - "UI Layer Architecture"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 34 - "Export Import and Settings"
Cohesion: 0.22
Nodes (15): db, clearAllData(), downloadExport(), importData(), parseImportFile(), TableName, TABLES, DEFAULT_SETTINGS (+7 more)

### Community 35 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Seeding and Default Data"
Cohesion: 0.13
Nodes (21): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY, seedIfEmpty(), BANK_BLURB (+13 more)

### Community 37 - "Budget Detail Page"
Cohesion: 0.25
Nodes (12): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), attachBudgetRecord() (+4 more)

### Community 38 - "Search Sheets and Filters"
Cohesion: 0.22
Nodes (27): PendingCard(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange (+19 more)

### Community 39 - "Shared Domain Types"
Cohesion: 0.11
Nodes (18): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+10 more)

### Community 40 - "Domain Glossary"
Cohesion: 0.09
Nodes (29): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+21 more)

### Community 41 - "Auth Broker Routes"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "Sidebar and Selection Bar"
Cohesion: 0.10
Nodes (37): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), SelectionBar() (+29 more)

### Community 43 - "Duplicate Detection Logic"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 44 - "Database Schema"
Cohesion: 0.11
Nodes (18): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+10 more)

### Community 45 - "Chart Primitives"
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

### Community 50 - "Records Logic"
Cohesion: 0.15
Nodes (12): inferRecordDatetime(), analyticsValues(), budgetCovers(), ConflictError, createRecord(), enrichRecords(), RecordDetail, RecordFilters (+4 more)

### Community 51 - "Commands and Tooling"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 52 - "Next.js Auth Broker Setup"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "Category Filter and Command"
Cohesion: 0.33
Nodes (11): CategoryFilter(), CategoryFilterItem(), Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+3 more)

### Community 54 - "Route and Table Tests"
Cohesion: 0.17
Nodes (13): Child, october, september, PREMATURE, routeReady, titles, IDS, installDateOnly() (+5 more)

### Community 55 - "Biome Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "Biome Complexity Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "PWA Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "Navigation History Provider"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 59 - "npm Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 62 - "Biome Formatter Options"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Core Product Features"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 65 - "Domain Docs and Tracker"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Optional Platform Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "TypeScript E2E Config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "Biome Style Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "Data and Logic Layers"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 71 - "Validation Errors"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 72 - "Icon with Shadow Concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Icon Shadow Variant"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Local Issue Tracker Docs"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint Icon Concept"
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

### Community 94 - "Agent and UI Rules"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

## Knowledge Gaps
- **83 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 588 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout and Button Primitives` to `Accounts and Duplicates Pages`, `Record and Budget Dialogs`, `UI Primitives and Combobox`, `Search Sheets and Filters`, `Statement Importer`, `Charts and Summary Widgets`, `Sidebar and Selection Bar`, `Month Layout and Date Fields`, `Chart Primitives`, `Dashboard Month View`, `Pagination Components`, `Spending Calendar`, `Dashboard Charts`, `Category Filter and Command`, `Dashboard and Static Pages`, `Sync Settings and Alert Dialog`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts and Duplicates Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0710177762286511 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `Data and Logic Layers` to `UI Layer Architecture`, `Root Layout and Providers`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Record and Budget Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.07434052757793765 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Record and Budget Dialogs` to `Accounts and Duplicates Pages`, `UI Primitives and Combobox`, `Layout and Button Primitives`, `Root Layout and Providers`, `Statement Importer`, `Charts and Summary Widgets`, `Month Layout and Date Fields`, `Next Config and Routing`, `Dashboard Month View`, `Spending Calendar`, `Dashboard and Static Pages`, `Package Manifest`, `Sync Settings and Alert Dialog`, `Budget Detail Page`, `Search Sheets and Filters`, `Sidebar and Selection Bar`, `Chart Primitives`, `Pagination Components`, `Category Filter and Command`, `Navigation History Provider`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `Statement Rules Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.10420168067226891 - nodes in this community are weakly interconnected._