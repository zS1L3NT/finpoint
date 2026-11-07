# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2008 nodes · 8044 edges · 103 communities (92 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `035723b0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record-editor.tsx
- duplicates/page.tsx
- db.ts
- Tests README
- (month)/page.tsx
- importer/page.tsx
- ref_types
- lib/motion.ts
- primitives.tsx
- cn
- dashboard.ts
- panel.tsx
- utils.ts
- auto-sync.ts
- editors.ts
- compilerOptions
- icon.tsx
- records.ts
- routes.ts
- combobox.tsx
- Validator
- suggestions.ts
- package.json
- dependencies
- test-data.ts
- ledger.e2e.ts
- suspicious
- fixtures.ts
- support/motion.ts
- correctness
- statements.ts
- use-sync-status.ts
- README.md
- core/routes.e2e.ts
- trend-chart.tsx
- datetime-field.tsx
- components.json
- CONTEXT.md
- core/components.e2e.ts
- types.d.ts
- importer.ts
- auth-vault.ts
- export-import.ts
- amount-filter.tsx
- STYLE.md
- duplicates.ts
- UI layer (app pages + components)
- formatter
- devDependencies
- lucide-react
- pagination.tsx
- biome.json
- rules
- data.ts
- seed.ts
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- Next.js agent rules block ("This is NOT the Next.js you know")
- scripts
- accounts/[id]/page.tsx
- src/components/*
- formatter
- round2
- navigation.e2e.ts
- Domain docs (single-context layout)
- Commands
- optionalDependencies
- Button
- tsconfig.e2e.json
- Comparison window
- style
- 0002 Forecast pacing
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
- Dashboard
- Finpoint app icon
- Dashboard Attention
- Domain Documentation Conflicts
- Dashboard Attention
- Conventions
- Unrestricted crawler policy
- Calendar day Drill-down
- formatCurrency
- category-history-chart.tsx
- statement-rules.ts
- alert-dialog.tsx
- SidebarMenuButton

## God Nodes (most connected - your core abstractions)
1. `cn()` - 330 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 127 edges
4. `react` - 100 edges
5. `formatCurrency()` - 82 edges
6. `RecordEditorDialog()` - 67 edges
7. `UiIcon()` - 60 edges
8. `RecordCreatorDialog()` - 58 edges
9. `round2()` - 48 edges
10. `pluralize()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Selection` --documents--> `Largest selection preserves amount order before pagination`  [INFERRED]
  src/logic/drilldown.ts → docs/adr/0001-drill-down-url-state.md
- `pluralize()` --references--> `Copy`  [INFERRED]
  src/lib/utils.ts → STYLE.md
- `ValidationError` --references--> `Finpoint Style Additions`  [INFERRED]
  src/logic/validate.ts → STYLE.md
- `useApiFormErrors()` --references--> `Finpoint Style Additions`  [INFERRED]
  src/hooks/use-api-form-errors.ts → STYLE.md
- `path()` --indirect_call--> `record()`  [INFERRED]
  src/components/charts/trend-chart.tsx → tests/core/ledger.e2e.ts

## Import Cycles
- None detected.

## Communities (103 total, 11 thin omitted)

### Community 0 - "record-editor.tsx"
Cohesion: 0.07
Nodes (110): CandidateResults(), sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog(), CategoryDialog(), CategoryFormValues (+102 more)

### Community 1 - "duplicates/page.tsx"
Cohesion: 0.18
Nodes (43): AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), RecordCreatorHost(), RecordFilters() (+35 more)

### Community 2 - "db.ts"
Cohesion: 0.11
Nodes (14): dexie, fake-indexeddb, luxon, xlsx, DB_NAME, DB_VERSION, MetaRow, SettingsRow (+6 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "(month)/page.tsx"
Cohesion: 0.15
Nodes (20): AttentionList(), Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+12 more)

### Community 5 - "importer/page.tsx"
Cohesion: 0.18
Nodes (34): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS (+26 more)

### Community 6 - "ref_types"
Cohesion: 0.11
Nodes (28): AccountCard(), AccountRow, AccountsPage(), CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, Rule (+20 more)

### Community 7 - "lib/motion.ts"
Cohesion: 0.14
Nodes (35): framer-motion, @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget() (+27 more)

### Community 8 - "primitives.tsx"
Cohesion: 0.10
Nodes (43): AlertAction(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+35 more)

### Community 9 - "cn"
Cohesion: 0.11
Nodes (35): class-variance-authority, AppHeader(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), ItemSeparator() (+27 more)

### Community 10 - "dashboard.ts"
Cohesion: 0.11
Nodes (39): AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), summaryMeasure(), avg(), buildCashflowHistory(), buildCategories() (+31 more)

### Community 11 - "panel.tsx"
Cohesion: 0.25
Nodes (14): Largest selection preserves amount order before pagination, AllocationExpansion(), AllocationRows(), AllocationSource, DrillPanel(), amountTone(), PendingBadge(), getDrilldown() (+6 more)

### Community 12 - "utils.ts"
Cohesion: 0.39
Nodes (4): radix-ui, react, badgeVariants, currencyFormat

### Community 13 - "auto-sync.ts"
Cohesion: 0.10
Nodes (51): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+43 more)

### Community 14 - "editors.ts"
Cohesion: 0.13
Nodes (23): editors, editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), IDS (+15 more)

### Community 15 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 16 - "icon.tsx"
Cohesion: 0.12
Nodes (32): BudgetPage(), Legend(), MonthlyRecordsPage(), Sparkline(), DynamicUiIcon(), Icon(), iconNameSet, loadedIcons (+24 more)

### Community 17 - "records.ts"
Cohesion: 0.11
Nodes (27): RecordRow, canUseMonthlyBudget(), BudgetDetail, BudgetFilters, createBudget(), getBudget(), updateBudget(), loadDashboardTables() (+19 more)

### Community 18 - "routes.ts"
Cohesion: 0.05
Nodes (74): metadata, RootLayout(), viewport, MonthLayout(), NotFound(), Boot(), Providers(), Template() (+66 more)

### Community 19 - "combobox.tsx"
Cohesion: 0.11
Nodes (24): Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent(), ComboboxEmpty() (+16 more)

### Community 20 - "Validator"
Cohesion: 0.29
Nodes (15): updateAccount(), validateBudget(), cleanInput(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount(), updateMonthlyBudget(), upsertMonthlyBudget() (+7 more)

### Community 21 - "suggestions.ts"
Cohesion: 0.08
Nodes (41): AllocationRow, CategoryRow, MonthlyBudgetRow, inferRecordDatetime(), allocatedStatements(), asOf(), byDate(), CHIP_LIMIT (+33 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (26): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+18 more)

### Community 23 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 24 - "test-data.ts"
Cohesion: 0.13
Nodes (19): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), BANK_BLURB, between(), CATEGORIES (+11 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.07
Nodes (46): typescript, vite, @vitejs/plugin-react, behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage (+38 more)

### Community 26 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 27 - "fixtures.ts"
Cohesion: 0.15
Nodes (17): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceTables (+9 more)

### Community 28 - "support/motion.ts"
Cohesion: 0.18
Nodes (18): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, attachSamplingFailure(), expectPopupEntrance(), expectReducedRowMovement(), expectVisibleRowCascade() (+10 more)

### Community 29 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 30 - "statements.ts"
Cohesion: 0.18
Nodes (20): asPending(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement (+12 more)

### Community 31 - "use-sync-status.ts"
Cohesion: 0.60
Nodes (4): useSyncStatus(), getSyncSnapshot(), subscribeSync(), SyncSnapshot

### Community 32 - "README.md"
Cohesion: 0.08
Nodes (23): Allocate workspace, Detail table allocated portions and drill-down Allocations, Backup and restore, Categories, Custom-period Budgets, Demo data, Inline metric and drill-down term definitions, Finpoint (+15 more)

### Community 33 - "core/routes.e2e.ts"
Cohesion: 0.18
Nodes (13): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, installDateOnly() (+5 more)

### Community 34 - "trend-chart.tsx"
Cohesion: 0.20
Nodes (13): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+5 more)

### Community 35 - "datetime-field.tsx"
Cohesion: 0.15
Nodes (23): @base-ui/react, DateField(), Props, parseValue(), Props, toInputValue(), CategoryFilter(), CategoryFilterItem() (+15 more)

### Community 36 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "CONTEXT.md"
Cohesion: 0.09
Nodes (21): Account, Allocate, Budget, Category, Drill-down, Duplicate Statement, Irregular, Left over (+13 more)

### Community 38 - "core/components.e2e.ts"
Cohesion: 0.13
Nodes (11): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), containedFooter(), expectDropdownPreservesScroll(), expectPointerCursor(), scrollWithInput() (+3 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "importer.ts"
Cohesion: 0.25
Nodes (19): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+11 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 42 - "export-import.ts"
Cohesion: 0.15
Nodes (23): DataSettingsPage(), StateRow(), WorkspaceRow(), db, clearAllData(), downloadExport(), importData(), monthlyBudgetFields() (+15 more)

### Community 43 - "amount-filter.tsx"
Cohesion: 0.25
Nodes (21): PendingStatementConfirmationSheet(), RecordSearchSheet(), StatementSearchSheet(), AmountFilter(), AmountRange, COMPARISONS, describe(), Draft (+13 more)

### Community 44 - "STYLE.md"
Cohesion: 0.16
Nodes (13): Allocation, APIs, Arguments, And Props, Code Style, Consistency, Copy, Core, Earning Its Place, Grouping And Order (+5 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.20
Nodes (17): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+9 more)

### Community 46 - "UI layer (app pages + components)"
Cohesion: 0.22
Nodes (11): app/**/page.tsx, Interactive routes are "use client" (search params via next/navigation), (month) route-group shell (Overview + Monthly Records), Pages take no props, Project Shape, React Compiler (enabled), Root Suspense (keeps routes static), src/routes.ts (centralized route paths) (+3 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "lucide-react"
Cohesion: 0.22
Nodes (11): lucide-react, react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal() (+3 more)

### Community 50 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 53 - "data.ts"
Cohesion: 0.09
Nodes (22): AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow, DBS_VALID (+14 more)

### Community 54 - "seed.ts"
Cohesion: 0.22
Nodes (12): FinpointDB, withoutActionModes(), exportData(), tableCounts(), seedIfEmpty(), digestSnapshot(), hashLegacySnapshot(), hashSnapshot() (+4 more)

### Community 55 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.31
Nodes (8): Background Drive sync, bun test, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), src/logic/* (domain reads and operations), Verification, Workspace backup/reset operations

### Community 56 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 57 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 58 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "accounts/[id]/page.tsx"
Cohesion: 0.21
Nodes (14): AccountPage(), formatRowTime(), StatementActions(), StatementActionsCell(), StatementBadges(), StatementRow, StatementTableOptions, useStatementColumns() (+6 more)

### Community 61 - "src/components/*"
Cohesion: 0.25
Nodes (5): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*, useLiveQuery

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "round2"
Cohesion: 0.21
Nodes (13): getBudgetAnalytics(), getCategoryData(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), CashflowChart(), CashflowPoint, TrendChart() (+5 more)

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.33
Nodes (7): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking, String primary keys (not auto-increment)

### Community 66 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 67 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 68 - "Button"
Cohesion: 0.25
Nodes (12): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), DateRangeValue, formatRange(), Props (+4 more)

### Community 69 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 70 - "Comparison window"
Cohesion: 0.33
Nodes (5): Compare selection uses included comparison months and title-based uniqueness, Gross and net category selection URL, Comparison window, Drill-down URL state, Biggest changes compares same-period net Spending Records

### Community 71 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 72 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 73 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 74 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 75 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 77 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 78 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 79 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 81 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 82 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 83 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 84 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 85 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 86 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 88 - "Dashboard"
Cohesion: 0.50
Nodes (4): Dashboard, Dashboard natural card heights, Empty month offers latest recorded month, Empty workspace import and demo start state

### Community 98 - "formatCurrency"
Cohesion: 0.27
Nodes (11): GroupHeader(), PendingCard(), AllocateBar(), AllocationProgress(), MonthlyBudgetUsage(), MonthlyBudgetUsageItem, Amount(), RecordAmount() (+3 more)

### Community 99 - "category-history-chart.tsx"
Cohesion: 0.22
Nodes (13): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+5 more)

### Community 100 - "statement-rules.ts"
Cohesion: 0.24
Nodes (11): TREATMENT_VALUES, byCreation(), conditionPattern(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), RULE_OPERATORS (+3 more)

### Community 101 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 102 - "SidebarMenuButton"
Cohesion: 0.44
Nodes (7): DEFINITIONS, Term(), SidebarMenuButton(), sidebarMenuButtonVariants, Tooltip(), TooltipContent(), TooltipTrigger()

## Knowledge Gaps
- **126 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+121 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 641 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `record-editor.tsx`, `duplicates/page.tsx`, `(month)/page.tsx`, `importer/page.tsx`, `ref_types`, `lib/motion.ts`, `primitives.tsx`, `panel.tsx`, `utils.ts`, `icon.tsx`, `routes.ts`, `combobox.tsx`, `trend-chart.tsx`, `datetime-field.tsx`, `export-import.ts`, `amount-filter.tsx`, `lucide-react`, `pagination.tsx`, `spending-calendar.tsx`, `accounts/[id]/page.tsx`, `round2`, `Button`, `formatCurrency`, `category-history-chart.tsx`, `alert-dialog.tsx`, `SidebarMenuButton`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record-editor.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07486184965071421 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `record-editor.tsx`, `duplicates/page.tsx`, `(month)/page.tsx`, `importer/page.tsx`, `ref_types`, `lib/motion.ts`, `primitives.tsx`, `cn`, `panel.tsx`, `icon.tsx`, `routes.ts`, `combobox.tsx`, `package.json`, `use-sync-status.ts`, `trend-chart.tsx`, `datetime-field.tsx`, `amount-filter.tsx`, `lucide-react`, `pagination.tsx`, `spending-calendar.tsx`, `accounts/[id]/page.tsx`, `round2`, `Button`, `category-history-chart.tsx`, `alert-dialog.tsx`, `SidebarMenuButton`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10634920634920635 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `routes.ts`, `UI layer (app pages + components)`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._