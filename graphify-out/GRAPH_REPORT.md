# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2010 nodes · 7966 edges · 107 communities (89 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aefc14fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- duplicates/page.tsx
- lib/motion.ts
- Tests README
- ledger.e2e.ts
- primitives.tsx
- auto-sync.ts
- utils.ts
- cn
- icon.tsx
- dashboard.ts
- db.ts
- suggestions.ts
- amount-filter.tsx
- Button
- compilerOptions
- category-history-chart.tsx
- luxon
- statements.ts
- package.json
- dependencies
- fixtures.ts
- editors.ts
- suspicious
- records.ts
- Validator
- command.tsx
- app-sidebar.tsx
- (month)/page.tsx
- correctness
- data.ts
- README.md
- export-import.ts
- importer/page.tsx
- test-data.ts
- components.json
- CONTEXT.md
- ValidationError
- @playwright/test
- types.d.ts
- sync/page.tsx
- core/components.e2e.ts
- animations/editors.e2e.ts
- statement-rules.ts
- UI layer
- auth-vault.ts
- STYLE.md
- use-appearance.tsx
- alert-dialog.tsx
- core/routes.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- Commands
- app.tsx
- SidebarMenuButton
- records/[id]/page.tsx
- duplicates.ts
- biome.json
- rules
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- workflows.e2e.ts
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- providers.tsx
- scripts
- formatter
- Dashboard
- hashSnapshot
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Forecast pacing decision
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- next.config.ts
- Conventions
- Dashboard shell
- Legacy Monthly Records redirects
- Records month navigation
- Versioned migrations
- Money out / Money in
- Unrestricted crawler policy
- Calendar day Drill-down

## God Nodes (most connected - your core abstractions)
1. `cn()` - 325 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 84 edges
6. `RecordEditorDialog()` - 65 edges
7. `UiIcon()` - 59 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Largest selection preserves amount order before pagination` --documents--> `Selection`  [INFERRED]
  docs/adr/0001-drill-down-url-state.md → src/logic/drilldown.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx

## Import Cycles
- None detected.

## Communities (107 total, 18 thin omitted)

### Community 0 - "react"
Cohesion: 0.07
Nodes (111): SECTIONS, @base-ui/react, react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+103 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.14
Nodes (53): AllocatorPage(), ScopeSelect(), NotFound(), RecordCreatorHost(), RecordFilters(), RecordsPage(), learnedSignals(), SettingsPage() (+45 more)

### Community 2 - "lib/motion.ts"
Cohesion: 0.08
Nodes (53): framer-motion, @tanstack/react-table, bar(), BarChart(), BarSeries, PAD, BudgetProgressChart(), BudgetProgressPoint (+45 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 5 - "primitives.tsx"
Cohesion: 0.10
Nodes (48): AlertAction(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup() (+40 more)

### Community 6 - "auto-sync.ts"
Cohesion: 0.11
Nodes (48): exportData(), SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch() (+40 more)

### Community 7 - "utils.ts"
Cohesion: 0.13
Nodes (40): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), GroupHeader(), AllocationProgress(), AllocationRows(), AllocationSource (+32 more)

### Community 8 - "cn"
Cohesion: 0.09
Nodes (42): radix-ui, AppHeader(), AppearanceSwitch(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, EmptyContent() (+34 more)

### Community 9 - "icon.tsx"
Cohesion: 0.11
Nodes (32): AccountPage(), AccountCard(), AccountRow, AccountsPage(), StatementPage(), AllocateBar(), Sparkline(), DetailSummary() (+24 more)

### Community 10 - "dashboard.ts"
Cohesion: 0.12
Nodes (37): summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline(), buildMonthlyBudgets(), buildProjection() (+29 more)

### Community 11 - "db.ts"
Cohesion: 0.09
Nodes (16): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, MetaRow, SettingsRow, StatementRow (+8 more)

### Community 12 - "suggestions.ts"
Cohesion: 0.11
Nodes (36): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+28 more)

### Community 13 - "amount-filter.tsx"
Cohesion: 0.19
Nodes (27): PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet(), StatementOption(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS (+19 more)

### Community 14 - "Button"
Cohesion: 0.15
Nodes (27): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), CategoriesPage(), CategoryDialogState, CategoryTile() (+19 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "category-history-chart.tsx"
Cohesion: 0.12
Nodes (25): Largest selection preserves amount order before pagination, CashflowChart(), CashflowPoint, aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown() (+17 more)

### Community 17 - "luxon"
Cohesion: 0.11
Nodes (25): MonthLayout(), lucide-react, luxon, react-day-picker, DateField(), Props, buttonVariants, Calendar() (+17 more)

### Community 18 - "statements.ts"
Cohesion: 0.14
Nodes (28): asPending(), duplicateStatementIds(), removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison() (+20 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 20 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 21 - "fixtures.ts"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 22 - "editors.ts"
Cohesion: 0.14
Nodes (18): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+10 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "records.ts"
Cohesion: 0.14
Nodes (22): AllocationExpansion(), AnalyticsRecord, AnalyticsSummary, contribution(), summaryMeasure(), getDrilldown(), getDrillStatement(), analyticsValues() (+14 more)

### Community 25 - "Validator"
Cohesion: 0.25
Nodes (18): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), createMonthlyBudget() (+10 more)

### Community 26 - "command.tsx"
Cohesion: 0.15
Nodes (23): class-variance-authority, CategoryFilter(), CategoryFilterItem(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), Command(), CommandEmpty() (+15 more)

### Community 27 - "app-sidebar.tsx"
Cohesion: 0.22
Nodes (24): AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader(), TITLES (+16 more)

### Community 28 - "(month)/page.tsx"
Cohesion: 0.14
Nodes (22): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+14 more)

### Community 29 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 30 - "data.ts"
Cohesion: 0.11
Nodes (24): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DuplicateDismissalRow, MonthlyBudgetAmountRow (+16 more)

### Community 31 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 32 - "export-import.ts"
Cohesion: 0.16
Nodes (16): clearAllData(), downloadExport(), importData(), monthlyBudgetFields(), parseImportFile(), TableName, TABLES, migrateRecordChoices() (+8 more)

### Community 33 - "importer/page.tsx"
Cohesion: 0.23
Nodes (19): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, MethodHeader() (+11 more)

### Community 34 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, tableCounts(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "CONTEXT.md"
Cohesion: 0.12
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 37 - "ValidationError"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 38 - "@playwright/test"
Cohesion: 0.18
Nodes (16): @playwright/test, denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, Child, october, september (+8 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "sync/page.tsx"
Cohesion: 0.17
Nodes (18): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), wasVaultProven(), useSyncStatus() (+10 more)

### Community 41 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 42 - "animations/editors.e2e.ts"
Cohesion: 0.21
Nodes (14): editors, chooseCategory(), attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance(), matrixIsIdentity(), MotionFrame (+6 more)

### Community 43 - "statement-rules.ts"
Cohesion: 0.19
Nodes (15): db, TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER (+7 more)

### Community 44 - "UI layer"
Cohesion: 0.15
Nodes (14): app/**/page.tsx, Domain logic, Interactive routes are "use client" (search params via next/navigation), Dashboard month route-group shell, Pages take no props, Persistence, Project Shape, React Compiler (enabled) (+6 more)

### Community 45 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 46 - "STYLE.md"
Cohesion: 0.16
Nodes (14): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Finpoint Style Additions (+6 more)

### Community 47 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 48 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 49 - "core/routes.e2e.ts"
Cohesion: 0.24
Nodes (8): PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows(), statementRow()

### Community 50 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 52 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 53 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 54 - "app.tsx"
Cohesion: 0.20
Nodes (8): metadata, RootLayout(), viewport, react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 55 - "SidebarMenuButton"
Cohesion: 0.29
Nodes (10): Providers(), DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, SidebarProvider(), Tooltip(), TooltipContent() (+2 more)

### Community 56 - "records/[id]/page.tsx"
Cohesion: 0.38
Nodes (10): RecordPage(), StatementActions(), StatementActionsCell(), StatementAmount(), StatementBadges(), StatementRow, StatementTableOptions, useStatementColumns() (+2 more)

### Community 57 - "duplicates.ts"
Cohesion: 0.27
Nodes (11): descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC, pairIds() (+3 more)

### Community 58 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 59 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 60 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 61 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 63 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 64 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 65 - "providers.tsx"
Cohesion: 0.39
Nodes (7): Boot(), seedIfEmpty(), useSyncToasts(), markDirty(), startAutoSync(), subscribeSyncEvents(), listCategoryIconNames()

### Community 66 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 67 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 68 - "Dashboard"
Cohesion: 0.25
Nodes (8): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Past empty months show one dated message and import action, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Statement pivot amount, account and timestamp, Statement titles open their funded Records

### Community 69 - "hashSnapshot"
Cohesion: 0.36
Nodes (6): FinpointDB, withoutActionModes(), digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 71 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 72 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 73 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 74 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 75 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 76 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 77 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 78 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 80 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 81 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 82 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 83 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 85 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 88 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 89 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 90 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 91 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

## Knowledge Gaps
- **129 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 642 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `duplicates/page.tsx`, `lib/motion.ts`, `primitives.tsx`, `utils.ts`, `icon.tsx`, `amount-filter.tsx`, `Button`, `category-history-chart.tsx`, `luxon`, `command.tsx`, `(month)/page.tsx`, `importer/page.tsx`, `sync/page.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `SidebarMenuButton`, `records/[id]/page.tsx`, `spending-calendar.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07059386973180076 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `duplicates/page.tsx`, `lib/motion.ts`, `primitives.tsx`, `utils.ts`, `cn`, `icon.tsx`, `amount-filter.tsx`, `Button`, `category-history-chart.tsx`, `luxon`, `package.json`, `command.tsx`, `app-sidebar.tsx`, `(month)/page.tsx`, `importer/page.tsx`, `sync/page.tsx`, `use-appearance.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `app.tsx`, `SidebarMenuButton`, `records/[id]/page.tsx`, `spending-calendar.tsx`, `providers.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14066496163682865 - nodes in this community are weakly interconnected._
- **Why does `pluralize()` connect `duplicates/page.tsx` to `react`, `importer/page.tsx`, `utils.ts`, `icon.tsx`, `dashboard.ts`, `suggestions.ts`, `amount-filter.tsx`, `Button`, `STYLE.md`, `app-sidebar.tsx`, `(month)/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `lib/motion.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07971014492753623 - nodes in this community are weakly interconnected._