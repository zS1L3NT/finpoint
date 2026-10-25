# Graph Report - t3-5de3660e  (2026-10-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1888 nodes · 7567 edges · 95 communities (83 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.85)
- Token cost: 28,950 input · 1,183 output

## Graph Freshness
- Built from commit: `a807cd25`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Accounts Pages
- Record and Budget Dialogs
- UI Primitives and Header
- Component Inventory Tooling
- App Shell and Providers
- Date Fields and Month Layout
- Budget and Cashflow Charts
- Dashboard Data Builders
- Data Tables and Selection
- Sidebar and Sync Indicator
- Dashboard View and Comparisons
- Analytics and Budget Logic
- Editor and Sheet Tests
- TypeScript Compiler Config
- Domain Glossary
- Google Drive Client
- Combobox Components
- Runtime Dependencies
- Monthly Budget Operations
- Budget, Record, Importer Pages
- Suspicious Lint Rules
- Export and Import Data
- Correctness Lint Rules
- Sync Settings and Alerts
- Package Manifest
- Auto Sync Status
- Test Scenario Data
- Chart and Route Tests
- Statement Replacements
- shadcn Components Config
- Component Browser Tests
- Animation Tests
- Seed and Test Data
- Domain Types
- Statement Importers
- Auth Broker Routes
- Detail Summary Widgets
- Database Schema
- Statement Rules
- CI Workflow Jobs
- Duplicate Detection
- Routes and Tables Tests
- Testing README
- Architecture Layer Rules
- Biome Formatting Options
- Dev Dependencies
- Pagination Components
- Biome Config
- Complexity Lint Rules
- Importer and Drive Tests
- Chart Primitives
- Data Layer Rules
- Web App Manifest
- Category History Chart
- Next.js and Auth Rules
- NPM Scripts
- Workflow E2E Tests
- UI Layer Rules
- Graph Maintenance Rules
- Biome Formatter Settings
- Commit and PR Guide
- Product Feature Areas
- Spending Calendar
- Navigation Tests
- Agent Docs Pointers
- Commands and Tooling
- Optional Platform Dependencies
- TypeScript Project Configs
- Style Lint Rules
- Snapshot Hashing
- Vite Test Harness
- Validation Rules
- Icon Concept Shadow
- Icon With Shadow
- Issue Tracker Doc
- Finpoint Icon
- Domain Docs Guide
- Local Tracker Operations
- Product Overview
- Record Defaults
- F Monogram Icon A
- JPG Favicon
- PNG Favicon
- SVG Favicon
- F Monogram Icon B
- F Monogram Icon C
- App Icon Palette
- Domain Docs Conflicts
- Conventions
- Crawler Policy
- Generated Demo Data
- Progressive Web App

## God Nodes (most connected - your core abstractions)
1. `cn()` - 320 edges
2. `PrimitivesSection()` - 184 edges
3. `Button()` - 125 edges
4. `react` - 96 edges
5. `formatCurrency()` - 81 edges
6. `RecordEditorDialog()` - 63 edges
7. `UiIcon()` - 56 edges
8. `RecordCreatorDialog()` - 52 edges
9. `round2()` - 44 edges
10. `ValidationError` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Titles and tags` --references--> `Account`  [INFERRED]
  tests/README.md → src/types.d.ts
- `Titles and tags` --references--> `Allocation`  [INFERRED]
  tests/README.md → src/types.d.ts
- `Titles and tags` --references--> `Budget`  [INFERRED]
  tests/README.md → src/types.d.ts
- `Titles and tags` --references--> `Category`  [INFERRED]
  tests/README.md → src/types.d.ts
- `Titles and tags` --references--> `Record`  [INFERRED]
  tests/README.md → src/types.d.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI browser test pipeline: setup, grouped runs, gated report merge** — _github_actions_setup_action_setup, _github_workflows_ci_core_group, _github_workflows_ci_animations_group, _github_workflows_ci_core, _github_workflows_ci_animations, _github_workflows_ci_blob_report_merge [EXTRACTED 1.00]
- **Every browser test file joins exactly one CI group, enforced by the ledger** — tests_readme_behaviour_ledger, tests_readme_ci_groups, _github_workflows_ci_core_group, _github_workflows_ci_animations_group, agents_verification_rules [INFERRED 0.95]

## Communities (95 total, 12 thin omitted)

### Community 0 - "Accounts Pages"
Cohesion: 0.05
Nodes (162): AccountPage(), AccountCard(), AccountRow, AccountsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader() (+154 more)

### Community 1 - "Record and Budget Dialogs"
Cohesion: 0.08
Nodes (102): SECTIONS, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+94 more)

### Community 2 - "UI Primitives and Header"
Cohesion: 0.07
Nodes (84): class-variance-authority, radix-ui, AppHeader(), AlertAction(), AlertDialogTrigger(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText() (+76 more)

### Community 3 - "Component Inventory Tooling"
Cohesion: 0.06
Nodes (45): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, notApplicable (+37 more)

### Community 4 - "App Shell and Providers"
Cohesion: 0.07
Nodes (39): metadata, RootLayout(), viewport, Boot(), Providers(), react-dom, @vercel/analytics, @vercel/speed-insights (+31 more)

### Community 5 - "Date Fields and Month Layout"
Cohesion: 0.10
Nodes (36): MonthLayout(), lucide-react, luxon, react-day-picker, DateField(), Props, DateRangeValue, formatRange() (+28 more)

### Community 6 - "Budget and Cashflow Charts"
Cohesion: 0.13
Nodes (35): recharts, BudgetActiveDot(), BudgetProgressChart(), BudgetProgressPoint, colorChange(), CashflowChart(), CashflowPoint, colorChange() (+27 more)

### Community 7 - "Dashboard Data Builders"
Cohesion: 0.11
Nodes (40): contribution(), summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets() (+32 more)

### Community 8 - "Data Tables and Selection"
Cohesion: 0.15
Nodes (32): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+24 more)

### Community 9 - "Sidebar and Sync Indicator"
Cohesion: 0.15
Nodes (33): ReviewLinks(), Template(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE (+25 more)

### Community 10 - "Dashboard View and Comparisons"
Cohesion: 0.13
Nodes (31): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+23 more)

### Community 11 - "Analytics and Budget Logic"
Cohesion: 0.11
Nodes (26): AnalyticsRecord, AnalyticsSummary, BudgetDetail, BudgetFilters, createBudget(), updateBudget(), upsertIndexed(), isPendingRecord() (+18 more)

### Community 12 - "Editor and Sheet Tests"
Cohesion: 0.12
Nodes (20): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), account (+12 more)

### Community 13 - "TypeScript Compiler Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 14 - "Domain Glossary"
Cohesion: 0.09
Nodes (28): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Finpoint Domain Glossary, Monthly Budget (+20 more)

### Community 15 - "Google Drive Client"
Cohesion: 0.16
Nodes (29): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+21 more)

### Community 16 - "Combobox Components"
Cohesion: 0.11
Nodes (25): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 17 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 18 - "Monthly Budget Operations"
Cohesion: 0.23
Nodes (20): MonthlyBudgetDefaultRow, updateAccount(), validateBudget(), cleanInput(), fixDuplicates(), restoreDuplicatePair(), importFiles(), createMonthlyBudget() (+12 more)

### Community 19 - "Budget, Record, Importer Pages"
Cohesion: 0.21
Nodes (25): BudgetPage(), Legend(), ImporterPage(), Step(), WeekdayCard(), EmptyRecords(), metadata, PrivacyPage() (+17 more)

### Community 20 - "Suspicious Lint Rules"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 21 - "Export and Import Data"
Cohesion: 0.17
Nodes (21): db, clearAllData(), downloadExport(), EXPORT_VERSION, exportData(), importData(), parseImportFile(), SYNC_TABLES (+13 more)

### Community 22 - "Correctness Lint Rules"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 23 - "Sync Settings and Alerts"
Cohesion: 0.17
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), AlertDialog(), AlertDialogAction() (+15 more)

### Community 24 - "Package Manifest"
Cohesion: 0.08
Nodes (24): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+16 more)

### Community 25 - "Auto Sync Status"
Cohesion: 0.15
Nodes (23): useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), markDirty(), refreshSyncDisplay() (+15 more)

### Community 26 - "Test Scenario Data"
Cohesion: 0.15
Nodes (23): buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables(), getScenario(), pad2() (+15 more)

### Community 27 - "Chart and Route Tests"
Cohesion: 0.16
Nodes (13): @playwright/test, denseCardConsumers, cardTitles, Child, october, september, card(), overview (+5 more)

### Community 28 - "Statement Replacements"
Cohesion: 0.20
Nodes (20): countSuggestions(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason() (+12 more)

### Community 29 - "shadcn Components Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 30 - "Component Browser Tests"
Cohesion: 0.15
Nodes (10): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), expectVisibleBackdrop(), scrollWithInput(), settledOverlayAlpha() (+2 more)

### Community 31 - "Animation Tests"
Cohesion: 0.18
Nodes (17): denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade(), matrixIsIdentity() (+9 more)

### Community 32 - "Seed and Test Data"
Cohesion: 0.16
Nodes (17): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, FinpointExport, SEED_HASH_KEY, BANK_BLURB, between(), CATEGORIES, DAILY (+9 more)

### Community 33 - "Domain Types"
Cohesion: 0.12
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 34 - "Statement Importers"
Cohesion: 0.24
Nodes (18): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importOcbc() (+10 more)

### Community 35 - "Auth Broker Routes"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 36 - "Detail Summary Widgets"
Cohesion: 0.22
Nodes (12): AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), Delta, Metric(), MonthlyBudgetBadge(), RecordAmount() (+4 more)

### Community 37 - "Database Schema"
Cohesion: 0.12
Nodes (16): AccountRow, AllocationRow, AnalyticsMonthRow, asPending(), BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME (+8 more)

### Community 38 - "Statement Rules"
Cohesion: 0.23
Nodes (13): StatementRow, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), previewStatementRule(), recommendationAutofill() (+5 more)

### Community 39 - "CI Workflow Jobs"
Cohesion: 0.18
Nodes (11): Playwright browser cache keyed on bun.lock, setup composite action, animations gate job, animations-group matrix job, blob report merge, checks job (lint, types, e2e types), ci workflow, core gate job (+3 more)

### Community 40 - "Duplicate Detection"
Cohesion: 0.24
Nodes (14): descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds(), eligible() (+6 more)

### Community 41 - "Routes and Tables Tests"
Cohesion: 0.24
Nodes (8): PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows(), statementRow()

### Community 42 - "Testing README"
Cohesion: 0.15
Nodes (12): Areas, behaviour ledger (component-inventory.ts + ledger.e2e.ts), CI, Fixtures, Playwright projects (desktop, mobile, tall-desktop, light, reduced-motion), Projects and tags, Rendered assertions, test tags (@tall, @light, @reduced-motion, @mobile-only, @desktop-only, @tall-only) (+4 more)

### Community 43 - "Architecture Layer Rules"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 44 - "Biome Formatting Options"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "Pagination Components"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 47 - "Biome Config"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 48 - "Complexity Lint Rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 49 - "Importer and Drive Tests"
Cohesion: 0.22
Nodes (3): dexie, fake-indexeddb, xlsx

### Community 50 - "Chart Primitives"
Cohesion: 0.22
Nodes (10): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+2 more)

### Community 51 - "Data Layer Rules"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 52 - "Web App Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 53 - "Category History Chart"
Cohesion: 0.31
Nodes (9): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, HistoryTooltip(), MonthTick(), prepareMonths(), prepareSeries() (+1 more)

### Community 54 - "Next.js and Auth Rules"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 55 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 57 - "UI Layer Rules"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 58 - "Graph Maintenance Rules"
Cohesion: 0.39
Nodes (6): Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update ., Project Graph

### Community 59 - "Biome Formatter Settings"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 60 - "Commit and PR Guide"
Cohesion: 0.25
Nodes (4): Branches, Commit Guide, Commits, Pull Requests

### Community 61 - "Product Feature Areas"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 62 - "Spending Calendar"
Cohesion: 0.36
Nodes (7): compact(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), WEEKDAYS

### Community 64 - "Agent Docs Pointers"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 65 - "Commands and Tooling"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 66 - "Optional Platform Dependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "TypeScript Project Configs"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 68 - "Style Lint Rules"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 69 - "Snapshot Hashing"
Cohesion: 0.53
Nodes (4): digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 70 - "Vite Test Harness"
Cohesion: 0.50
Nodes (5): Build harness step (vite build tests/harness), Finpoint display harness page, Finpoint widget harness page, test areas (routes, tables, editors, sheets, modals, navigation, keyboard, workflows, charts, components, helpers, ledger), Vite component harness

### Community 71 - "Validation Rules"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 72 - "Icon Concept Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Icon With Shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Issue Tracker Doc"
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

### Community 79 - "Product Overview"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 81 - "F Monogram Icon A"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 82 - "JPG Favicon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 83 - "PNG Favicon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 84 - "SVG Favicon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 85 - "F Monogram Icon B"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "F Monogram Icon C"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **78 isolated node(s):** `React Compiler (enabled)`, `Root Suspense (keeps routes static)`, `Static content pages (privacy, terms) are server components`, `node_modules/next/dist/server/lib/generate-agent-files.js`, `node_modules/next/dist/docs/` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 574 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives and Header` to `Accounts Pages`, `Record and Budget Dialogs`, `Detail Summary Widgets`, `Date Fields and Month Layout`, `Budget and Cashflow Charts`, `Data Tables and Selection`, `Sidebar and Sync Indicator`, `Dashboard View and Comparisons`, `Pagination Components`, `Combobox Components`, `Chart Primitives`, `Budget, Record, Importer Pages`, `Sync Settings and Alerts`, `Spending Calendar`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `React Compiler (enabled)`, `Root Suspense (keeps routes static)`, `Static content pages (privacy, terms) are server components` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Accounts Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05365601988649688 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `Chart and Route Tests` to `Component Inventory Tooling`, `Test Scenario Data`, `Routes and Tables Tests`, `Editor and Sheet Tests`, `Package Manifest`, `Workflow E2E Tests`, `Navigation Tests`, `Component Browser Tests`, `Animation Tests`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `Record and Budget Dialogs` be split into smaller, more focused modules?**
  _Cohesion score 0.07922738838769373 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Accounts Pages` to `Record and Budget Dialogs`, `UI Primitives and Header`, `App Shell and Providers`, `Date Fields and Month Layout`, `Budget and Cashflow Charts`, `Detail Summary Widgets`, `Data Tables and Selection`, `Sidebar and Sync Indicator`, `Dashboard View and Comparisons`, `Pagination Components`, `Combobox Components`, `Chart Primitives`, `Budget, Record, Importer Pages`, `Sync Settings and Alerts`, `Package Manifest`, `Auto Sync Status`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `UI Primitives and Header` be split into smaller, more focused modules?**
  _Cohesion score 0.06921944035346098 - nodes in this community are weakly interconnected._