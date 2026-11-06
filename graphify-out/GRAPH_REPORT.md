# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1963 nodes · 7874 edges · 103 communities (93 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f8e2873`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sidebar.tsx
- react
- db.ts
- Tests README
- suggestions.ts
- Button
- combobox.tsx
- ValidationError
- test
- fixtures.ts
- paginated-data-table.tsx
- compilerOptions
- editors.ts
- app-sidebar.tsx
- records.ts
- useHistory
- dependencies
- data.ts
- statements.ts
- icon.tsx
- Validation rule (ValidationError + Validator)
- shared.ts
- Validator
- suspicious
- package.json
- ledger.e2e.ts
- correctness
- dashboard.ts
- core/components.e2e.ts
- auto-sync.ts
- support/motion.ts
- core/routes.e2e.ts
- alert-dialog.tsx
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- export-import.ts
- components.json
- budgets/[id]/page.tsx
- routes.ts
- primitives.tsx
- types.d.ts
- STYLE.md
- auth-vault.ts
- utils.ts
- statement-rules.ts
- IndexedDB (Dexie)
- duplicates.ts
- navigation.e2e.ts
- formatter
- devDependencies
- pagination.tsx
- formatCurrency
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- cn
- spending-calendar.tsx
- biome.json
- rules
- manifest.json
- next
- scripts
- animations/components.e2e.ts
- 0002 Forecast pacing
- formatter
- Records
- Responsive Drill-down inspector
- Domain docs (single-context layout)
- optionalDependencies
- (month)/page.tsx
- tsconfig.e2e.json
- style
- duplicates/page.tsx
- collectTests
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Google Drive sync
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- Conventions
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- providers.tsx
- use-appearance.tsx
- category-history-chart.tsx
- record-columns.tsx
- trend-chart.tsx
- use-sync-status.ts
- Forecast pacing decision
- history.tsx
- vite.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 75 edges
6. `RecordEditorDialog()` - 63 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 45 edges
10. `next` - 45 edges

## Surprising Connections (you probably didn't know these)
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `record()` --indirect_call--> `path()`  [INFERRED]
  tests/core/ledger.e2e.ts → src/components/charts/trend-chart.tsx
- `setup composite action` --implements--> `frozen production bundles (app 5273, harness 5274)`  [INFERRED]
  .github/actions/setup/action.yml → tests/README.md

## Import Cycles
- None detected.

## Communities (103 total, 10 thin omitted)

### Community 0 - "sidebar.tsx"
Cohesion: 0.12
Nodes (21): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupContent(), SidebarInput(), SidebarInset(), SidebarMenuAction(), SidebarMenuBadge() (+13 more)

### Community 1 - "react"
Cohesion: 0.07
Nodes (114): CandidateResults(), react, react-dom, sonner, @tanstack/react-form, AccountDialog(), BudgetCreatorDialog(), BudgetEditorDialog() (+106 more)

### Community 2 - "db.ts"
Cohesion: 0.07
Nodes (30): dexie, fake-indexeddb, xlsx, AccountRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DB_NAME (+22 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "suggestions.ts"
Cohesion: 0.10
Nodes (37): allocatedStatements(), asOf(), byDate(), CHIP_LIMIT, CHOICES, Clue, createModel(), DEFAULT_WEIGHTS (+29 more)

### Community 5 - "Button"
Cohesion: 0.14
Nodes (22): CategoriesPage(), CategoryDialogState, CategoryTile(), SECTIONS, byRecordDay, FILTER_KEYS, Filters, NotFound() (+14 more)

### Community 6 - "combobox.tsx"
Cohesion: 0.11
Nodes (25): @base-ui/react, Props, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxCollection(), ComboboxContent() (+17 more)

### Community 7 - "ValidationError"
Cohesion: 0.26
Nodes (20): ensureAccount(), combine(), dbsDescriptionKey(), debitCreditAmount(), descriptionKey(), importDbs(), importFiles(), importOcbc() (+12 more)

### Community 8 - "test"
Cohesion: 0.23
Nodes (8): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), seedWorkspace(), test

### Community 9 - "fixtures.ts"
Cohesion: 0.18
Nodes (14): @playwright/test, Child, october, september, installDateOnly(), revisions, setDateOnly(), assertSeeded() (+6 more)

### Community 10 - "paginated-data-table.tsx"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+17 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 12 - "editors.ts"
Cohesion: 0.13
Nodes (20): editors, containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop() (+12 more)

### Community 13 - "app-sidebar.tsx"
Cohesion: 0.16
Nodes (26): AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot(), SYSTEM_APPEARANCE, useSyncIndicator(), TITLES (+18 more)

### Community 14 - "records.ts"
Cohesion: 0.14
Nodes (18): CategoryRow, RecordRow, canUseMonthlyBudget(), getBudget(), getDrillStatement(), Selection, resolveRecordChoices(), inferRecordDatetime() (+10 more)

### Community 15 - "useHistory"
Cohesion: 0.30
Nodes (12): ReviewLinks(), CashflowChart(), CashflowPoint, DailySpendingChart(), MonthlyBudgetLine, SurplusPoint, TotalSpendingChart(), TrendChart() (+4 more)

### Community 16 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 17 - "data.ts"
Cohesion: 0.12
Nodes (17): DBS_VALID, buildDense(), buildEmpty(), buildPopulated(), cycle(), DEFAULT_SETTINGS, emptyTables(), getScenario() (+9 more)

### Community 18 - "statements.ts"
Cohesion: 0.21
Nodes (17): dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement, enrich() (+9 more)

### Community 19 - "icon.tsx"
Cohesion: 0.13
Nodes (26): framer-motion, AllocateBar(), Sparkline(), DetailSummary(), DetailSummaryItem(), DynamicUiIcon(), Icon(), iconNameSet (+18 more)

### Community 20 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 21 - "shared.ts"
Cohesion: 0.15
Nodes (14): asPending(), BudgetDetail, BudgetFilters, createBudget(), updateBudget(), analyticsValues(), budgetCovers(), ConflictError (+6 more)

### Community 22 - "Validator"
Cohesion: 0.25
Nodes (17): updateAccount(), validateBudget(), cleanInput(), restoreDuplicatePair(), amountFor(), createMonthlyBudget(), defaultAmountFor(), setMonthlyBudgetAmount() (+9 more)

### Community 23 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (28): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+20 more)

### Community 25 - "ledger.e2e.ts"
Cohesion: 0.10
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "dashboard.ts"
Cohesion: 0.11
Nodes (42): AllocationRow, db, AnalyticsRecord, AnalyticsSummary, contribution(), summarize(), avg(), BREAKDOWN_MONTHS (+34 more)

### Community 28 - "core/components.e2e.ts"
Cohesion: 0.23
Nodes (6): bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha()

### Community 29 - "auto-sync.ts"
Cohesion: 0.11
Nodes (50): exportData(), AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta (+42 more)

### Community 30 - "support/motion.ts"
Cohesion: 0.16
Nodes (20): denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, chooseCategory(), pickOption(), attachSamplingFailure(), expectPopupEntrance() (+12 more)

### Community 31 - "core/routes.e2e.ts"
Cohesion: 0.24
Nodes (8): PREMATURE, routeReady, titles, expectPointerCursor(), IDS, fits(), patchRows(), statementRow()

### Community 32 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 33 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 34 - "export-import.ts"
Cohesion: 0.09
Nodes (40): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, clearAllData(), downloadExport(), EXPORT_VERSION, FinpointExport, importData(), monthlyBudgetFields() (+32 more)

### Community 35 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "budgets/[id]/page.tsx"
Cohesion: 0.15
Nodes (42): BudgetPage(), Legend(), ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), EmptyRecords(), metadata (+34 more)

### Community 37 - "routes.ts"
Cohesion: 0.20
Nodes (16): AccountCard(), AccountRow, AccountsPage(), dexie-react-hooks, dayLabel(), WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate() (+8 more)

### Community 38 - "primitives.tsx"
Cohesion: 0.08
Nodes (58): class-variance-authority, radix-ui, AppHeader(), AlertAction(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants (+50 more)

### Community 39 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 40 - "STYLE.md"
Cohesion: 0.09
Nodes (27): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+19 more)

### Community 41 - "auth-vault.ts"
Cohesion: 0.32
Nodes (13): POST(), POST(), POST(), AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp(), encryptionKey() (+5 more)

### Community 42 - "utils.ts"
Cohesion: 0.26
Nodes (11): BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow(), Badge(), badgeVariants, currencyFormat (+3 more)

### Community 43 - "statement-rules.ts"
Cohesion: 0.22
Nodes (13): byCreation(), conditionPattern(), deleteStatementRule(), listStatementRules(), matchesStatement(), NAME_ORDER, previewStatementRule(), recommendationAutofill() (+5 more)

### Community 44 - "IndexedDB (Dexie)"
Cohesion: 0.15
Nodes (11): app/**/page.tsx, bun test, IndexedDB (Dexie), Domain and importer tests (Dexie with in-memory IndexedDB), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), String primary keys (not auto-increment) (+3 more)

### Community 45 - "duplicates.ts"
Cohesion: 0.17
Nodes (20): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+12 more)

### Community 47 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 48 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 49 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 50 - "formatCurrency"
Cohesion: 0.18
Nodes (33): PendingCard(), getBudgetAnalytics(), getCategoryData(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), Amount(), DrillPanel() (+25 more)

### Community 51 - "Commands"
Cohesion: 0.20
Nodes (11): Agent Behavior, Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands (+3 more)

### Community 52 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.25
Nodes (6): app/api/auth/* Route Handlers, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173)

### Community 53 - "cn"
Cohesion: 0.14
Nodes (31): lucide-react, react-day-picker, DateField(), Props, CategoryFilter(), CategoryFilterItem(), buttonVariants, Calendar() (+23 more)

### Community 54 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 55 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 56 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 57 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 58 - "next"
Cohesion: 0.23
Nodes (11): MonthLayout(), Template(), nextConfig, luxon, next, ShellHeader(), useDrill(), SearchInit (+3 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 60 - "animations/components.e2e.ts"
Cohesion: 0.32
Nodes (4): desktopOnly, expectModalExit(), APP_URL, HARNESS_URL

### Community 61 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 62 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 63 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 64 - "Responsive Drill-down inspector"
Cohesion: 0.50
Nodes (4): Drill-down, Responsive Drill-down inspector, Drill-down URL selection, Calendar day Drill-down

### Community 65 - "Domain docs (single-context layout)"
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 66 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 67 - "(month)/page.tsx"
Cohesion: 0.17
Nodes (18): Comparison, comparisonRateText(), comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView (+10 more)

### Community 68 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 69 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 70 - "duplicates/page.tsx"
Cohesion: 0.18
Nodes (42): AccountPage(), CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPage() (+34 more)

### Community 71 - "collectTests"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 72 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 73 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 75 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 76 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 77 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 79 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 80 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 81 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 82 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 83 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 85 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 95 - "providers.tsx"
Cohesion: 0.22
Nodes (12): metadata, RootLayout(), viewport, Boot(), Providers(), @vercel/analytics, @vercel/speed-insights, preloadCategoryIcons() (+4 more)

### Community 97 - "use-appearance.tsx"
Cohesion: 0.23
Nodes (15): Toaster(), Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners (+7 more)

### Community 98 - "category-history-chart.tsx"
Cohesion: 0.20
Nodes (15): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+7 more)

### Community 99 - "record-columns.tsx"
Cohesion: 0.18
Nodes (22): MonthlyRecordsPage(), amountTone(), formatRowTime(), PendingBadge(), pendingReason(), RecordActions(), RecordActionsCell(), RecordAmountCell() (+14 more)

### Community 100 - "trend-chart.tsx"
Cohesion: 0.15
Nodes (18): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), arc() (+10 more)

### Community 101 - "use-sync-status.ts"
Cohesion: 0.83
Nodes (3): useSyncStatus(), getSyncSnapshot(), subscribeSync()

### Community 102 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 103 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 104 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

## Knowledge Gaps
- **88 isolated node(s):** `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)`, `Graph health warnings and refresh failure reporting`, `gitmoji.dev` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `sidebar.tsx`, `react`, `Button`, `combobox.tsx`, `paginated-data-table.tsx`, `app-sidebar.tsx`, `useHistory`, `icon.tsx`, `alert-dialog.tsx`, `budgets/[id]/page.tsx`, `routes.ts`, `primitives.tsx`, `utils.ts`, `pagination.tsx`, `formatCurrency`, `spending-calendar.tsx`, `next`, `(month)/page.tsx`, `duplicates/page.tsx`, `category-history-chart.tsx`, `record-columns.tsx`, `trend-chart.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `Build app step`, `Build harness step (tests/harness/vite.config.ts)`, `Playwright browser cache (keyed on bun.lock)` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `sidebar.tsx`, `Button`, `combobox.tsx`, `paginated-data-table.tsx`, `app-sidebar.tsx`, `icon.tsx`, `package.json`, `alert-dialog.tsx`, `budgets/[id]/page.tsx`, `routes.ts`, `primitives.tsx`, `utils.ts`, `pagination.tsx`, `formatCurrency`, `cn`, `spending-calendar.tsx`, `next`, `(month)/page.tsx`, `duplicates/page.tsx`, `providers.tsx`, `use-appearance.tsx`, `category-history-chart.tsx`, `record-columns.tsx`, `trend-chart.tsx`, `use-sync-status.ts`, `history.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06951821824620259 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `fixtures.ts` to `test`, `editors.ts`, `core/components.e2e.ts`, `navigation.e2e.ts`, `data.ts`, `package.json`, `ledger.e2e.ts`, `animations/components.e2e.ts`, `support/motion.ts`, `core/routes.e2e.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06894049346879536 - nodes in this community are weakly interconnected._