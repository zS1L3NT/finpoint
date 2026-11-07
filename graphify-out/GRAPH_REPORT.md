# Graph Report - t3-69efe8e6  (2026-11-07)

## Corpus Check
- 262 files · ~236,953 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .example 1, .lock 1)

## Summary
- 1969 nodes · 7866 edges · 103 communities (91 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f47e1877`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- record-columns.tsx
- paginated-data-table.tsx
- Tests README
- ledger.e2e.ts
- auto-sync.ts
- budgets/[id]/page.tsx
- sidebar.tsx
- dashboard.ts
- primitives.tsx
- data.ts
- suggestions.ts
- compilerOptions
- editors.ts
- use-appearance.tsx
- round2
- cn
- dependencies
- test
- routes.ts
- records.ts
- animations/editors.e2e.ts
- suspicious
- category-history-chart.tsx
- package.json
- duplicates.ts
- correctness
- export-import.ts
- export-import.ts
- core/components.e2e.ts
- test-data.ts
- components.json
- core/routes.e2e.ts
- types.d.ts
- history.tsx
- auth-vault.ts
- allocator/page.tsx
- luxon
- alert-dialog.tsx
- statements.ts
- providers.tsx
- IndexedDB (Dexie)
- formatter
- devDependencies
- categories/page.tsx
- Commands
- Next.js agent rules block ("This is NOT the Next.js you know")
- Validator
- biome.json
- rules
- src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)
- manifest.json
- spending-calendar.tsx
- scripts
- trend-chart.tsx
- auto-sync.ts
- formatter
- Records
- navigation.e2e.ts
- Domain docs (single-context layout)
- optionalDependencies
- tsconfig.e2e.json
- 0001-drill-down-url-state.md
- style
- 0002 Forecast pacing
- Validation rule (ValidationError + Validator)
- Finpoint icon concept
- Finpoint icon with charcoal shadow
- Issue tracker: Local Markdown
- Finpoint
- Domain docs
- Local Markdown Issue Tracker
- Google Drive sync
- Forecast pacing decision
- F monogram icon
- JPG favicon icon
- PNG favicon icon
- SVG favicon icon
- F monogram icon
- F monogram icon
- Finpoint app icon
- Domain Documentation Conflicts
- pagination.tsx
- Conventions
- Unrestricted crawler policy
- Generated demo data
- Progressive Web Application
- Button
- ledger.e2e.ts
- lucide-react
- Statement
- (month)/page.tsx
- ledger.e2e.ts
- duplicates/page.tsx
- utils.ts
- lib/motion.ts
- providers.tsx
- Commands
- Calendar and forecast daily views
- Dashboard summary metrics

## God Nodes (most connected - your core abstractions)
1. `cn()` - 324 edges
2. `PrimitivesSection()` - 181 edges
3. `Button()` - 125 edges
4. `react` - 99 edges
5. `formatCurrency()` - 76 edges
6. `RecordEditorDialog()` - 61 edges
7. `RecordCreatorDialog()` - 58 edges
8. `UiIcon()` - 56 edges
9. `round2()` - 48 edges
10. `pluralize()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `Copy` --references--> `pluralize()`  [INFERRED]
  STYLE.md → src/lib/utils.ts
- `Finpoint Style Additions` --references--> `useApiFormErrors()`  [INFERRED]
  STYLE.md → src/hooks/use-api-form-errors.ts
- `Finpoint Style Additions` --references--> `ValidationError`  [INFERRED]
  STYLE.md → src/logic/validate.ts
- `BudgetState` --calls--> `parseDate()`  [EXTRACTED]
  app/budgets/page.tsx → src/lib/utils.ts
- `Boot()` --indirect_call--> `preloadCategoryIcons()`  [INFERRED]
  app/providers.tsx → src/components/icon.tsx

## Import Cycles
- None detected.

## Communities (103 total, 12 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (133): ACCEPT, BANKS_REQUIRING_ADDITIONAL_INFO, ImporterPage(), Step(), @base-ui/react, react, sonner, @tanstack/react-form (+125 more)

### Community 1 - "record-columns.tsx"
Cohesion: 0.17
Nodes (21): AllocationExpansion(), Icon(), amountTone(), formatRowTime(), PendingBadge(), RecordActions(), RecordActionsCell(), RecordAmountCell() (+13 more)

### Community 2 - "paginated-data-table.tsx"
Cohesion: 0.22
Nodes (25): @tanstack/react-table, DataTable(), PaginatedDataTable(), GroupHeaderRow(), groupStarts(), GroupTotal(), isInteractiveTarget(), LeavingRows() (+17 more)

### Community 3 - "Tests README"
Cohesion: 0.06
Nodes (41): Build harness step (vite build tests/harness), Playwright browser cache keyed on bun.lock, blob report merge, Committed graph artifacts (graph.json, GRAPH_REPORT.md, manifest.json, .graphify_labels.json), Graph health warnings and refresh failure reporting, graphify-out/graph.json, graphify skill (--update), graphify update . (+33 more)

### Community 4 - "ledger.e2e.ts"
Cohesion: 0.11
Nodes (25): behaviourCoverage, componentInventory, facetNotApplicable, InventoryEntry, modalAnimationCoverage, notApplicable, openFacets, RouteEntry (+17 more)

### Community 5 - "auto-sync.ts"
Cohesion: 0.13
Nodes (26): useSyncStatus(), cycle(), emit(), eventListeners, finishCycle(), getSyncSnapshot(), ingestManualResult(), markDirty() (+18 more)

### Community 6 - "budgets/[id]/page.tsx"
Cohesion: 0.18
Nodes (29): BudgetPage(), Legend(), EmptyRecords(), metadata, PrivacyPage(), SECTIONS, RecordPage(), StatementPage() (+21 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.07
Nodes (46): class-variance-authority, radix-ui, AppHeader(), AppearanceOption, APPEARANCES, AppearanceSwitch(), AppSidebar(), SyncDot() (+38 more)

### Community 8 - "dashboard.ts"
Cohesion: 0.12
Nodes (37): summarize(), avg(), BREAKDOWN_MONTHS, buildCashflowHistory(), buildCategories(), buildComparison(), buildMonthlyBudgets(), buildProjection() (+29 more)

### Community 9 - "primitives.tsx"
Cohesion: 0.08
Nodes (54): Providers(), AlertAction(), CardFooter(), ComboboxCollection(), ComboboxValue(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+46 more)

### Community 10 - "data.ts"
Cohesion: 0.09
Nodes (23): AccountRow, AllocationRow, AnalyticsMonthRow, BudgetRecordRow, BudgetRow, DuplicateDismissalRow, MonthlyBudgetAmountRow, MonthlyBudgetDefaultRow (+15 more)

### Community 11 - "suggestions.ts"
Cohesion: 0.07
Nodes (48): Rule, RuleSentence(), StatementRulesPage(), ruleValueLabel(), byCreation(), conditionPattern(), listStatementRules(), matchesStatement() (+40 more)

### Community 12 - "compilerOptions"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, allowSyntheticDefaultImports, allowUnusedLabels, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules (+25 more)

### Community 13 - "editors.ts"
Cohesion: 0.14
Nodes (19): containedFooter(), editors, longName, expectHeldRead(), expectRetainedRows(), expectSilentSheet(), expectVisibleBackdrop(), account (+11 more)

### Community 14 - "use-appearance.tsx"
Cohesion: 0.26
Nodes (14): Appearance, applyAppearance(), getStoredAppearance(), handleSystemThemeChange(), initializeAppearance(), isDarkMode(), listeners, mediaQuery() (+6 more)

### Community 15 - "round2"
Cohesion: 0.15
Nodes (33): getBudgetAnalytics(), getCategoryData(), BudgetProgressChart(), BudgetProgressPoint, buildSeries(), PendingStatementConfirmationSheet(), RecordOption(), RecordSearchSheet() (+25 more)

### Community 16 - "cn"
Cohesion: 0.14
Nodes (33): CategoryFilter(), CategoryFilterItem(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty() (+25 more)

### Community 17 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, cmdk, dexie, dexie-react-hooks, @fontsource-variable/inter (+22 more)

### Community 18 - "test"
Cohesion: 0.14
Nodes (18): cardTitles, card(), chartTooltip, overview, overviewCharts, themedRgb(), ScenarioName, WorkspaceDataset (+10 more)

### Community 19 - "routes.ts"
Cohesion: 0.15
Nodes (24): ReviewLinks(), NotFound(), nextConfig, next, TITLES, WorkflowTabs(), useDefaultFilterEndDateToday(), useDefaultFilterStartDate() (+16 more)

### Community 20 - "records.ts"
Cohesion: 0.12
Nodes (29): CategoryRow, RecordRow, canUseMonthlyBudget(), AnalyticsRecord, AnalyticsSummary, contribution(), summaryMeasure(), getDrilldown() (+21 more)

### Community 21 - "animations/editors.e2e.ts"
Cohesion: 0.14
Nodes (22): editors, denseCardConsumers, denseRowConsumers, expectConsumerEntrance(), populatedConsumers, chooseCategory(), attachSamplingFailure(), expectModalEntrance() (+14 more)

### Community 22 - "suspicious"
Cohesion: 0.07
Nodes (28): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+20 more)

### Community 23 - "category-history-chart.tsx"
Cohesion: 0.25
Nodes (12): aggregateSeries(), CategoryHistoryChart(), ChartMonth, ChartSeries, MonthBreakdown(), MonthTick(), monthTotal(), prepareMonths() (+4 more)

### Community 24 - "package.json"
Cohesion: 0.07
Nodes (29): private, $schema, type, babel-plugin-react-compiler, @biomejs/biome, clsx, cmdk, @fontsource-variable/inter (+21 more)

### Community 25 - "duplicates.ts"
Cohesion: 0.22
Nodes (16): allocationOutcome(), descriptionAnchors(), descriptionIdentity(), dismissDuplicatePair(), DuplicateGroup, duplicateGroups(), DuplicateStatement, duplicateStatementIds() (+8 more)

### Community 26 - "correctness"
Cohesion: 0.08
Nodes (26): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInvalidBuiltinInstantiation, noInvalidConstructorSuper, noNonoctalDecimalEscape (+18 more)

### Community 27 - "export-import.ts"
Cohesion: 0.16
Nodes (23): COUNT_ROWS, DataSettingsPage(), StateRow(), STATUS_TONES, StatusTone, WorkspaceRow(), clearAllData(), downloadExport() (+15 more)

### Community 28 - "export-import.ts"
Cohesion: 0.30
Nodes (9): db, SYNC_TABLES, TableName, TABLES, DEFAULT_SETTINGS, FinpointSettings, readSettings(), replaceSettings() (+1 more)

### Community 29 - "core/components.e2e.ts"
Cohesion: 0.15
Nodes (9): desktopOnly, bounds(), contained(), expectWheelScrollsPageWhileOpen(), expectDropdownPreservesScroll(), scrollWithInput(), settledOverlayAlpha(), APP_URL (+1 more)

### Community 30 - "test-data.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGETS, EXPORT_VERSION, FinpointExport, migrateRecordChoices(), SEED_HASH_KEY, BANK_BLURB, between() (+12 more)

### Community 31 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "core/routes.e2e.ts"
Cohesion: 0.16
Nodes (15): @playwright/test, Child, october, september, PREMATURE, routeReady, titles, expectPointerCursor() (+7 more)

### Community 33 - "types.d.ts"
Cohesion: 0.10
Nodes (20): Account, Allocation, AnalyticsSummary, AnalyticsTreatment, Appearance, Budget, Category, CategoryWithChildren (+12 more)

### Community 34 - "history.tsx"
Cohesion: 0.39
Nodes (7): getStoredHistory(), getValidHistory(), HistoryContext, HistoryItem, HistoryProvider(), normaliseUrl(), withoutTrailingSelf()

### Community 35 - "auth-vault.ts"
Cohesion: 0.29
Nodes (14): POST(), POST(), POST(), jose, AUTH_COOKIE_NAME, authCookie(), authCookieConfig(), clientIp() (+6 more)

### Community 36 - "allocator/page.tsx"
Cohesion: 0.16
Nodes (42): AccountPage(), AllocatorPage(), ScopeSelect(), byRecordDay, FILTER_KEYS, Filters, MonthlyRecordFilters(), MonthlyRecordsPage() (+34 more)

### Community 37 - "luxon"
Cohesion: 0.09
Nodes (22): dexie, fake-indexeddb, xlsx, DB_NAME, DB_VERSION, FinpointDB, MetaRow, SettingsRow (+14 more)

### Community 39 - "alert-dialog.tsx"
Cohesion: 0.34
Nodes (12): DriveOverwriteConfirmation(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 40 - "statements.ts"
Cohesion: 0.18
Nodes (21): asPending(), dayDifference(), ensureCanReplace(), maskDescription(), ReplacementAllocation, replacementComparison(), replacementReason(), ReplacementStatement (+13 more)

### Community 41 - "providers.tsx"
Cohesion: 0.25
Nodes (5): metadata, RootLayout(), viewport, react-dom, root

### Community 43 - "IndexedDB (Dexie)"
Cohesion: 0.20
Nodes (8): app/**/page.tsx, IndexedDB (Dexie), Interactive routes are "use client" (search params via next/navigation), Pages take no props, Root Suspense (keeps routes static), String primary keys (not auto-increment), URL search params (filters and pagination), useLiveQuery

### Community 44 - "formatter"
Cohesion: 0.15
Nodes (13): arrowParentheses, bracketSameLine, bracketSpacing, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas (+5 more)

### Community 45 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, babel-plugin-react-compiler, @biomejs/biome, fake-indexeddb, @playwright/test, @tailwindcss/postcss, @types/luxon, @types/node (+5 more)

### Community 46 - "categories/page.tsx"
Cohesion: 0.17
Nodes (15): CategoryDialogState, CategoryTile(), SECTIONS, CashflowChart(), CashflowPoint, CategoryMovers(), Mover, MonthlyBudgetUsage() (+7 more)

### Community 48 - "Commands"
Cohesion: 0.38
Nodes (7): Biome (biome check --write), bun install, bun lint (write-mode), bun lint:check, bun run build, bun types:check, Commands

### Community 49 - "Next.js agent rules block ("This is NOT the Next.js you know")"
Cohesion: 0.18
Nodes (9): app/api/auth/* Route Handlers, bun test, node_modules/next/dist/server/lib/generate-agent-files.js, Google OAuth broker (exchange/token/logout), Domain and importer tests (Dexie with in-memory IndexedDB), Next.js App Router app (mostly client-side), node_modules/next/dist/docs/, npm run dev (port 5173) (+1 more)

### Community 50 - "Validator"
Cohesion: 0.29
Nodes (15): updateAccount(), validateBudget(), cleanInput(), restoreDuplicatePair(), createMonthlyBudget(), setMonthlyBudgetAmount(), updateMonthlyBudget(), upsertMonthlyBudget() (+7 more)

### Community 51 - "biome.json"
Cohesion: 0.18
Nodes (10): source, assist, actions, files, includes, linter, enabled, overrides (+2 more)

### Community 52 - "rules"
Cohesion: 0.18
Nodes (11): noAdjacentSpacesInRegex, noBannedTypes, noExtraBooleanCast, noUselessCatch, noUselessThisAlias, noUselessTypeConstraint, rules, noFloatingPromises (+3 more)

### Community 54 - "src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)"
Cohesion: 0.28
Nodes (10): Background Drive sync, src/data/* (persistence, migrations, seeding, backup serialization, Drive storage), src/logic/* (domain reads and operations), (month) route-group shell (Overview + Monthly Records), Project Shape, React Compiler (enabled), src/routes.ts (centralized route paths), Static content pages (privacy, terms) are server components (+2 more)

### Community 55 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, scope, short_name, start_url (+1 more)

### Community 56 - "spending-calendar.tsx"
Cohesion: 0.29
Nodes (9): compact(), heat(), INK, LEVELS, quantile(), rampCap(), SpendingCalendar(), STRENGTH (+1 more)

### Community 57 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:check, start, test:e2e, types:check (+1 more)

### Community 58 - "trend-chart.tsx"
Cohesion: 0.20
Nodes (15): bar(), BarChart(), BarSeries, PAD, ChartFrame(), ChartSize, ReadoutRows(), PAD (+7 more)

### Community 59 - "auto-sync.ts"
Cohesion: 0.18
Nodes (26): AuthNeededError, cacheToken(), CodeResponse, disconnectDrive(), downloadBackupFile(), driveFetch(), DriveFileMeta, ensureDriveToken() (+18 more)

### Community 60 - "formatter"
Cohesion: 0.25
Nodes (8): formatter, attributePosition, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding, lineWidth

### Community 61 - "Records"
Cohesion: 0.32
Nodes (8): Allocator, Budgets, Categories, Dashboard, Statement-allocation-record model, Monthly Budgets, Records, Statement importer

### Community 63 - "Domain docs (single-context layout)"
Cohesion: 0.40
Nodes (6): Agent skills, CONTEXT.md, Domain docs (single-context layout), Domain Language, Issue tracker (local specs and tickets), .scratch/ local work tracking

### Community 64 - "optionalDependencies"
Cohesion: 0.29
Nodes (7): optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-win32-x64-msvc, @rollup/rollup-linux-x64-gnu, @rollup/rollup-win32-x64-msvc, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-win32-x64-msvc

### Community 65 - "tsconfig.e2e.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, incremental, exclude, extends, include

### Community 66 - "0001-drill-down-url-state.md"
Cohesion: 0.25
Nodes (8): Record focus, Statement pivot, Gross and net category selection URL, Drill-down, Drill-down URL state, Forecast and Monthly Budget Drill-down with explicit scope, Category and trend Drill-down, Calendar day Drill-down

### Community 67 - "style"
Cohesion: 0.33
Nodes (6): style, noNamespace, noNonNullAssertion, useArrayLiterals, useAsConstAssertion, useBlockStatements

### Community 68 - "0002 Forecast pacing"
Cohesion: 0.33
Nodes (5): 0002 Forecast pacing, Consequences, Context, Decision, Rejected option

### Community 69 - "Validation rule (ValidationError + Validator)"
Cohesion: 0.50
Nodes (4): Old Laravel Api/*Controller mapping, Laravel-shaped { field: string[] } error maps, ValidationError, Validator

### Community 70 - "Finpoint icon concept"
Cohesion: 0.40
Nodes (5): Finpoint icon concept, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 71 - "Finpoint icon with charcoal shadow"
Cohesion: 0.40
Nodes (5): Finpoint icon with charcoal shadow, Charcoal shadow halo, Circular point, Rounded F monogram, Off-white icon fill

### Community 72 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Files, Issue tracker: Local Markdown, Skill operations, Status and dependencies

### Community 73 - "Finpoint"
Cohesion: 0.50
Nodes (4): Finpoint, Circular point, Rounded F monogram, Off-white icon fill

### Community 74 - "Domain docs"
Cohesion: 0.50
Nodes (3): Before exploration, Domain docs, Writing

### Community 75 - "Local Markdown Issue Tracker"
Cohesion: 0.50
Nodes (4): Local Tracker Operations, Spec and Ticket Files, Ticket Lifecycle, Local Markdown Issue Tracker

### Community 77 - "Google Drive sync"
Cohesion: 0.50
Nodes (4): Google Drive sync, JSON backup and restore, Local-first finance tracking, Sync conflict handling

### Community 78 - "Forecast pacing decision"
Cohesion: 0.67
Nodes (3): Forecast pacing decision, Remaining historical spending scaled by remaining days, Median daily spending fallback including zero days

### Community 79 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 80 - "JPG favicon icon"
Cohesion: 0.67
Nodes (3): JPG favicon dot, JPG favicon F letterform, JPG favicon icon

### Community 81 - "PNG favicon icon"
Cohesion: 0.67
Nodes (3): PNG favicon dot, PNG favicon F letterform, PNG favicon icon

### Community 82 - "SVG favicon icon"
Cohesion: 0.67
Nodes (3): SVG favicon dot, SVG favicon F letterform, SVG favicon icon

### Community 83 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 84 - "F monogram icon"
Cohesion: 0.67
Nodes (3): Circular dot beside F, Rounded F letterform, F monogram icon

### Community 87 - "pagination.tsx"
Cohesion: 0.38
Nodes (11): pageHref(), pageWindow(), PaginationFooter(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink() (+3 more)

### Community 94 - "Button"
Cohesion: 0.12
Nodes (30): AccountCard(), AccountRow, AccountsPage(), BUDGET_STATES, BudgetCard(), BudgetsPage(), BudgetState, formatBudgetDateWindow() (+22 more)

### Community 95 - "ledger.e2e.ts"
Cohesion: 0.28
Nodes (16): collectTests(), conditionBranch(), detailsTags(), disabled(), mentionsMotion(), record(), splitTestCallee(), tagValues() (+8 more)

### Community 96 - "lucide-react"
Cohesion: 0.22
Nodes (11): lucide-react, react-day-picker, buttonVariants, Calendar(), CalendarDayButton(), ButtonVariant, Month, MonthCal() (+3 more)

### Community 99 - "Statement"
Cohesion: 0.09
Nodes (26): CONTEXT.md (domain vocabulary), Account, Allocation, Budget, Category, Duplicate Statement, Monthly Budget, Pending Record (+18 more)

### Community 100 - "(month)/page.tsx"
Cohesion: 0.16
Nodes (19): Comparison, comparisonText(), ComparisonValue, DashboardData, DashboardMonthlyBudget, DashboardPage(), DashboardView, DemoOffer() (+11 more)

### Community 101 - "ledger.e2e.ts"
Cohesion: 0.29
Nodes (4): vite, @vitejs/plugin-react, harnessDir, repoRoot

### Community 102 - "duplicates/page.tsx"
Cohesion: 0.16
Nodes (38): CARD_MOTION, DuplicateGroupCard(), FixDuplicatesPage(), GroupHeader(), highlightDifferences(), VIEWS, AllocatorPendingPage(), CandidatePage (+30 more)

### Community 103 - "utils.ts"
Cohesion: 0.25
Nodes (13): AllocateBar(), AllocationProgress(), AllocationRows(), AllocationSource, Sparkline(), DrillPanel(), RecordAmount(), TRANSITION (+5 more)

### Community 104 - "lib/motion.ts"
Cohesion: 0.20
Nodes (14): MonthLayout(), framer-motion, luxon, SearchInit, useMonthParams(), armMonthTransition(), takeMonthDirection(), useMonthTransition() (+6 more)

### Community 106 - "providers.tsx"
Cohesion: 0.33
Nodes (6): Boot(), useSyncToasts(), subscribeSyncEvents(), CategoryInput, listCategoryIconNames(), TREATMENT_VALUES

### Community 107 - "Commands"
Cohesion: 0.40
Nodes (4): Agent Behavior, Generated / Ignored Files, src/components/*, src/components/ui/**/*

## Knowledge Gaps
- **92 isolated node(s):** `@fontsource-variable/inter`, `shadcn`, `tailwindcss`, `tw-animate-css`, `@biomejs/biome` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 605 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `record-columns.tsx`, `paginated-data-table.tsx`, `budgets/[id]/page.tsx`, `sidebar.tsx`, `primitives.tsx`, `suggestions.ts`, `round2`, `routes.ts`, `category-history-chart.tsx`, `export-import.ts`, `allocator/page.tsx`, `alert-dialog.tsx`, `categories/page.tsx`, `spending-calendar.tsx`, `trend-chart.tsx`, `pagination.tsx`, `Button`, `lucide-react`, `(month)/page.tsx`, `duplicates/page.tsx`, `utils.ts`, `lib/motion.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `shadcn`, `tailwindcss` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05323296141954564 - nodes in this community are weakly interconnected._
- **Why does `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` connect `src/data/* (persistence, migrations, seeding, backup serialization, Drive storage)` to `providers.tsx`, `IndexedDB (Dexie)`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `Tests README` be split into smaller, more focused modules?**
  _Cohesion score 0.05928614640048397 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `record-columns.tsx`, `paginated-data-table.tsx`, `auto-sync.ts`, `budgets/[id]/page.tsx`, `sidebar.tsx`, `primitives.tsx`, `suggestions.ts`, `use-appearance.tsx`, `round2`, `cn`, `routes.ts`, `category-history-chart.tsx`, `package.json`, `export-import.ts`, `history.tsx`, `allocator/page.tsx`, `alert-dialog.tsx`, `providers.tsx`, `categories/page.tsx`, `spending-calendar.tsx`, `trend-chart.tsx`, `pagination.tsx`, `Button`, `lucide-react`, `(month)/page.tsx`, `duplicates/page.tsx`, `utils.ts`, `lib/motion.ts`, `providers.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `ledger.e2e.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10837438423645321 - nodes in this community are weakly interconnected._