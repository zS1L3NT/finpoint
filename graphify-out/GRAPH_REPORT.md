# Graph Report - t3-69efe8e6  (2026-11-08)

## Corpus Check
- 267 files · ~242,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 2022 nodes · 8009 edges · 111 communities (94 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 141 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64edea92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- duplicates/page.tsx
- ledger.e2e.ts
- primitives.tsx
- (month)/page.tsx
- Tests README
- auto-sync.ts
- sidebar.tsx
- db.ts
- dashboard.ts
- Button
- sync/page.tsx
- paginated-data-table.tsx
- editors.ts
- compilerOptions
- utils.ts
- use-sync-status.ts
- package.json
- dependencies
- monthly-budgets.test.ts
- suggestions.ts
- react
- app-sidebar.tsx
- suspicious
- records.ts
- fixtures.ts
- Validator
- support/motion.ts
- correctness
- use-appearance.tsx
- README.md
- cn
- statements.ts
- test-data.ts
- core/routes.e2e.ts
- CONTEXT.md
- importer.ts
- components.json
- core/components.e2e.ts
- luxon
- UiIcon
- types.d.ts
- State persistence rule (ephemeral UI state vs IndexedDB)
- auth-vault.ts
- radix-ui
- statement-rules.ts
- STYLE.md
- icon.tsx
- alert-dialog.tsx
- formatter
- devDependencies
- pagination.tsx
- Commands
- export-import.ts
- duplicates.ts
- biome.json
- rules
- workflows.e2e.ts
- trend-chart.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- HistoryProvider
- formatter
- lucide-react
- app.tsx
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- style
- 0002 Forecast pacing
- 0001-drill-down-url-state.md
- Validation rule (ValidationError + Validator)
- providers.tsx
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
- Conventions
- Dashboard shell
- Legacy Monthly Records redirects
- Records month navigation
- Versioned migrations
- Money out / Money in
- Unrestricted crawler policy
- Calendar day Drill-down
- category-history-chart.tsx
- UI layer
- duplicates.test.ts
- date-only.ts
- src/components/*
- next
- Allocation

## God Nodes (most connected - your core abstractions)
1. `cn()` - 326 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 100 edges
5. `formatCurrency()` - 84 edges
6. `RecordEditorDialog()` - 65 edges
7. `UiIcon()` - 59 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Month context stays separate from Back targets and Record filters` --conceptually_related_to--> `MonthLayout()`  [INFERRED]
  README.md → app/(month)/layout.tsx
- `Forecast dotted comparison names the previous month` --conceptually_related_to--> `CashflowChart()`  [INFERRED]
  README.md → src/components/charts/cashflow-chart.tsx
- `Statement pivot amount, account and timestamp` --conceptually_related_to--> `DrillPanel()`  [INFERRED]
  README.md → src/components/drill/panel.tsx
- `Statement titles open their funded Records` --conceptually_related_to--> `useStatementColumns()`  [INFERRED]
  README.md → src/components/table/statement-columns.tsx
- `Past empty months show one dated message and import action` --conceptually_related_to--> `buildHeadline()`  [INFERRED]
  README.md → src/logic/dashboard.ts

## Import Cycles
- None detected.

## Communities (111 total, 17 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.07
Nodes (115): @base-ui/react, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+107 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.13
Nodes (55): AllocatorPage(), ScopeSelect(), RecordCreatorHost(), RecordFilters(), RecordsPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage() (+47 more)

### Community 2 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 3 - "primitives.tsx"
Cohesion: 0.09
Nodes (48): AlertAction(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+40 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.11
Nodes (30): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+22 more)

### Community 5 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 6 - "auto-sync.ts"
Cohesion: 0.10
Nodes (53): exportData(), SYNC_TABLES, AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch() (+45 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.10
Nodes (29): AppearanceSwitch(), DEFINITIONS, Term(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+21 more)

### Community 8 - "db.ts"
Cohesion: 0.11
Nodes (28): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, CategoryRow, DB_NAME, DB_VERSION (+20 more)

### Community 9 - "dashboard.ts"
Cohesion: 0.12
Nodes (39): db, contribution(), summarize(), avg(), buildCashflowHistory(), buildCategories(), buildComparison(), buildHeadline() (+31 more)

### Community 10 - "Button"
Cohesion: 0.12
Nodes (32): AccountPage(), AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState (+24 more)

### Community 11 - "sync/page.tsx"
Cohesion: 0.18
Nodes (26): ImporterPage(), Step(), metadata, PrivacyPage(), SECTIONS, COUNT_ROWS, DataSettingsPage(), MethodHeader() (+18 more)

### Community 12 - "paginated-data-table.tsx"
Cohesion: 0.21
Nodes (26): @tanstack/react-table, DataTable(), PaginatedDataTable(), PaginationHeader(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+18 more)

### Community 13 - "editors.ts"
Cohesion: 0.14
Nodes (20): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+12 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 15 - "utils.ts"
Cohesion: 0.14
Nodes (39): BudgetPage(), getBudgetAnalytics(), getCategoryData(), Legend(), dexie-react-hooks, BudgetProgressChart(), BudgetProgressPoint, buildSeries() (+31 more)

### Community 16 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 17 - "package.json"
Cohesion: 0.07
Nodes (27): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+19 more)

### Community 18 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 19 - "monthly-budgets.test.ts"
Cohesion: 0.11
Nodes (11): dexie, fake-indexeddb, xlsx, input, legacyPaceKey, today, decided(), live() (+3 more)

### Community 20 - "suggestions.ts"
Cohesion: 0.11
Nodes (31): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, DEFAULT_WEIGHTS, descriptionTokens() (+23 more)

### Community 21 - "react"
Cohesion: 0.11
Nodes (47): RecordPage(), StatementPage(), react, AllocateBar(), AllocationProgress(), AllocationExpansion(), AllocationRows(), AllocationSource (+39 more)

### Community 22 - "app-sidebar.tsx"
Cohesion: 0.21
Nodes (24): NotFound(), AppearanceOption, APPEARANCES, AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), ShellHeader() (+16 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "records.ts"
Cohesion: 0.08
Nodes (32): Comparison columns share ordering and show the average arithmetic, Dashboard, Forecast dotted comparison names the previous month, Month context stays separate from Back targets and Record filters, Past empty months show one dated message and import action, Pending Record reasons visible before expansion, Spending Drill-down refund signs, labels and gross arithmetic, Spent Drill-down category subtotals and compact half-height metadata (+24 more)

### Community 25 - "fixtures.ts"
Cohesion: 0.16
Nodes (15): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), assertSeeded(), checkSeededMarker() (+7 more)

### Community 26 - "Validator"
Cohesion: 0.23
Nodes (20): updateAccount(), validateBudget(), cleanInput(), dismissDuplicatePair(), eligible(), fixDuplicates(), restoreDuplicatePair(), amountFor() (+12 more)

### Community 27 - "support/motion.ts"
Cohesion: 0.17
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectModalEntrance(), expectModalExit(), expectPopupEntrance() (+12 more)

### Community 28 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 29 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 30 - "README.md"
Cohesion: 0.08
Nodes (24): Allocate workspace, Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Financial terms definitions, Finpoint (+16 more)

### Community 31 - "cn"
Cohesion: 0.13
Nodes (31): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+23 more)

### Community 32 - "statements.ts"
Cohesion: 0.15
Nodes (24): asPending(), AnalyticsRecord, AnalyticsSummary, removeStatementDismissals(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation (+16 more)

### Community 33 - "test-data.ts"
Cohesion: 0.09
Nodes (33): DevDataToggle(), MODES, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), EXPORT_VERSION, FinpointExport, importData() (+25 more)

### Community 34 - "core/routes.e2e.ts"
Cohesion: 0.19
Nodes (11): containedFooter(), PREMATURE, routeReady, titles, expectPointerCursor(), buildPopulated(), getScenario(), learnedCoffee() (+3 more)

### Community 35 - "CONTEXT.md"
Cohesion: 0.13
Nodes (19): Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over, Monthly Budget (+11 more)

### Community 36 - "importer.ts"
Cohesion: 0.23
Nodes (20): papaparse, ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles() (+12 more)

### Community 37 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.14
Nodes (11): desktopOnly, @playwright/test, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha() (+3 more)

### Community 39 - "luxon"
Cohesion: 0.31
Nodes (7): Largest selection preserves amount order before pagination, luxon, CashflowChart(), CashflowPoint, dayTicks(), Selection, SELECTION_KINDS

### Community 40 - "UiIcon"
Cohesion: 0.14
Nodes (25): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, MonthLayout(), learnedSignals(), SettingsPage(), Rule, RuleSentence(), StatementRulesPage() (+17 more)

### Community 41 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 42 - "State persistence rule (ephemeral UI state vs IndexedDB)"
Cohesion: 0.22
Nodes (6): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), URL search params (filters and pagination), useLiveQuery

### Community 43 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 44 - "radix-ui"
Cohesion: 0.17
Nodes (13): class-variance-authority, radix-ui, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator() (+5 more)

### Community 45 - "statement-rules.ts"
Cohesion: 0.20
Nodes (14): TREATMENT_VALUES, byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule() (+6 more)

### Community 46 - "STYLE.md"
Cohesion: 0.18
Nodes (11): APIs, Arguments, And Props, Code Style, Consistency, Core, Earning Its Place, Grouping And Order, Motion and polish, React / TypeScript style (import type, isOpen/setIsOpen) (+3 more)

### Community 47 - "icon.tsx"
Cohesion: 0.16
Nodes (17): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, DynamicUiIcon(), iconNameSet, loadedIcons, loadIcon() (+9 more)

### Community 48 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 49 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 51 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 52 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 53 - "export-import.ts"
Cohesion: 0.20
Nodes (12): withoutActionModes(), downloadExport(), monthlyBudgetFields(), parseImportFile(), TableName, TABLES, migrateRecordChoices(), DEFAULT_SETTINGS (+4 more)

### Community 54 - "duplicates.ts"
Cohesion: 0.24
Nodes (12): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), DuplicateGroup, duplicateGroups(), DuplicateStatement, FixDuplicatesInput, GENERIC (+4 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 58 - "trend-chart.tsx"
Cohesion: 0.20
Nodes (15): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+7 more)

### Community 59 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.36
Nodes (7): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Workspace backup/reset operations

### Community 60 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 61 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 62 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.22
Nodes (7): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173), Verification

### Community 63 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 64 - "HistoryProvider"
Cohesion: 0.60
Nodes (5): getStoredHistory(), getValidHistory(), HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 65 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 66 - "lucide-react"
Cohesion: 0.29
Nodes (7): lucide-react, ButtonVariant, Month, MonthCal(), MonthCalProps, MonthPicker(), MONTHS

### Community 67 - "app.tsx"
Cohesion: 0.32
Nodes (5): react-dom, App(), HarnessSection, sectionFromLocation(), root

### Community 69 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 70 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 71 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 72 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 73 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 74 - "0001-drill-down-url-state.md"
Cohesion: 0.40
Nodes (4): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state

### Community 75 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 76 - "providers.tsx"
Cohesion: 0.23
Nodes (12): metadata, RootLayout(), viewport, Boot(), Providers(), SidebarInset(), SidebarProvider(), Toaster() (+4 more)

### Community 77 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 78 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 79 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 80 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 81 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 82 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 84 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 86 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 87 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 88 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 89 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 90 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 104 - "category-history-chart.tsx"
Cohesion: 0.23
Nodes (13): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+5 more)

### Community 105 - "UI layer"
Cohesion: 0.31
Nodes (8): Domain logic, Dashboard month route-group shell, Persistence, Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components, UI layer

### Community 106 - "duplicates.test.ts"
Cohesion: 0.33
Nodes (5): FinpointDB, digestSnapshot(), hashLegacySnapshot(), hashSnapshot(), Snapshot

### Community 107 - "date-only.ts"
Cohesion: 0.36
Nodes (6): Child, october, september, installDateOnly(), revisions, setDateOnly()

### Community 108 - "src/components/*"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

### Community 110 - "Allocation"
Cohesion: 0.50
Nodes (4): Account, Allocation, Statement, Copy

## Knowledge Gaps
- **122 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 638 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `duplicates/page.tsx`, `primitives.tsx`, `(month)/page.tsx`, `sidebar.tsx`, `Button`, `sync/page.tsx`, `paginated-data-table.tsx`, `utils.ts`, `react`, `UiIcon`, `radix-ui`, `icon.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `trend-chart.tsx`, `spending-calendar.tsx`, `lucide-react`, `providers.tsx`, `category-history-chart.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06719985291413863 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `UI layer`, `providers.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `duplicates/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12635814889336017 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-editor.tsx`, `duplicates/page.tsx`, `primitives.tsx`, `(month)/page.tsx`, `sidebar.tsx`, `Button`, `sync/page.tsx`, `paginated-data-table.tsx`, `utils.ts`, `use-sync-status.ts`, `package.json`, `app-sidebar.tsx`, `use-appearance.tsx`, `cn`, `test-data.ts`, `luxon`, `UiIcon`, `radix-ui`, `icon.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `trend-chart.tsx`, `spending-calendar.tsx`, `lucide-react`, `app.tsx`, `providers.tsx`, `category-history-chart.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06568832983927324 - nodes in this community are weakly interconnected._